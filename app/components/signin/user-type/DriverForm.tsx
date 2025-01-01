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
import { Driver, User } from '@/types/User';
import { useDriverContext } from '@/contexts/DriverContext';



interface FormValues {
    idNumber: string;
    companyName: string;
  };

  interface DriverFormProps {
    dismissModal: () => void;
    formHasFocus: () => void;
  }

  const validationSchema = Yup.object().shape({
    idNumber: Yup.string().required('ID number is required'),
    companyName: Yup.string().required('company name is required'),
  });

const DriverForm: React.FC<DriverFormProps> = ({dismissModal, formHasFocus}) => {
    const {setUser} = useUserContext()
    const auth = getAuth();
    const router = useRouter();
    const {setDriverId} = useDriverContext()
   
  return (
    <View style={styles.container}>
            <Formik 
                    initialValues={{
                      idNumber: "5613",
                        companyName: "Snow Patrol",
                    }}
                    validationSchema={validationSchema}
                    
                    onSubmit={async values => {
                      const {idNumber, companyName} = values;
                      const q = query(collection(db, "drivers"), where("companyName", "==", companyName),  where("idNumber", "==", idNumber));
                      const querySnapshot = await getDocs(q);
                      if(querySnapshot.empty) {
                        alert("No Driver found, please try later or contact your Employer")
                      } else {
                          const foundDrivers: Driver[] = []
                          querySnapshot.forEach((doc) => {
                            setDriverId(doc.id);
                            
                          foundDrivers.push({id: doc.id, ...doc.data()} as Driver)               
                        });
                        const foundDriver = foundDrivers.pop() as Driver;
                        setUser(foundDriver)
                        dismissModal();
                        router.push("/(screens)/driver-screen")
                      }
                    }
                  }
                    >
            
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* ID NUMBER */}
                    <Input
                        style={styles.input}
                        placeholder='ID number'
                        value={values.idNumber}
                        onChangeText={handleChange('idNumber')}
                        onBlur={handleBlur('idNumber')}
                        onFocus={formHasFocus}
                        status={touched.idNumber && errors.idNumber ? 'danger' : 'basic'}
                    />
                    {touched.idNumber && errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}

                            
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

export default DriverForm

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