import db from '@/firebase/firebase-config';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUserContext } from './UserContext';
import { Customer, Driver } from '@/types/User';

// Define the Driver type as per your definition
interface Route {
    id?: string;
    customers: Customer[];
    splitAmount: number;
}

// Define the DriverContext type
interface RouteContextType {
    routes: Route[];
    drivers: Driver[];
    addRouteToContext: (route: Route) => void;
    getRouteById: (id: string) => Route | undefined;
}

// Create a context with default values
const RouteContext = createContext<RouteContextType | undefined>(undefined);

// Create a Provider component
export const RouteContextProvider = ({ children }: { children: ReactNode }) => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([])
    const {user} = useUserContext()
    const fetchedRoutes: Route[] = []

    const fetchRoutes = async () => {    
        // const q = query(collection(db, "routes"), where("companyName", "==", user!.companyName));
        // const querySnapshot = await getDocs(q);
        // if(querySnapshot.empty) {
        //   console.log("no route found")
        // } else {
        //   querySnapshot.forEach((doc) => {
        //    const route: Route = {
        //        id: doc.id,
        //        attachedDriver: doc.data().attachedDriver,
        //        companyName: doc.data().companyName,
        //        placeIds: []
        //    }
        //     fetchedRoutes.push(route)
            
        // });
        // setRoutes(fetchedRoutes);
        
        // }
    
        }

    useEffect(() => {
        fetchRoutes();
       }, [user])

       

    const addRouteToContext = async (route: Route) => {
        try {
            const docRef = await addDoc(collection(db, "routes"), {...route});
            fetchRoutes()
            
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        
    };

    const getRouteById = (id: string) => {
        return routes.find((route) => route.id === id);
    };

    return (
        <RouteContext.Provider value={{ routes, drivers, addRouteToContext, getRouteById }}>
            {children}
        </RouteContext.Provider>
    );
};



// Custom hook to use DriverContext
export const useRouteContext = () => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error("useRouteContext must be used within a RouteProvider");
    }
    return context;
};
