// CombinedContextProvider.tsx
import React from 'react';
import { UserContextProvider } from './UserContext';  // Adjust the import based on your file structure
import { DriverContextProvider } from './DriverContext';  // Adjust the import based on your file structure
import { CustomerContextProvider } from './CustomerContext';

const CombinedContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContextProvider>
      <DriverContextProvider>
        <CustomerContextProvider>
          {children}
        </CustomerContextProvider>
      </DriverContextProvider>
    </UserContextProvider>
  );
};

export default CombinedContextProvider;
