import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Text } from '@ui-kitten/components'
import ActionSheetAddButton from '../components/action-sheet-add-button';
import PostModal from '../components/post-modal';

const CustomersTab = () => {
    const [modalIsVisible, setModalIsVisible] = useState(false)
        const addButtonPressed = (type: string): void => {
          setModalIsVisible(true)
        };
    
        const dismiss = () => {
          setModalIsVisible(false)
          
        }
        
  return (
    <View style={styles.container}>
      <ActionSheetAddButton onPress={addButtonPressed}
        iconName="add" // Icon name from Material Icons
        type="Customers"     // Optional label under the button 
        />


{modalIsVisible && <PostModal type="Customer" visible={modalIsVisible} dismiss={dismiss} />}

    </View>
  )
}

export default CustomersTab

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})