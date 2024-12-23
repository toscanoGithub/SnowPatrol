import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from '@ui-kitten/components'

const CustomerForm = () => {
  return (
    <View style={styles.container}>
      <Text>CustomerForm</Text>
    </View>
  )
}

export default CustomerForm


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,

    }
})