import { Button, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import theme from "../../theme.json"
import { useCustomerrContext } from '@/contexts/CustomerContext';
import { Customer, Driver } from '@/types/User';
import ButtonAttachDriver from './ButtonAttachDriver';

interface RouteDetailsProps {
    dismiss: () => void;
    placeIds: string[];
}
const RouteDetails: React.FC<RouteDetailsProps> = ({dismiss, placeIds}) => {

    const [places, setPlaces] = useState<Customer[]>([]) // a place represent a customer
    const {customers} = useCustomerrContext()
    const showFilteredCustomers = () => {
        // Filter customers whose placeId is in listIds
        const filteredCustomers = customers.filter((customer) =>
            placeIds.includes(customer.placeID)
        );
        setPlaces(filteredCustomers)
        
    }

    useEffect(() => {
      showFilteredCustomers()
    }, [placeIds])
    
    const [attachedDriver, setAttachedDriver] = useState<Driver>()

  return (
    <LinearGradient style={styles.container} colors={[theme["gradient-from"], "#e7f0fd"]}>
      {/* CLOSE BUTTON */}
        <Button
            status="danger" // Optional: Change the button's status to "danger" for a red color
            onPress={dismiss} // Handle the button press
            style={[styles.closeBtn,]}
        >
            {evaProps => <Text style={{color:"red", fontSize: 20, ...evaProps}} >X</Text>}
            
        </Button>
      <View style={{paddingBottom: 150}}>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: 8 }}>
            {attachedDriver && <View>
                <Text category='h6' style={{color:"#dedede90", fontSize: 16}}>{attachedDriver?.fullName}</Text>
                <Text category='h6' style={{color:"#dedede90", fontSize: 16}}>ID number: {attachedDriver?.idNumber}</Text>
            </View>}

        <ButtonAttachDriver assignDriver={(driver: Driver) => setAttachedDriver(driver) } />
        </View>
        <View>
            
                <FlatList data={places} renderItem={({item}) => {
                    return <View style={styles.customerCard}>
                        <Text>{item.fullName}</Text>
                        <Text>{item.email}</Text>
                        <Text>{item.address}</Text>
                    </View>
                }} keyExtractor={(item) => item.placeID}   />
            
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    backgroundColor:"#0466B1",
    
    
  },

  closeBtn: {
    position: "absolute",
    
    right: 10,
    bottom: 25,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    backgroundColor:theme["gradient-to"],
    borderColor: "#000000",
    width: 50, height: 50, 
    zIndex: 3000
  },

  customerCard: {
    padding: 10, 
    // borderWidth: 1, 
    margin: 15,
    borderRadius: 10,
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -25px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"

  }
  
});

export default RouteDetails;
