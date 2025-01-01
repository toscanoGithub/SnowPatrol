import db from '@/firebase/firebase-config';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUserContext } from './UserContext';

// Define the Driver type as per your definition
interface Driver {
    id?: string;
    fullName: string;
    email: string;
    idNumber: string;
    companyName: string;
    phoneNumber: string;
    driverId: string;
}

// Define the DriverContext type
interface DriverContextType {
    drivers: Driver[];
    addDriverToContext: (driver: Driver) => void;
    getDriverById: (id: string) => Driver | undefined;
    driverId: string;
    setDriverId: (id: string) => void;
}

// Create a context with default values
const DriverContext = createContext<DriverContextType | undefined>(undefined);

// Create a Provider component
export const DriverContextProvider = ({ children }: { children: ReactNode }) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const {user} = useUserContext()
    const fetchedDrivers: Driver[] = []
    const [driverId, setDriverId] = useState<string>("null");

    const fetchDrivers = async () => {    
    const q = query(collection(db, "drivers"), where("companyName", "==", user!.companyName));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
      console.log("no Customer registered yet")
    } else {
      querySnapshot.forEach((doc) => {
       const driver: Driver = {
        id: doc.id,
        fullName: doc.data().fullName,
        email: doc.data().email,
        idNumber: doc.data().idNumber,
        companyName: doc.data().companyName,
        phoneNumber: doc.data().phoneNumber,
        driverId: doc.id
    }
        fetchedDrivers.push(driver)
        
    });
    setDrivers(fetchedDrivers);
    
    }

    }

    useEffect(() => {
        fetchDrivers();
       }, [user])


       
    const addDriverToContext = async (driver: Driver) => {
        try {
            const docRef = await addDoc(collection(db, "drivers"), {...driver});
            fetchDrivers()
            
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        
    };

    const getDriverById = (id: string) => {
        return drivers.find((driver) => driver.idNumber === id);
    };

    

    return (
        <DriverContext.Provider value={{ drivers, driverId, setDriverId, addDriverToContext, getDriverById }}>
            {children}
        </DriverContext.Provider>
    );
};



// Custom hook to use DriverContext
export const useDriverContext = () => {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error("useDriverContext must be used within a DriverProvider");
    }
    return context;
};
