import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { get, ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebase-config'; // Import Firebase config

const CustomerScreen = ({ driverId }: { driverId: string }) => {
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Listen to the driver's location changes in real-time
    const driverLocationRef = ref(database, `drivers/${driverId}/location`);
    const onLocationChange = onValue(driverLocationRef, (snapshot) => {
      const locationData = snapshot.val();
      if (locationData) {
        setDriverLocation(locationData);
        // Optionally, center map on the driver location
        setRegion({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      onLocationChange();
    };
  }, [driverId]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
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
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default CustomerScreen;
