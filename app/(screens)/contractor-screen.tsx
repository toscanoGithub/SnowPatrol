import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Text } from '@ui-kitten/components'

const ContractorScreen = () => {
  const params = useLocalSearchParams()

  useEffect(() => {
    console.log("--------------------------",params.companyName);
    
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <Text category='h1'>{params.companyName}</Text>
    </SafeAreaView>
  )
}

export default ContractorScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8FC"
    }
})