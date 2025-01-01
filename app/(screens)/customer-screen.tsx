import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/firebase-config'; // Firebase config
import { Button } from '@ui-kitten/components';
import theme from "../theme.json";
import { useUserContext } from '../../contexts/UserContext';  // Assuming you have UserContext to get customer info
import { useCustomerrContext } from '@/contexts/CustomerContext';

interface CustomerScreenProps {}

const CustomerScreen: React.FC<CustomerScreenProps> = () => {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default initial latitude
    longitude: -122.4324, // Default initial longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true);

  const { user } = useUserContext();
  const { getCustomerById } = useCustomerrContext();

  useEffect(() => {
    console.log("customer id ", user?.id);
    setDriverId(user?.driver?.id || 'no driver id');
  }, [user?.id]);

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
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
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

  const openGoogleMaps = () => {
    console.log('Open Google Maps for route');
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
      <Button
        onPress={openGoogleMaps}
        style={{ backgroundColor: theme["color-primary-600"] }}
      >
        Open Route in Google Maps
      </Button>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Allow customer to manually move the map
        showsUserLocation={false}
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
