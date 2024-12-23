import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from '@ui-kitten/components'
import { Driver } from '@/types/User'
import theme from "../../../theme.json"
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import ActionSheetAddButton from '../components/action-sheet-add-button'
import PostModal from '../components/post-modal'

interface DriversTabProps {
    drivers: Driver[];  // Define the drivers prop type
  }

  const DriversTab: React.FC<DriversTabProps> = ({ drivers }) => {
    const [modalIsVisible, setModalIsVisible] = useState(false)
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

   
   
    

    
    const renderDriverItem = ({ item }: { item: Driver }) => (
        <View style={styles.driverItem}>
            <Text>{item.fullName}</Text> 
            <Text>{item.email}</Text> 
            <Text>{item.phoneNumber}</Text> 
            <Text>Matricule: {item.idNumber}</Text> 
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
        type="Driver"     // Optional label under the button 
        />

        {
            drivers.length > 0 ? (<View style={{flex: 0.8, backgroundColor:"red"}}><FlatList data={drivers} renderItem={renderDriverItem} keyExtractor={(item) => item.idNumber}
            /></View>) : <View><Text>No driver yet</Text></View>
        }

        {modalIsVisible && <PostModal type="Driver" visible={modalIsVisible} dismiss={dismiss} />}
    </View>
  )
}

export default DriversTab

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
    },

    driverItem: {
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 5,
        // boxShadow: "rgba(230, 45, 70, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.1) 0px 1px 2px",
        backgroundColor: theme["color-primary-500"]
      },

      actions: {
        flexDirection: "row", alignItems:"center", justifyContent:"flex-end", columnGap: 10,
      },

      button: {

      },

      iconWrapper: {

      }

      
})