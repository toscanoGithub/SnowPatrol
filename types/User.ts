export interface User {
    id: string;
    email: string;
    companyName: string;
    
}

export interface Driver {
    id?: string;
    fullName: string;
    email: string;
    idNumber: string;
    companyName: string;
    phoneNumber: string;
}

export interface Customer {
    id?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    address: string;
    placeID: string;
    driver?: Driver;
}

export interface Route {
    id?: string;
    attachedDriver: Driver;
    placeIds: string[];
    companyName: string;
}

