import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input, Text } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import theme from "../theme.json"
import {User} from "../../types/User"

// Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "../../firebase/firebase-config";

import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 
import db from '../../firebase/firebase-config';
import { router } from 'expo-router';

interface signupProp {
  dismissModal: () => void;  // Defining the function prop type
}

interface FormValues {
  email: string;
  companyName: string
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Not a valid email").required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password is too short'),
  confirmPassword: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), ""], "Passwords don't match"),
  companyName: Yup.string().required("Company name is required"),
});


const SignupForm: React.FC<signupProp> = ({ dismissModal }) => {

  const [currentUser, setCurrentUser] = useState<User>();
  
 // REGISTER LOGIC
 const register = (values: FormValues) => {
  
    const {email, password, confirmPassword, companyName} = values;
    const auth = getAuth();

  if(confirmPassword === password) {
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    addMoreDataToUser(email, companyName, "Contractor")
  })
  .catch((error) => {
    console.log(error.message);
    if(error.message.split("-").includes("already")) {
      alert("Email is already in use")
    } else {
      alert("Something went wrong, try later or contact the developer")
    }
  });

  
}
  
 }

 const addMoreDataToUser = async (email: string, companyName: string, userType: string) => {
  try {
      const docRef = await addDoc(collection(db, "users"), {
        email,
        companyName,
        userType,
      });

      // console.log("Document written with ID: ", docRef.id);

      setCurrentUser({id: docRef.id, email: email, companyName: companyName, userType: userType})

      dismissModal();
      router.push({pathname: "/(screens)/contractor-screen", params: {id: docRef.id, email: email, companyName: companyName, userType: userType}});
      

    } catch (e) {
      console.error("Error adding document: ", e);
    }
}

  return (
    <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  >

      
      <Text style={{textAlign:"center"}} category='s2'>Contractors are required to register.</Text>
      <Formik 
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          companyName: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => register(values)}
      
      >

{({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => 

<View style={styles.inputsWrapper}>
  {/* EMAIL */}
        <Input
          style={styles.input}
          placeholder='Email'
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          status={touched.email && errors.email ? 'danger' : 'basic'}
        />
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}


{/* COMPANY NAME */}
        <Input
          style={styles.input}
          placeholder='Company name'
          value={values.companyName}
          onChangeText={handleChange('companyName')}
          onBlur={handleBlur('companyName')}
          status={touched.companyName && errors.companyName ? 'danger' : 'basic'}
        />
        {touched.companyName && errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}


{/* PASSWORD */}
        <Input
          style={styles.input}
          placeholder='Password'
          value={values.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          status={touched.password && errors.password ? 'danger' : 'basic'}
        />
        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}


{/* CONFIRM PASSWORD */}
        <Input
          style={styles.input}
          placeholder='Confirm password'
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          status={touched.confirmPassword && errors.confirmPassword ? 'danger' : 'basic'}
        />
        {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}


        <Button onPress={() => {
          handleSubmit()
          // setTimeout(() => {
          //   resetForm()
          // }, 1000);
        }} style={styles.submitBtn} status="primary">
          Register
        </Button>
</View>

}

      </Formik>
    </KeyboardAvoidingView>
  )
}

export default SignupForm

const styles = StyleSheet.create({


  inputsWrapper: {
    flex: 1,
    width:"100%",
    marginTop: 30,
  },

  input: {
    width:"100%",
    paddingVertical: 15,
    backgroundColor:"#cccccc"
  },

  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },

  submitBtn: {
    marginTop: 15,
    backgroundColor: theme["h-1-text-color"],
    borderColor:"#fefefe40",
    borderRadius: 30
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 30,
  },
  buttonPressed: {
    opacity: 0.5,  // Change the opacity when button is pressed
  },

})