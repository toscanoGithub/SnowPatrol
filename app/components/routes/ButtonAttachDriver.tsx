import { useDriverContext } from '@/contexts/DriverContext';
import { Driver } from '@/types/User';
import { Button, Text } from '@ui-kitten/components';
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import theme from "../../theme.json"


interface ButtonAttachDriverProps {
    assignDriver: (driver: Driver) => void;
}
const ButtonAttachDriver: React.FC<ButtonAttachDriverProps> = ({assignDriver}) => {
    const {drivers} = useDriverContext()
    const [isPopoverContentVisible, setIsPopoverContentVisible] = useState(false)

    const driverSelected = (driver: Driver) => {
        setIsPopoverContentVisible(false)
        assignDriver(driver)
    }
    return (
        <View style={styles.container}>
            <Popover
            isVisible={isPopoverContentVisible}
            popoverStyle={{backgroundColor:theme["gradient-to"], backfaceVisibility: "visible"}}
          from={(
            <TouchableOpacity style={{borderWidth: 1, borderRadius: 5, borderColor:"#dedede90", padding: 10,}} onPress={() => setIsPopoverContentVisible(!isPopoverContentVisible)}>
              <Text category='h6'  style={{color:"#dedede90", fontSize: 12}}>Assign & Dispatch</Text>
            </TouchableOpacity>
          )}>
          {
            drivers.map(driver => <Button  status='info' onPress={() => driverSelected(driver)} key={driver.idNumber}>{evaProps => <Text style={{color:"white", fontSize: 14, ...evaProps}} >{driver.fullName}</Text>}</Button>)
          }
        </Popover>
        </View>
      );
  };

export default ButtonAttachDriver


const styles = StyleSheet.create({
    container: {
        marginLeft:"auto",
        
    }
  });