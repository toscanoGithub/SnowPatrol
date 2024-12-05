import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Text } from '@ui-kitten/components'
import { useUserContext } from '@/contexts/UserContext'

const ContractorScreen = () => {
  const {user, setUser} = useUserContext()

  const params = useLocalSearchParams()

  
  return (
    <SafeAreaView style={styles.container}>
      <Text category='h1'>{user?.companyName}</Text>
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