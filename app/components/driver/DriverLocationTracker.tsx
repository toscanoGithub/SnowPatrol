import { useEffect } from 'react';
import { getCurrentPositionAsync, LocationObject } from 'expo-location';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebase/firebase-config'; // Import the Firebase config

const DriverLocationTracker = ({ driverId }: { driverId: string }) => {
  useEffect(() => {
    const updateDriverLocation = async () => {
      const location: LocationObject = await getCurrentPositionAsync();
      const driverLocationRef = ref(database, `drivers/${driverId}/location`);
      // Update the driver's location in Firebase
      set(driverLocationRef, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
      });
    };

    // Update the driver's location every 5 seconds (or as per your requirement)
    const intervalId = setInterval(updateDriverLocation, 5000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [driverId]);

  return null; // The component doesn't need to render anything
};

export default DriverLocationTracker;
