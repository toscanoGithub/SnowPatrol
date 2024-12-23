import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Tab, TabBar, Text } from '@ui-kitten/components'
import theme from "../theme.json"
import CustomersTab from '../components/contractor/tabs/customers-tab'
import DriversTab from '../components/contractor/tabs/drivers-tab'
import RoutesTab from '../components/contractor/tabs/routes-tab'


const ContractorScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const layoutMainSection = () => {
    switch (selectedIndex) {
      case 0:
        return <View style={{width:"100%", flex:1, marginTop: 10 }}>
        <DriversTab  />
        
      </View>
      case 1:
        return <View style={{width:"100%", flex:1, marginTop: 10 }}>
          <CustomersTab />
        </View>
      case 2:
        return <View style={{width:"100%", flex:1, marginTop: 10 }}>
          <RoutesTab />
        </View>
        
      default:
        break;
    }
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabbarWrapper}>
      <TabBar
      indicatorStyle={{backgroundColor: theme["color-primary-300"], height: 4,}}  
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      <Tab title={() => <Text style={styles.tab} >Drivers</Text>}   />
      <Tab title={() => <Text style={styles.tab} >Customers</Text>}   />
      <Tab title={() => <Text style={styles.tab} >Routes</Text>}   />
    </TabBar>

    <View style={styles.main}>
      {layoutMainSection()}
    </View>
      </View>

    </SafeAreaView>
  )
}

export default ContractorScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8FC",

    },

    tabbarWrapper: {
      backgroundColor:"white",
      paddingVertical: 25,
      justifyContent:"center",
      paddingHorizontal: 0,
     
    },

    tab: { color: "#000000", fontSize: 16, paddingVertical: 5 },

    main: {
      height:"100%",
      
    }
})