import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Button, Input, Text } from '@ui-kitten/components'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/contexts/UserContext';
import theme from "../../../theme.json";
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '@/firebase/firebase-config';
import { Customer, Driver, User } from '@/types/User';



interface FormValues {
    email: string;
    companyName: string;
  };

  interface DriverFormProps {
    dismissModal: () => void;
    formHasFocus: () => void;
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Not a valid email").required('Email is required'),
    companyName: Yup.string().required('company name is required'),
  });

const CustomerForm: React.FC<DriverFormProps> = ({dismissModal, formHasFocus}) => {
    const {setUser} = useUserContext()
    const auth = getAuth();
    const router = useRouter();

   
  return (
    <View style={styles.container}>
      
            <Formik 
                    initialValues={{
                      email: "",
                      companyName: "",
                    }}
                    validationSchema={validationSchema}
                    
                    onSubmit={async values => {
                      const {email, companyName} = values;
                      const q = query(collection(db, "customers"), where("companyName", "==", companyName),  where("email", "==", email));
                      const querySnapshot = await getDocs(q);
                      if(querySnapshot.empty) {
                        alert("No Customer found, please try later or contact yhe contractor")
                      } else {
                          const foundCustomers: Customer[] = []
                          querySnapshot.forEach((doc) => {
                            foundCustomers.push({id: doc.id, ...doc.data()} as Customer)               
                        });
                        const foundCustomer = foundCustomers.pop() as Customer;
                        setUser(foundCustomer)
                        dismissModal();
                        router.push("/(screens)/customer-screen")
                      }
                    }
                  }
                    >
            
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* ID NUMBER */}
                    <Input
                        style={styles.input}
                        placeholder='Email'
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        onFocus={formHasFocus}
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
                      onFocus={formHasFocus}
                      status={touched.companyName && errors.companyName ? 'danger' : 'basic'}
                    />
                    {touched.companyName && errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
            
                <Button onPress={() => {
                    handleSubmit()
                    // resetForm()
                    
                }} style={styles.submitBtn} status="primary">
                    Sign in
                </Button>

            </View>
            
            }
            
                    </Formik>
    </View>
  )
}

export default CustomerForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },

    inputsWrapper: {
        flex: 1,
        width:"100%",
        marginTop: 30,
      },
    
      input: {
        width:"100%",
        marginTop: 8,
        marginBottom: 10,
        paddingTop:0,
        backgroundColor:"#cccccc"

      },
    
      errorText: {
        color: 'red',
        marginTop: -8,
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