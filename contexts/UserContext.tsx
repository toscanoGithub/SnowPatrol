import { Driver } from '@/types/User';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type AuthUser = {
    id?: string;
    email: string;
    companyName: string;
    driver?: Driver;
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

    const value: UserContextType = {
        email: user?.email,
        companyName: user?.companyName ?? '',
        user,
        setUser
    };

    return (
        <UserContext.Provider value={value}>
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
