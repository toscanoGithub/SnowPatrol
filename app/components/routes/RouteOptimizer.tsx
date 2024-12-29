import Constants from "expo-constants"

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { useCustomerrContext } from '@/contexts/CustomerContext';
import { Button, Icon, IconElement, Text } from '@ui-kitten/components';
import theme from "../../theme.json"

const GOOGLE_API_KEY = Constants?.expoConfig?.extra?.GOOGLE_API_KEY;  // see app.json >> extra

interface RouteOptimizerProps {
  placeIds: string[];
  splitAmount: number;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ placeIds, splitAmount }) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [route, setRoute] = useState<any | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const {customers} = useCustomerrContext()

  useEffect(() => {
    fetchPlaces()
  }, [customers.length])

 
  useEffect(() => {
    setTimeout(() => {
      optimizeRoute()
    }, 1000);
  }, [places])
  
  
  // Fetch places details based on Place IDs
  const fetchPlaces = async () => {
    try {
      const placesData = await Promise.all(
        placeIds.map(async (placeId) => {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`);
          return response.data.result;
        })
      );
      // Ensure only valid places are added
      const validPlaces = placesData.filter(place => place.geometry && place.geometry.location);
      setPlaces(validPlaces);
      
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Optimize route and fetch directions
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
        }
      });

      if (response.data.routes.length > 0) {
        setRoute(response.data.routes[0]);
        zoomToMarkers(places);  // Use places
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
    }
  };

  // Calculate the bounding box of all the markers and zoom to it
  const zoomToMarkers = (places: any[]) => {
    const lats = places.map(place => place.geometry.location.lat);
    const lngs = places.map(place => place.geometry.location.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Adjust the region with padding to ensure the markers are not on the edge
    const region = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.2,  // Add some padding to the zoom
      longitudeDelta: (maxLng - minLng) * 1.2,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000); // Animate to the new region over 1 second
    }
  };

  // Initialize on component mount
  useEffect(() => {
    fetchPlaces();
  }, [placeIds]);

  // When route is ready, generate the polyline
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

  // Decode Google Maps polyline into coordinates
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
  return (splitAmount === 0 ? 24 : 70 / splitAmount);
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
      <View style={{position:"relative", flexDirection:"row",  flex: 1, marginVertical: 5, width: `${splitAmount === 0 ? "100%" : "100%"}`}}>
          <Button onPress={() => alert("see details")} style={{alignSelf:"center", height:"100%", backgroundColor:theme["color-primary-600"]}}>
            {verticalText('Info')}
          </Button>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: places[0]?.geometry?.location?.lat || 37.78825,
          longitude: places[0]?.geometry?.location?.lng || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
      </MapView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    flex: 1,
    
  },

  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderTopLeftRadius: 45,

  },

  verticalChar: {
    writingDirection: 'ltr',
    textTransform:"capitalize",
    textAlign: "center",
    color:"#42A4FF"
  },

  rotatedTextContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  }
 
});

export default RouteOptimizer;
