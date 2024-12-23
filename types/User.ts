export interface User {
    id: string;
    email: string;
    companyName: string;
    userType: string;
    phoneNumber: string;
}

export interface Driver {
    id?: string;
    fullName: string;
    email: string;
    idNumber: string;
    companyName: string;
    phoneNumber: string;
}