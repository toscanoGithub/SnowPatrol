import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from '@ui-kitten/components'
import { Customer } from '@/types/User'
import theme from "../../../theme.json"
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import ActionSheetAddButton from '../components/action-sheet-add-button'
import PostModal from '../components/post-modal'
import { useCustomerrContext } from '@/contexts/CustomerContext'
import { useUserContext } from '@/contexts/UserContext'
import { LinearGradient } from 'expo-linear-gradient'

  const CustomersTab = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const {customers} = useCustomerrContext()
  const {user} = useUserContext();

  // Filter customers based on user.companyName
  const filteredCustomers = customers.filter(customer => customer?.companyName === user?.companyName);

    const addButtonPressed = (type: string): void => {
      setModalIsVisible(true)
    };

    const dismiss = () => {
      setModalIsVisible(false)
      
    }
    

    const deletePressed = () => {

    }

    const editPressed = () => {

    }

   
  
    
useEffect(() => {
  console.log("new user >>>", user)
}, [user])

    
    const renderCustomerItem = ({ item }: { item: Customer }) => (
        <View style={styles.customerItem}>
            <Text>{item.fullName}</Text> 
            <Text>{item.email}</Text> 
            <Text>{item.phoneNumber}</Text> 
            <Text>Address: {item.address}</Text> 
            <Text>Company: {item.companyName}</Text> 
            <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={deletePressed}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="person-remove-outline" size={25} color="#ff0000" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={editPressed}>
                <View style={styles.iconWrapper}>
                    <AntDesign name="edit" size={25} color="#d1d1d1" />
                </View>
            </TouchableOpacity>
            </View>       
        </View>
      );



  return (
    <View style={styles.container}>
      <ActionSheetAddButton onPress={addButtonPressed}
        iconName="add" // Icon name from Material Icons
        type="Customer"     // Optional label under the button 
        />

        {
            filteredCustomers.length > 0 ? (<LinearGradient style={{flex: 1,}} colors={[theme["gradient-from"], "#e7f0fd"]}><View ><FlatList data={filteredCustomers} renderItem={ renderCustomerItem} keyExtractor={(item) => item.address}
            /></View></LinearGradient>) : <View><Text>No Customer yet</Text></View>
        }

        {modalIsVisible && <PostModal type="Customer" visible={modalIsVisible} dismiss={dismiss} />}
    </View>
  )
}

export default CustomersTab

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
        position:"relative",
        paddingBottom: 60,
        backgroundColor:"#e7f0fd"
    },

    customerItem: {
        padding: 10,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 5,
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -25px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
      },

      actions: {
        flexDirection: "row", alignItems:"center", justifyContent:"flex-end", columnGap: 10,
      },

      button: {

      },

      iconWrapper: {

      }

      
})