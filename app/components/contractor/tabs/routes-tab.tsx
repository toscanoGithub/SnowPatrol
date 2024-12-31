import { Alert, Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SelectItem, Text, Select, IndexPath, ListItem, List } from '@ui-kitten/components';
import ActionSheetAddButton from '../components/action-sheet-add-button';
import PostModal from '../components/post-modal';
import RouteOptimizer from '../../routes/RouteOptimizer';
import { useCustomerrContext } from '@/contexts/CustomerContext';

import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { string } from 'yup';
import RouteSplitter from '../../routes/RouteSplitter';
import RouteDetails from '../../routes/Routedetails';
import { useRouteContext } from '@/contexts/RouteContext';
import { useUserContext } from '@/contexts/UserContext';

const screenHeight = Dimensions.get("screen").height;

const API_KEY = 'AIzaSyBgI-ZMFT0hjPpRGMLuwtQEnniFOrV0WAI'; 
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

const data = new Array(3).fill({
  title: 'Routes',
});



const RoutesTab = () => {
const [modalIsVisible, setModalIsVisible] = useState(false)
const {customers} = useCustomerrContext()
const [selectedRoute, setSelectedRoute] = useState<Leg | null>(null)
const [placeIds, setPlaceIds] = useState<string[]>([])
const [firstPlaceIds, setFirstPlaceIds] = useState<string[]>([])
const [secondPlaceIds, setSecondPlaceIds] = useState<string[]>([])
const [isDetailsVisible, setIsShowDetailsVisible] = useState(false)

const [routePlaceIdsForRouteDetails, setRoutePlaceIdsForRouteDetails] = useState<string[]>([])
// Split
const [splitTo, setSplitTo] = useState(0)

const addButtonPressed = (type: string): void => {
  setModalIsVisible(true)
};

const dismiss = () => {
  setModalIsVisible(false)
  
}
 
useEffect(() => {
    customers.forEach(c => setPlaceIds(prev => [...prev, c.placeID]))
    
  }, [customers])

  const splitPressed = (index: number) => {
    console.log("splitPressed", index);
    setSplitTo(index)
  }
  
  const renderItem = ({ item, index }: { item: { title: string }; index: number }): React.ReactElement => (
    <ListItem onPress={() => splitPressed(index + 2)}  title={`${index + 2} ${item.title} `} />
  );


  const {routes, addRouteToContext} = useRouteContext()
  const {user} = useUserContext()

  const showRouteInfo = (placeIds: string[]) => {
    slideIn()
    setRoutePlaceIdsForRouteDetails(placeIds)
    // addRouteToContext({
    //   placeIds: placeIds,
    //   companyName: user?.companyName
    // })
    
  }

  const slideAnim = React.useRef(new Animated.Value(-screenHeight)).current; // Start off-screen (above the screen)
    
    const slideIn = () => {
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to the top of the screen
          duration: 500, // Animation duration
          useNativeDriver: true, // Use native driver for better performance
        }).start();
        setIsShowDetailsVisible(true);
      };
    
      const slideOut = () => {
        console.log("out");
        
        Animated.timing(slideAnim, {
          toValue: -screenHeight, // Slide back up off-screen
          duration: 500, 
          useNativeDriver: true,
        }).start();
        setIsShowDetailsVisible(false);
      };

return (
  <View style={styles.container}>
   <View style={{width:"100%", flexDirection:"row", justifyContent: "space-between", alignItems:"center"}}>
    <Text category='h6' style={{marginLeft: 10}}>Split in: </Text>
    <View>
    <List horizontal
      data={data}
      renderItem={renderItem}
    />
    </View>
    </View>
      <RouteSplitter  splitAmount={splitTo} shareRouteInfo={showRouteInfo} />

    <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      <RouteDetails dismiss={slideOut} placeIds={routePlaceIdsForRouteDetails} />
    </Animated.View>
    
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
},

overlay: {
  position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
}

});

export default RoutesTab

