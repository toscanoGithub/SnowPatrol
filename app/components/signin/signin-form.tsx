import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Radio, RadioGroup, Text } from '@ui-kitten/components';
import CustomerForm from "./user-type/CustomerForm";
import ContractorForm from './user-type/ContractorForm';
import DriverForm from './user-type/DriverForm';
import { Customer } from '@/types/User';


interface signinProp {
  dismissModal: () => void;  // Defining the function prop type
  iHaveFocus: () => void;
}

const SigninForm: React.FC<signinProp> = ({ dismissModal, iHaveFocus }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userType, setUserType] = useState("");
  const [modalViewHeight, setModalViewHeight] = useState(80)

  const getUserType = (index: number) => {
    switch (index) {
      case 0:
        return "Customer"
      case 1:
      return "Contractor"
      case 2:
      return "Driver"
    
      default:
        return "Admin"
    }
  }


  useEffect(() => {
    setUserType(getUserType(selectedIndex))
  }, [selectedIndex])


  const listenToFormFocusEvent = () => {
    iHaveFocus()
  }

  const populateForm = () => {
    switch (userType) {
      case "Customer":
        return <CustomerForm formHasFocus={listenToFormFocusEvent}  dismissModal={dismissModal} />
      case "Contractor":
        return <ContractorForm formHasFocus={listenToFormFocusEvent} dismissModal={dismissModal} />
      case "Driver":
        return <DriverForm formHasFocus={listenToFormFocusEvent} dismissModal={dismissModal} />
    
      default:
        break;
    }
  }
  
  return (
    <View>
      <Text style={{textAlign:"center"}} category='h6'>
        I'm a {userType}
      </Text>
      <RadioGroup 
      style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center", width: "50%"}}
         selectedIndex={selectedIndex}
        onChange={index => setSelectedIndex(index)}
      >
        <Radio status='success'>{evaProps => <Text style={{fontSize: 15, marginLeft: 8, marginRight: 20}}>Customer</Text>}</Radio>
        <Radio status='success'>{evaProps => <Text style={{fontSize: 15, marginLeft: 8, marginRight: 20}}>Contractor</Text>}</Radio>
        <Radio status='success'>{evaProps => <Text style={{fontSize: 15, marginLeft: 8, marginRight: 20}}>Driver</Text>}</Radio>
      </RadioGroup>

      <Divider style={{opacity:0.3, marginTop: 10, marginBottom: 15}} />

      <View>
        {populateForm()}

        
      </View>
    </View>
  )
}

export default SigninForm

const styles = StyleSheet.create({})