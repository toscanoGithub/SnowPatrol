import Constants from "expo-constants";
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { Button, Text } from '@ui-kitten/components';
import theme from "../../theme.json";
import { LocationObject, getCurrentPositionAsync } from "expo-location";
import { getDatabase, ref, set } from "firebase/database";
import { database } from '../../../firebase/firebase-config'; // Import Firebase config
import { useDriverContext } from "@/contexts/DriverContext";

const GOOGLE_API_KEY = Constants?.expoConfig?.extra?.GOOGLE_API_KEY;

interface RouteOptimizerProps {
  placeIds: string[];
  splitAmount: number;
  showRouteInfo: () => void;
  driverLocation: LocationObject | null;
  driverId: string; // Add driverId to update location
}

const DriverRouteOptimizer: React.FC<RouteOptimizerProps> = ({ placeIds, splitAmount, showRouteInfo, driverLocation, driverId }) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [route, setRoute] = useState<any | null>(null);
  const [routeStarted, setRouteStarted] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    fetchPlaces();
    console.log("qqqqqqqqqq", driverId);
    

  }, [placeIds]);

  useEffect(() => {
    if (places.length > 0 && driverLocation) {
      centerMapOnDriver();
    }
  }, [places, driverLocation]);

  useEffect(() => {
    if (places.length > 0 && driverLocation && routeStarted) {
      optimizeRoute();
    }
  }, [places, driverLocation, routeStarted]);

  useEffect(() => {
    // Update the driver's location in Firebase every time it changes
    if (driverLocation && driverId) {
      updateDriverLocationInFirebase(driverLocation);
    }
  }, [driverLocation]);

  const fetchPlaces = async () => {
    try {
      const placesData = await Promise.all(
        placeIds.map(async (placeId) => {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`);
          return response.data.result;
        })
      );
      const validPlaces = placesData.filter(place => place.geometry && place.geometry.location);
      setPlaces(validPlaces);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const updateDriverLocationInFirebase = (location: LocationObject) => {
    console.log(":::::::::::::: updateDriverLocationInFirebase :::::::::::::::");
    
    const driverLocationRef = ref(database, `drivers/${driverId}/location`);
    set(driverLocationRef, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: Date.now(),
    });
  };

  const centerMapOnDriver = () => {
    if (driverLocation) {
      const newRegion = {
        latitude: driverLocation.coords.latitude,
        longitude: driverLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  const optimizeRoute = async () => {
    if (places.length === 0) return;

    const waypoints = places.map(place => ({
      location: { lat: place.geometry.location.lat, lng: place.geometry.location.lng }
    }));
    const origin = waypoints[0].location;
    const destination = waypoints[waypoints.length - 1].location;

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          waypoints: waypoints.slice(1, -1).map(point => `${point.location.lat},${point.location.lng}`).join('|'),
          optimize_waypoints: true,
          key: GOOGLE_API_KEY,
        },
      });

      if (response.data.routes.length > 0) {
        setRoute(response.data.routes[0]);
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
    }
  };

  const openGoogleMaps = () => {
    if (!driverLocation || places.length === 0) return;

    // Driver's location as origin
    const origin = `${driverLocation.coords.latitude},${driverLocation.coords.longitude}`;

    // Last place as destination
    const destination = `${places[places.length - 1].geometry.location.lat},${places[places.length - 1].geometry.location.lng}`;

    // Waypoints (all places except the first and last one)
    const waypoints = places.slice(1, -1).map(place => `${place.geometry.location.lat},${place.geometry.location.lng}`).join('|');

    // Construct the Google Maps URL with or without waypoints
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    if (waypoints) {
      googleMapsUrl += `&waypoints=${encodeURIComponent(waypoints)}`;
    }

    console.log('Google Maps URL:', googleMapsUrl); // Debugging

    // Open the Google Maps URL
    Linking.openURL(googleMapsUrl).catch(err => console.error('Error opening Google Maps:', err));
  };

  const getPolyline = () => {
    if (!route) return [];

    return route.legs.reduce((acc: any[], leg: any) => {
      leg.steps.forEach((step: any) => {
        const stepPolyline = step.polyline.points;
        acc.push(...decodePolyline(stepPolyline));
      });
      return acc;
    }, []);
  };

  const decodePolyline = (encoded: string) => {
    let index = 0;
    const coordinates: any[] = [];
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return coordinates;
  };

  const resizeText = () => {
    return (splitAmount === 0 ? 16 : 70 / splitAmount);
  }

  // Rotate See details text
    const verticalText = (text: string) => {
      return (
        <View style={styles.rotatedTextContainer}>
          {text.split('').map((char, index) => (
            <Text key={index} style={[styles.verticalChar, {fontSize: resizeText()}]}>
              {char}
            </Text>
          ))}
        </View>
      );
    }

  return (
    <View style={{ position: "relative", flexDirection: "row", flex: 1, }}>
      <Button
        onPress={openGoogleMaps}  // Open Google Maps when the button is pressed
        style={{ backgroundColor: theme["color-primary-600"],}}
      >
        {verticalText("Open in Google Maps")}
      </Button>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
          />
        ))}

        {route && (
          <Polyline
            coordinates={getPolyline()}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}

        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.coords.latitude,
              longitude: driverLocation.coords.longitude,
            }}
            title="Driver's Location"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    flex: 1,
  },

  verticalChar: {
    writingDirection: 'ltr',
    textTransform:"capitalize",
    textAlign: "center",
    color:"#E4EDF7",
  },

  rotatedTextContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});

export default DriverRouteOptimizer;
