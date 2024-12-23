import db from "@/firebase/firebase-config";
import { Driver } from "@/types/User";
import { collection, getDocs, query, where } from "firebase/firestore";

const fetchDrivers = async (companyName: string) => {  
    const drivers: Driver[] = [];  
    const q = query(collection(db, "drivers"), where("companyName", "==", companyName));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
      alert("no driver registered in the " + companyName)
    } else {
      querySnapshot.forEach((doc) => {
       const driver: Driver = {
        id: doc.id,
        fullName: doc.data().fullName,
        email: doc.data().email,
        matricule: doc.data().matricule,
        companyName: doc.data().companyName,
        phoneNumber: doc.data().phoneNumber
    }
        drivers.push(driver)
    });
    }

    return drivers;
}

export default fetchDrivers