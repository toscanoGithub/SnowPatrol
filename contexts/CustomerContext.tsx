import db from '@/firebase/firebase-config';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUserContext } from './UserContext';
import { Customer, Driver } from '@/types/User';



// Define the CustomerContext type
interface CustomerContextType {
    customers: Customer[];
    addCustomerToContext: (customer: Customer) => void;
    getCustomerById: (email: string) => Customer | undefined;
    updateCustomerInContext: (customer: Customer, driver: Driver) => void;
}

// Create a context with default values
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Create a Provider component
export const CustomerContextProvider = ({ children }: { children: ReactNode }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const {user} = useUserContext()
    const fetchedCustomers: Customer[] = []

    const fetchCustomers = async () => {    
        console.log(">>>>>>>>>>>", user);
        
    const q = query(collection(db, "customers"), where("companyName", "==", user!.companyName));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
      console.log("no Customer registered yet")
    } else {
      querySnapshot.forEach((doc) => {
       const customer: Customer = {
        id: doc.id,
        fullName: doc.data().fullName,
        email: doc.data().email,
        companyName: doc.data().companyName,
        phoneNumber: doc.data().phoneNumber,
        address: doc.data().address,
        placeID: doc.data().placeID,
        driver: doc.data().driver
    }
        fetchedCustomers.push(customer)
        
    });
    setCustomers(fetchedCustomers);
    
    }

    }

    useEffect(() => {
        fetchCustomers();
       }, [user])

       

    const addCustomerToContext = async (customer: Customer) => {
        console.log("Adding custoeer to context");
        
        try {
            const docRef = await addDoc(collection(db, "customers"), {...customer});
            fetchCustomers()
            
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        
    };

    const getCustomerById = (id: string) => {
        return customers.find((customer) => customer.id === id);
    };

    const updateCustomerInContext = async (customer: Customer, driver: Driver) => {
        try {
            
            // update jobs collection >>>> InterestedBy
      const customers = collection(db, "customers");
      // Create a query to find the user(s) with a specific name
      const q = query(customers, where("email", "==", customer.email));
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {          
          // Get document reference
          const customerDocRef = doc(db, "customers", docSnapshot.id);
          // Update the "interestedBy" field of the document
          await updateDoc(customerDocRef, {
            driver: driver
          });
        });
    }
 } catch (e) {
        console.error("Error updating customer:", e);
    }

        // Optionally, update the local context/state
        setCustomers((prevCustomers) =>
            prevCustomers.map((c) =>
                c.email === customer.email ? { ...c, ...customer, driver } : c
            )
        );

        console.log("Customer updated successfully");

    
    };
    

    return (
        <CustomerContext.Provider value={{ customers, addCustomerToContext, getCustomerById, updateCustomerInContext }}>
            {children}
        </CustomerContext.Provider>
    );
};



// Custom hook to use CustomerContext
export const useCustomerrContext = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error("useCustomerContext must be used within a CustomerProvider");
    }
    return context;
};
