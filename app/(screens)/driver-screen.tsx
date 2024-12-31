import { Alert, AppState, Linking, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomerrContext } from '@/contexts/CustomerContext'
import { Customer } from '@/types/User'
import { useUserContext } from '@/contexts/UserContext'
import { Button, Text } from '@ui-kitten/components'
import RouteOptimizer from '../components/routes/RouteOptimizer'
import * as Location from 'expo-location';

const DriverScreen = () => {
  const {customers} = useCustomerrContext()
  const {user} = useUserContext()
  const [customersForThisDriver, setCustomersForThisDriver] = useState<Customer[]>([])
  const [placeIdsForThisDriver, setPlaceIdsForThisDriver] = useState<string[]>([])
  
  useEffect(() => {
        
    const filteredCustomers = customers.filter(customer => customer.driver?.email === user?.email)
    const ids = filteredCustomers.map(customer => customer.placeID)
    setPlaceIdsForThisDriver(ids)    
  
  }, [customers.length])



  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [removeLinkingPanel, setRemoveLinkingPanel] = useState(false)
  
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        // Check for location permission status
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        } else {
          setHasPermission(false);
          if (status === 'denied') {
            showPermissionDeniedAlert();  // Show alert if permission is denied
          }
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
        setHasPermission(false);
        Alert.alert('Error', 'There was an error requesting location permission.');
      }
    };

    // Check permission on first load
    checkLocationPermission();

    // Set up listener for app state changes (to check permissions when app comes back to foreground)
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        
        // checkLocationPermission();  // Re-check location permissions when app comes back to the foreground
      } else {
        setRemoveLinkingPanel(true)
      }
      setAppState(nextAppState);
    });

    return () => {
      // Cleanup the listener on component unmount
      appStateListener.remove();
    };
  }, [appState, removeLinkingPanel]);  // Re-run when appState changes

  const showPermissionDeniedAlert = () => {
    !removeLinkingPanel && Alert.alert(
      'Location Permission Denied',
      'You have denied location permission. Please enable it in your device settings.',
      [
        {
          text: 'Go to Settings',
          onPress: () => {
            Linking.openSettings(); // Open the app's settings page
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Button disabled={!hasPermission}  style={styles.startBtn} status='info'>Start your patrol</Button>
      <RouteOptimizer placeIds={placeIdsForThisDriver} splitAmount={0} showRouteInfo={function (): void {
        alert("slide panel")
      } } />
    </SafeAreaView>
  )
}

export default DriverScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8FC"
    },

    startBtn: {
      marginVertical: 5,
    }
})