import Constants from "expo-constants";

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/firebase-config'; // Firebase config
import { Button } from '@ui-kitten/components';
import theme from "../theme.json";
import { useUserContext } from '../../contexts/UserContext';  // Assuming you have UserContext to get customer info
import { useCustomerrContext } from '@/contexts/CustomerContext';
import axios from 'axios';

const GOOGLE_API_KEY = Constants?.expoConfig?.extra?.GOOGLE_API_KEY;

interface CustomerScreenProps {}

const CustomerScreen: React.FC<CustomerScreenProps> = () => {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [customerLocation, setCustomerLocation] = useState<any>(null); // State to store customer location
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default initial latitude
    longitude: -122.4324, // Default initial longitude
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(true);

  const { user } = useUserContext();
  const { getCustomerById } = useCustomerrContext();

  const currentCustomer = getCustomerById(user?.id ?? "")

  // Fetching the customer's location using the placeId
  useEffect(() => {
    if(!currentCustomer?.driver) return;
    if(!currentCustomer!.driver.id) return;
    if(!currentCustomer.placeID) return;
    setDriverId(currentCustomer!.driver!.id);

    if (currentCustomer!.placeID !== "") {
      // Replace with an API request to fetch customer's geolocation from Google Places API
      axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${currentCustomer!.placeID}&key=${GOOGLE_API_KEY}`)
        .then(response => {
          const customerLocationData = response.data.result.geometry.location;
          setCustomerLocation(customerLocationData);
          // Optionally, center the map on the customer’s location initially
          centerMapOnCustomer(customerLocationData);
        })
        .catch(error => {
          console.error("Error fetching customer location:", error);
        });
    }
  }, [currentCustomer?.driver]);

  // Fetching driver's real-time location once driverId is available
  useEffect(() => {
    if (!driverId) return;

    const driverLocationRef = ref(database, `/drivers/${driverId}/location`);
    onValue(driverLocationRef, (snapshot) => {
      const location = snapshot.val();
      if (location) {
        setDriverLocation(location);
        centerMapOnDriver(location);
        setLoading(false); // Once we have the location, stop the loading spinner
      } else {
        console.log("Driver location not available yet");
      }
    });

    return () => {
      const driverLocationRef = ref(database, `/drivers/${driverId}/location`);
      off(driverLocationRef); // Clean up the listener when the component unmounts
    };
  }, [driverId]); // Re-fetch when the driverId changes

  const centerMapOnDriver = (location: any) => {
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04,
    };
    setRegion((prevRegion) => {
      // Update the region only if it's different (to avoid unnecessary re-renders)
      if (
        prevRegion.latitude !== newRegion.latitude ||
        prevRegion.longitude !== newRegion.longitude
      ) {
        return newRegion;
      }
      return prevRegion;
    });
  };

  const centerMapOnCustomer = (location: any) => {
    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    setRegion(newRegion);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme["color-primary-600"]} />
        <Text>Loading Driver's Location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Allow customer to manually move the map
        showsUserLocation={false} // Do not show the customer's location on the map
      >
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="Driver's Location"
            pinColor="blue"
          />
        )}

        {customerLocation && (
          <Marker
            coordinate={{
              latitude: customerLocation.lat,
              longitude: customerLocation.lng,
            }}
            title={currentCustomer?.address}
            pinColor="green" // Use green for customer marker
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
});

export default CustomerScreen;
