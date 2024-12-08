import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import theme from "../theme.json"
import { Button, Icon, IconElement, Text } from '@ui-kitten/components';
import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  companyName?: string;
  email?: string;
}


const signoutIcon = (props:any): IconElement => (
    <Icon
      {...props}
      name="log-out-outline"
      animation="shake"
      style={{width: 40, height: 40}}
      fill={"#CDD511"}
    />
  );


const Header: React.FC<HeaderProps> = ({ companyName, email }) => {

    const auth = getAuth();

    const logout = () => {
        signOut(auth).then(() => {
          // Sign-out successful.
          router.push("/");
    
        }).catch((error) => {
          // An error happened.
          console.log("Error to sign you out");
        });
      }


  return (
    <View style={styles.container}>
      <View>
      <Text category='h3' style={styles.companyName}>{companyName}</Text>
      <Text style={styles.email}>{email}</Text>
      </View>
      <View style={{alignItems:"flex-end"}}>
      <MaterialIcons
        name="exit-to-app" // icon name for sign-out
        size={40} // size of the icon
        color="#F7CF00" // icon color
        onPress={logout} // calling the sign-out function when pressed
      />
      
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:"space-between",
    backgroundColor: theme["color-primary-600"],
    height: 100,
    paddingVertical: 10,
paddingHorizontal: 10
  },
  
  companyName: {
    fontWeight: 'bold',
    color: "#F7F7F7",
    
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#F7F7F770",
    fontFamily:"Lato-Regular"

  }
});

export default Header;