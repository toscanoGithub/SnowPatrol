import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomerScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>CustomerScreen</Text>
    </SafeAreaView>
  )
}

export default CustomerScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F7F8FC"
    }
})