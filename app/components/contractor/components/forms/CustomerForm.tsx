import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/contexts/UserContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import theme from "../../../../theme.json";
import { Customer } from '@/types/User';

interface CustomerFormProps {
  addCustomer: (customerData: Customer) => void;
  formHasFocus: () => void;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Not a valid email").required('Email is required'),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const CustomerForm: React.FC<CustomerFormProps> = ({ addCustomer, formHasFocus }) => {
  const { user } = useUserContext();
  const [address, setAddress] = useState<string>('');
  const [placeID, setPlaceID] = useState('')

  // Handle address change with a useCallback to optimize re-renders
  const handleAddressChange = useCallback(
    (data: { description: string; place_id: string; }) => {
      console.log('Google Places onPress Triggered');
      setAddress(data.description)
      setPlaceID(data.place_id)
    },
    [] 
  );

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          companyName: "",
          phoneNumber: "",
          address: "",
          placeID: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Submitting customer data...");
          const newCustomer: Customer = { ...values, address: address, placeID: placeID, companyName: user!.companyName };
          addCustomer(newCustomer);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.inputsWrapper}>
            {/* FULL NAME */}
            <Input
              style={styles.input}
              placeholder="Full name"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              onFocus={formHasFocus}
              status={touched.fullName && errors.fullName ? 'danger' : 'basic'}
            />
            {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            {/* EMAIL */}
            <Input
              style={styles.input}
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onFocus={formHasFocus}
              status={touched.email && errors.email ? 'danger' : 'basic'}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* PHONE NUMBER */}
            <Input
              style={styles.input}
              placeholder="Phone number"
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              onFocus={formHasFocus}
              status={touched.phoneNumber && errors.phoneNumber ? 'danger' : 'basic'}
            />
            {touched.phoneNumber && errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            {/* GOOGLE PLACES AUTOCOMPLETE (Address) */}
            <View style={{ zIndex: 0, height: 500, backgroundColor: "transparent", position: "absolute", top: 190, width: "100%" }}>
              <GooglePlacesAutocomplete
                enablePoweredByContainer={true}
                placeholder={'Address'}
                minLength={2}
                onPress={handleAddressChange} // Using the optimized callback
                query={{
                  key: 'AIzaSyDxUdD9YwsWnVOZmboosFJ4Z9omvSH-Mgw',
                  language: 'en',
                }}
                textInputProps={{
                  // value: values.address, // Bind the value to Formik's `values.address`
                  // onChangeText: text => setFieldValue('address', text), // Update Formik's value
                  placeholderTextColor: "#8F9BB3",
                }}
                styles={{
                  textInput: {
                    backgroundColor: '#cccccc',
                    height: 40,
                    fontSize: 16,
                    borderRadius: 4,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "rgb(228, 233, 242)",
                    paddingLeft: 14,
                    marginBottom: 10,
                  },
                }}
              />
              {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            {/* SUBMIT BUTTON */}
            <Button
              onPress={() => handleSubmit()}
              style={[styles.submitBtn, { marginTop: 120 }]}
              status="primary"
            >
              Add Customer
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CustomerForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
  },
  inputsWrapper: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#CCCCCC",
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: theme["h-1-text-color"],
    borderColor: "#fefefe40",
    borderRadius: 30,
  },
});
function setFieldValue(arg0: string, place_id: any) {
  throw new Error('Function not implemented.');
}

