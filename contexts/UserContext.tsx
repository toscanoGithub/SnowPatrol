import React, { createContext, ReactNode, useContext, useState } from 'react';

type AuthUser = {
    id: string;
    fullName?: string;
    email: string;
    companyName: string;
    phoneNumber?: string;
    userType: string;

};

type UserContextType = {
    email: string | undefined;
    companyName: string;
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserContextProviderProps = {
    children: ReactNode;
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};