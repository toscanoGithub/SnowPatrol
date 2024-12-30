import Constants from "expo-constants"

import { Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RouteOptimizer from './RouteOptimizer';
import axios from 'axios';
import { useCustomerrContext } from '@/contexts/CustomerContext';



const GOOGLE_API_KEY = Constants?.expoConfig?.extra?.GOOGLE_API_KEY;  // see app.json >> extra
const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

// Types for the Google Maps Directions API response
interface Location {
  lat: number;
  lng: number;
}

interface Step {
  end_location: Location;
  end_address: string;
}

interface Leg {
  steps: Step[];
}

interface Route {
  legs: Leg[];
}

interface DirectionsResponse {
  status: string;
  routes: Route[];
}

interface RouteSplitterProps {
  splitAmount: number;
  shareRouteInfo: (placeIds: string[]) => void;
}


const RouteSplitter: React.FC<RouteSplitterProps> = ({splitAmount, shareRouteInfo}) => {
    const {customers} = useCustomerrContext()
    const [routes, setRoutes] = useState<Leg[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Leg | null>(null)
    const [placeIds, setPlaceIds] = useState<string[]>([])
    const [firstPlaceIds, setFirstPlaceIds] = useState<string[]>([])
    const [secondPlaceIds, setSecondPlaceIds] = useState<string[]>([])
    const [thirdPlaceIds, setThirdPlaceIds] = useState<string[]>([])
    const [fourthPlaceIds, setFourthPlaceIds] = useState<string[]>([])

    

  // Helper function to fetch directions from the Google Maps API
const getDirections = async (waypoints: string[]) => {
    try {
      const origin = waypoints[0];
      const destination = waypoints[waypoints.length - 1];
      const waypointsParam = waypoints.slice(1, -1).join('|');
  
      const response = await axios.get<DirectionsResponse>(API_URL, {
        params: {
          origin,
          destination,
          waypoints: waypointsParam,
          key: GOOGLE_API_KEY,
        },
      });
  
      if (response.data.status === 'OK') {
        const route = response.data.routes[0].legs;
        setRoutes(route);
        setSelectedRoute(route[0]); // You can choose a specific leg if necessary
      } else {
        Alert.alert('Error', 'Could not fetch directions');
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      Alert.alert('Error', 'An error occurred while fetching the route.');
    }
  };

  useEffect(() => {
    splitRoutes()
  }, [splitAmount])
  
  
  // Function to split the customers into different routes (for example, two routes)
  const splitRoutes = () => {
    if(splitAmount === 2) {
      const midpoint = Math.floor(customers.length / 2);
      const firstRouteCustomers = customers.slice(0, midpoint);
      const secondRouteCustomers = customers.slice(midpoint);
      firstRouteCustomers.forEach(c => setFirstPlaceIds(prev => [...prev, c.placeID]))
      secondRouteCustomers.forEach(c => setSecondPlaceIds(prev => [...prev, c.placeID]))
    } else if(splitAmount === 3) {
      const oneThird = Math.floor(customers.length / 3);
      const firstRouteCustomers = customers.slice(0, oneThird);
      const secondRouteCustomers = customers.slice(oneThird, oneThird * 2);
      const thirdRouteCustomers = customers.slice(oneThird * 2);
      firstRouteCustomers.forEach(c => setFirstPlaceIds(prev => [...prev, c.placeID]))
      secondRouteCustomers.forEach(c => setSecondPlaceIds(prev => [...prev, c.placeID]))
      thirdRouteCustomers.forEach(c => setThirdPlaceIds(prev => [...prev, c.placeID]))
    } else if(splitAmount === 4) {
      const oneQuarter = Math.floor(customers.length / 4);
      const firstRouteCustomers = customers.slice(0, oneQuarter);
      const secondRouteCustomers = customers.slice(oneQuarter, oneQuarter * 2);
      const thirdRouteCustomers = customers.slice(oneQuarter * 2, oneQuarter * 3);
      const fourthRouteCustomers = customers.slice(oneQuarter * 3);
      firstRouteCustomers.forEach(c => setFirstPlaceIds(prev => [...prev, c.placeID]))
      secondRouteCustomers.forEach(c => setSecondPlaceIds(prev => [...prev, c.placeID]))
      thirdRouteCustomers.forEach(c => setThirdPlaceIds(prev => [...prev, c.placeID]))
      fourthRouteCustomers.forEach(c => setFourthPlaceIds(prev => [...prev, c.placeID]))
    }
    // getDirections(firstRouteCustomers.map((customer) => customer.address));
    // getDirections(secondRouteCustomers.map((customer) => customer.address));

  };
  
  useEffect(() => {
    setPlaceIds(prev => customers.map(c => c.placeID))
  }, [])

  const layoutTheRoutes = () => {
    switch (splitAmount) {
      case 0:
        return <RouteOptimizer showRouteInfo={() => shareRouteInfo(placeIds)} splitAmount={0} placeIds={placeIds}/>
      case 2:
        return <>
          <RouteOptimizer showRouteInfo={() => shareRouteInfo(firstPlaceIds)} splitAmount={2}  placeIds={firstPlaceIds}/> 
          <RouteOptimizer showRouteInfo={() => shareRouteInfo(secondPlaceIds)} splitAmount={2}  placeIds={secondPlaceIds}/>
        </>
      case 3:
        return <>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(firstPlaceIds)} splitAmount={3} placeIds={firstPlaceIds}/>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(secondPlaceIds)} splitAmount={3} placeIds={secondPlaceIds}/>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(thirdPlaceIds)} splitAmount={3} placeIds={thirdPlaceIds}/>
      </>
      case 4:
        return <>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(firstPlaceIds)} splitAmount={4} placeIds={firstPlaceIds}/>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(secondPlaceIds)} splitAmount={4} placeIds={secondPlaceIds}/>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(thirdPlaceIds)} splitAmount={4} placeIds={thirdPlaceIds}/>
        <RouteOptimizer showRouteInfo={() => shareRouteInfo(fourthPlaceIds)} splitAmount={4} placeIds={fourthPlaceIds}/>
      </>
        
      default:
        break;
    }
  }
  
  return layoutTheRoutes()
}

export default RouteSplitter
const styles = StyleSheet.create({
 
})