import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from '@ui-kitten/components'

const RouteForm = () => {
  return (
    <View style={styles.container}>
      <Text>RouteForm</Text>
    </View>
  )
}

export default RouteForm


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,

    }
})