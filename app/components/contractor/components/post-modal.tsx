import {Animated, Easing, Modal, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import theme from "../../../theme.json"
import { LinearGradient } from 'expo-linear-gradient'
import { Button, Icon, Text } from '@ui-kitten/components'
import DriverForm from './forms/DriverForm'
import CustomerForm from './forms/CustomerForm'
import RouteForm from './forms/RouteForm'
import { Customer, Driver } from '@/types/User'
import { useCustomerrContext } from '@/contexts/CustomerContext'
import { useDriverContext } from '@/contexts/DriverContext'

interface PostModalProps {
    type: string;
    visible: boolean;
    dismiss: () => void;
    
}


const PostModal: React.FC<PostModalProps> = ({ type, visible, dismiss }) => {
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
    const [slideAnim] = useState(new Animated.Value(0)); // Initial value for the slide animation
    const [modalViewHeight, setModalViewHeight] = useState(80)
    


    // CONTEXT API
    const {addDriverToContext} = useDriverContext()
    const {addCustomerToContext} = useCustomerrContext()

    const listenToFormFocusEvent = () => {
      if(modalViewHeight === 80) {
        setModalViewHeight(100)
      }
    }


    const dismissModal = () => {
        dismiss()
      };

      useEffect(() => {
            setModalIsVisible(!modalIsVisible)
      }, [visible])
      
      // ADD DRIVER 
      const addDriver = async (driverData: Driver) => {
        await addDriverToContext({...driverData})
        dismiss()
      }

      // ADD CUSTOMER 
      const addCustomer = async (customerData: Customer) => {
        await addCustomerToContext({...customerData})
        dismiss()
      }

      // POPULATE MODAL CONTENT
      const populateModalContent = () => {
        switch (type) {
          case "Driver":
            return <DriverForm formHasFocus={listenToFormFocusEvent} addDriver={addDriver} />
          case "Customer":
            return <CustomerForm formHasFocus={listenToFormFocusEvent} addCustomer={addCustomer} />
          case "Route":
            return <RouteForm />
          default:
            break;
        }
      }
      

      useEffect(() => {
          // Animate the slide-in effect when the component mounts
          Animated.timing(slideAnim, {
            toValue: 1,  // Final position (0 = fully hidden, 1 = fully shown)
            duration: 500, // Duration of the animation
            easing: Easing.ease, // Easing function for the animation
            useNativeDriver: true, // Enable native driver for better performance
          }).start();
        }, [slideAnim]);

      

    
  return (
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
          <View style={styles.centeredView}>
            <View  style={[styles.modalView, {height: `${modalViewHeight}%`}]}>
              <LinearGradient
                colors={['#0266B1', '#0266B190']}
                style={styles.background}
              />

              {/* MODAL TITLE */}
              <Text category="h4" style={styles.modalTitle}>
                Add {type}
              </Text>

              {/* MODAL CONTENT */}
              {populateModalContent()}

              {/* CLOSE BUTTON */}
              <Button
                status="danger" // Optional: Change the button's status to "danger" for a red color
                onPress={dismissModal} // Handle the button press
                style={styles.closeBtn}
              >
                {evaProps => <Text style={{color:"red", fontSize: 20, ...evaProps}} >X</Text>}
                
              </Button>
            </View>
          </View>
        </Modal>
      </View>
   
  )
}

export default PostModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent"
    },

   

    heroBG: {
      flex: 1,
      width: '100%',
      justifyContent: 'center', // Center the content if needed
  },
  imageStyle: {
    resizeMode: 'cover', // Ensures the image covers the whole screen
  },

    

   
    heroTextContainer: {
      position: "absolute",
      bottom:0,
      backgroundColor: "#00000070",
      paddingVertical: 15,
      paddingHorizontal: 10,
      height:"auto",
      width:"100%",
      justifyContent:"center",
      alignItems:"center"
    },
    heroText: {
      fontSize: 20,
      lineHeight: 30,
      color: "#F7F8FC",
      fontFamily: 'Lato-Regular',
      marginBottom: 20
    },

    buttonsRow: {
        flexDirection:"row",
        justifyContent:"center", 
        alignItems:"center",
        columnGap: 15,
        zIndex: 100,
        position: "absolute",
        left: "25%",
        right:"25%",
        top: "10%"

    },

   
    link: {
        paddingTop: 20,
        fontSize: 20,
        color:"white"
        },
    

    authBtn: {
         borderRadius: 30, paddingHorizontal: 30, backgroundColor: theme["h-1-text-color"], 
    },

    instructions: {
        justifyContent:"center", alignItems:"flex-start", padding: 10
    },

    instructionsText: {
        fontSize: 45, lineHeight: 70, color: theme["h-1-text-color"]
    },


    // modal
    centeredView: {
        flex: 1,
        
      },
      modalView: {
        position:"absolute",
        bottom:0,
        left:0, right:0,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 45,
        // padding: 35,
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // height:"80%",
        width:"100%",
        
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      
      textStyle: {
        // color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalTitle: {
        marginTop: 20,
        fontWeight: 900,
        fontSize: 40,
        color: "#3B83C3"
      },

      closeBtn: {
        position: "absolute",
        left: 0,
        top:0,
        borderTopLeftRadius: 30,
        borderWidth: 1,
        backgroundColor:"#3B83C3",
        borderColor: "#3B83C3",
        width: 50, height: 50, 


      },


      modalContent: {
        height: '25%',
        width: '100%',
        backgroundColor: '#25292e',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
      },
      titleContainer: {
        height: '16%',
        backgroundColor: '#464C55',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      title: {
        color: '#fff',
        fontSize: 16,
      },


      background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        borderTopLeftRadius: 45,
    
      },
})





                // <View style={{flex:1,   backgroundColor:"transparent", position: "absolute", top: 190, width: "100%",paddingBottom: 40, zIndex: 1000}}>
