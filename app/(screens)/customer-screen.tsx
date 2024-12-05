import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'

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
      flex: 1,
      backgroundColor: "#F7F8FC"
    }
})