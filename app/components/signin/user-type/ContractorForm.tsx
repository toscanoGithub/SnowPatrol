import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import React from 'react'
import { Button, Input, Text } from '@ui-kitten/components'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/contexts/UserContext';
import theme from "../../../theme.json";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '@/firebase/firebase-config';
import { User } from '@/types/User';



interface FormValues {
    email: string;
    password: string;
  };

  interface ContractorFormProps {
    dismissModal: () => void;
    formHasFocus: () => void;
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Not a valid email").required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

const ContractorForm: React.FC<ContractorFormProps> = ({dismissModal, formHasFocus}) => {
    const {setUser} = useUserContext()
    const auth = getAuth();
    const router = useRouter();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Formik 
                    initialValues={{
                        email: "malik@snow.com",
                        password: "qwerty",
                    }}
                    validationSchema={validationSchema}
                    
                    onSubmit={values => {
                      // Sign in logic
                      const {email, password} = values;
                      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // SUCCESS
            // GET MORE CREDENTIALS FROM FIRESTORE
          const q = query(collection(db, "users"), where("email", "==", userCredential.user.email));
          const querySnapshot = await getDocs(q);

          if(querySnapshot.empty) {
            alert("Something went wrong, please try later")
          } else {
            const foundUsers: User[] = []
            querySnapshot.forEach((doc) => {
              // console.log(doc.id, doc.data());
              foundUsers.push({id: doc.id, ...doc.data()} as User) 
              
              
              //router.push({pathname: "/(screens)/contractor-screen", params: {...doc.data()}})
              
           });
           const foundUser = foundUsers.pop() as User;
           setUser(foundUser)
           dismissModal();
           router.push("/(screens)/contractor-screen")
           
          }

          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          alert("Un ou plusieurs des identifiants ne sont pas valides.")
        });
                        
                    }}
                    >
            
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* EMAIL */}
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

                            
                    {/* PASSWORD */}
                    <Input
                      style={styles.input}
                      placeholder='Password'
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      onFocus={formHasFocus}

                      status={touched.password && errors.password ? 'danger' : 'basic'}
                    />
                    {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
                <Button onPress={() => {
                    handleSubmit()
                    // resetForm()
                    
                }} style={styles.submitBtn} status="primary">
                    Sign in
                </Button>

            </View>
            
            }
            
                    </Formik>
          </KeyboardAvoidingView>
    </View>
  )
}

export default ContractorForm

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