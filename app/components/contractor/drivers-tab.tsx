import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from '@ui-kitten/components'
import ActionSheetAddButton from '../action-sheet-add-button'

const DriversTab = () => {
    const addButtonPressed = (): void => {
    alert("Action Button Pressed");
    };

  return (
    <View style={styles.container}>
      <ActionSheetAddButton onPress={addButtonPressed}
        iconName="add" // Icon name from Material Icons
        label=""     // Optional label under the button 
        />
    </View>
  )
}

export default DriversTab

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,

    }
})