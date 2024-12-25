import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Input, Text } from '@ui-kitten/components'
import { Customer, Driver } from '@/types/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/contexts/UserContext';
import theme from "../../../../theme.json";

interface CustomerFormProps {
    addCustomer: (customerData: Customer) => void;
}

interface FormValues {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    companyName: string;
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Not a valid email").required('Email is required'),
    address: Yup.string().required("The address is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

const CustomerForm: React.FC<CustomerFormProps> = ({ addCustomer }) => {
    const {user} = useUserContext()

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Formik 
                    initialValues={{
                        fullName: "",
                        email: "",
                        address: "",
                        companyName: "",
                        phoneNumber: ""
                    }}
                    validationSchema={validationSchema}
                    
                    onSubmit={values => {
                        const newCustomer: Customer = {...values, companyName: user!.companyName}
                        addCustomer(newCustomer)
                        
                    }}
                    
                    >
            
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* FULL NAME */}
                    <Input
                        style={styles.input}
                        placeholder='Full name'
                        value={values.fullName}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        status={touched.fullName && errors.fullName ? 'danger' : 'basic'}
                    />
                    {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            

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


                {/* ADDRESS */}
                <Input
                    style={styles.input}
                    placeholder='Address'
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    status={touched.address && errors.address ? 'danger' : 'basic'}
                />
                {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            
                {/* PHONE NUMBER */}
                <Input
                    style={styles.input}
                    placeholder='Phone number'
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    status={touched.phoneNumber && errors.phoneNumber ? 'danger' : 'basic'}
                />
                {touched.phoneNumber && errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            
                <Button onPress={() => {
                    handleSubmit()
                    // resetForm()
                    
                }} style={styles.submitBtn} status="primary">
                    Add customer
                </Button>

            </View>
            
            }
            
                    </Formik>
          </KeyboardAvoidingView>
    </View>
  )
}

export default CustomerForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,
    },

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

      gnerateBtn: {
       flex: 1,
       backgroundColor: theme["aa-yellow-color"],
       borderWidth: 0,
      },

      rowId: {
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems: "center",
        columnGap: 10,

      },

      
})