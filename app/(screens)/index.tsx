import { StyleSheet, View, Dimensions, Pressable, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ImageBackground, StatusBar, Animated, Easing} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Text } from '@ui-kitten/components'
import theme from "../theme.json"
import { Link, useRouter } from 'expo-router'
import SignupForm from '../components/signup-form'
import SigninForm from '../components/signin/signin-form'
import { LinearGradient } from 'expo-linear-gradient';
import { useUserContext } from '@/contexts/UserContext'

// const closeIcon = (props: any): IconElement => (
//     <Icon
//       {...props}
//       name="close-circle"
//       style={{width: 30, height: 30}}
//       fill="#EC645B"
//     />
//   );

const auth = () => {
  
    const {user} = useUserContext()
    const {width, height} = Dimensions.get('window')
    const router = useRouter()
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState("SIGN IN")
    const [isrewardDay, setIsrewardDay] = useState(false)
    const [modalViewHeight, setModalViewHeight] = useState(80)
    
    const dismissModal = () => {
        setModalIsVisible(!modalIsVisible)
      };

      const [slideAnim] = useState(new Animated.Value(0)); // Initial value for the animation

      useEffect(() => {
        // Animate the slide-in effect when the component mounts
        Animated.timing(slideAnim, {
          toValue: 1,  // Final position (0 = fully hidden, 1 = fully shown)
          duration: 500, // Duration of the animation
          easing: Easing.ease, // Easing function for the animation
          useNativeDriver: true, // Enable native driver for better performance
        }).start();
      }, [slideAnim]);

      const transform = [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-700, 0], // Slide from 300px down to the original position
          }),
        },
      ]

      useEffect(() => {
        console.log("------------- ", user?.companyName);
        
      }, [user])


      const iHaveFocus = () => {
        if(modalViewHeight === 80) {
          setModalViewHeight(100)
        }
      }
      

  return (

     
    <View style={[styles.container]}>
      <StatusBar hidden barStyle="light-content" translucent={true} />
        {/* HERO */}
      <ImageBackground
      source={require("../../assets/images/heroImage.jpg")} // Replace with your image URL or local file
      style={[styles.heroBG, {height: height, paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,}]}
      imageStyle={styles.imageStyle}
    >
      <Animated.View style={[styles.heroTextContainer, {transform: transform}]}> 
      <Text category='s1' style={styles.heroText}>Snow Patrol connects customers with local snow blower operators for quick and easy snow removal. Users can request services and track progress in real-time.</Text>
      </Animated.View>
    </ImageBackground>
  
      <View style={styles.buttonsRow}>
        <Button onPress={() => {
            setModalType("SIGN IN")
            setModalIsVisible(true)
        }} style={styles.authBtn} appearance='outline'  status='primary'>{evaProps => <Text  {...evaProps} style={{color:"#ffffff"}}>SIGN IN</Text>}</Button>


          <Button onPress={() => {
            console.log("show modal");
            setModalType("SIGN UP")
            setModalIsVisible(true);
              }} style={styles.authBtn} appearance='outline'  status='primary'>
                {evaProps => <Text  {...evaProps} style={{color:"#ffffff"}}>SIGN UP</Text>}</Button>
      </View>

      
      
      
      <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
      <View style={styles.centeredView}>  
      
            <View style={[styles.modalView,  {height: `${modalViewHeight}%`}]}>
            <LinearGradient
        colors={["#0266B1", "#0266B190"]}
        style={styles.background}
      />  
              {/* MODAL TITLE */}
              <Text category='h4' style={styles.modalTitle}>{modalType}</Text>
              
               {/* CLOSE BUTTON */}
                            <Button
                              status="danger" // Optional: Change the button's status to "danger" for a red color
                              onPress={dismissModal} // Handle the button press
                              style={styles.closeBtn}
                            >
                              {evaProps => <Text style={{color:"red", fontSize: 20, ...evaProps}} >X</Text>}
                              
                            </Button>
                            

              {/* AUTH FORM */}
              {modalType === "SIGN UP" ? <SignupForm iHaveFocus={iHaveFocus} dismissModal={dismissModal} /> : <SigninForm  iHaveFocus={iHaveFocus} dismissModal={dismissModal} />}
           
           
           
           
           
           
            </View>
          </View>
    </Modal>
      
      
        
    </View>
  )
}

export default auth

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        height:"80%",
        width:"100%",
        
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalTitle: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 50,
        color: "#3B83C3",
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