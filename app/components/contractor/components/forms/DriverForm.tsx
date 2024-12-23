import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Input, Text } from '@ui-kitten/components'
import { Driver } from '@/types/User';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/contexts/UserContext';
import theme from "../../../../theme.json";
import { dismiss } from 'expo-router/build/global-state/routing';

interface DriverFormProps {
    addDriver: (driverData: Driver) => void;
}

interface FormValues {
    fullName: string;
    email: string;
    idNumber: string;
    companyName: string;
    phoneNumber: string;
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Not a valid email").required('Email is required'),
    idNumber: Yup.string().required("Id number is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

const DriverForm: React.FC<DriverFormProps> = ({ addDriver }) => {
    const {user} = useUserContext()
    const [generatedIdnumber, setGeneratedIdnumber] = useState("")


    const handleGenerateId = (setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => {
        // Assuming you generate the idNumber here
        const generatedId = Math.floor(1000 + Math.random() * 9000); // Replace with your actual logic
        setFieldValue("idNumber", generatedId.toString()); // Update the Formik field
      };


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Formik 
                    initialValues={{
                        fullName: "",
                        email: "",
                        idNumber: "",
                        companyName: "",
                        phoneNumber: ""
                    }}
                    validationSchema={validationSchema}
                    
                    onSubmit={values => {
                        const newDriver: Driver = {...values, companyName: user!.companyName}
                        addDriver(newDriver)
                        
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

                {/* ID NUMBER */}
               <View style={styles.rowId}>
                <Input
                        style={[styles.input, {maxWidth: "50%",}]}
                        placeholder='idNumber'
                        value={values.idNumber}
                        onChangeText={handleChange('idNumber')}
                        onBlur={handleBlur('idNumber')}
                        status={touched.idNumber && errors.idNumber ? 'danger' : 'basic'}
                    />

                    <Button onPress={() => handleGenerateId(setFieldValue)} style={styles.gnerateBtn}>
                    {evaProps => <Text style={{color:"#000000", ...evaProps}}>Generate id number</Text>}
                    </Button>
               </View>
               {touched.idNumber && errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}

            
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
                    Add driver
                </Button>

            </View>
            
            }
            
                    </Formik>
          </KeyboardAvoidingView>
    </View>
  )
}

export default DriverForm

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