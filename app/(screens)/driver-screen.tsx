import { Alert, AppState, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomerrContext } from '@/contexts/CustomerContext';
import { Customer } from '@/types/User';
import { useUserContext } from '@/contexts/UserContext';
import { Button, Text } from '@ui-kitten/components';
import * as Location from 'expo-location';
import DriverRouteOptimizer from '../components/driver/DriverRouteOptimizer';

const DriverScreen = () => {
  const { customers } = useCustomerrContext();
  const { user } = useUserContext();
  
  const [customersForThisDriver, setCustomersForThisDriver] = useState<Customer[]>([]);
  const [placeIdsForThisDriver, setPlaceIdsForThisDriver] = useState<string[]>([]);

  useEffect(() => {
    console.log(":::::::::::::: ", user?.id);
    
    const filteredCustomers = customers.filter(customer => customer.driver?.email === user?.email);
    const ids = filteredCustomers.map(customer => customer.placeID);
    setPlaceIdsForThisDriver(ids);
  }, [customers.length]);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [removeLinkingPanel, setRemoveLinkingPanel] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [patrolStarted, setPatrolStarted] = useState<boolean>(false); // State to track if the patrol has started

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        } else {
          setHasPermission(false);
          if (status === 'denied') {
            showPermissionDeniedAlert();
          }
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
        setHasPermission(false);
        Alert.alert('Error', 'There was an error requesting location permission.');
      }
    };

    checkLocationPermission();

    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      } else {
        setRemoveLinkingPanel(true);
      }
      setAppState(nextAppState);
    });

    return () => {
      appStateListener.remove();
    };
  }, [appState, removeLinkingPanel]);

  const showPermissionDeniedAlert = () => {
    if (!removeLinkingPanel) {
      Alert.alert(
        'Location Permission Denied',
        'You have denied location permission. Please enable it in your device settings.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  // Async function to watch the location
  useEffect(() => {
    if (hasPermission) {
      const startLocationTracking = async () => {
        const locationSubscription = await Location.watchPositionAsync(
          { 
            accuracy: Location.Accuracy.High, 
            timeInterval: 1000,  // Update every 1 second
            distanceInterval: 1, // Update every 1 meter
          },
          (newLocation) => setLocation(newLocation)
        );
        setLocationSubscription(locationSubscription);  // Assign subscription after it's resolved
      };

      startLocationTracking();

      return () => {
        locationSubscription?.remove();  // Clean up when component is unmounted or location permission is changed
      };
    }
  }, [hasPermission]); // Only run when permission status changes

  const startPatrol = () => {
    setPatrolStarted(true); // Update the state to indicate patrol has started
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button 
        disabled={!hasPermission} 
        style={styles.startBtn} 
        status="info" 
        onPress={startPatrol}
      >
        {!patrolStarted ? "Start your patrol" : "On Route"}
      </Button> */}
      
      {/* Render the DriverRouteOptimizer component only after the patrol starts */}
      {location && (
        <DriverRouteOptimizer 
          placeIds={placeIdsForThisDriver} 
          splitAmount={0} 
          showRouteInfo={() => alert('slide panel')} 
          driverLocation={location}  // Pass location to RouteOptimizer
          driverId={user?.id || "to fix later"}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    justifyContent:"center", alignItems:"center",
  },
  startBtn: {
    marginVertical: 5,
  },
});

export default DriverScreen;
