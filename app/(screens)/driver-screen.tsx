import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DriverScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>DriverScreen</Text>
    </SafeAreaView>
  )
}

export default DriverScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F7F8FC"
    }
})