// CombinedContextProvider.tsx
import React from 'react';
import { UserContextProvider } from './UserContext';  // Adjust the import based on your file structure
import { DriverContextProvider } from './DriverContext';  // Adjust the import based on your file structure
import { CustomerContextProvider } from './CustomerContext';
import { RouteContextProvider } from './RouteContext';

const CombinedContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContextProvider>
      <DriverContextProvider>
        <CustomerContextProvider>
          <RouteContextProvider>
          {children}
          </RouteContextProvider>
        </CustomerContextProvider>
      </DriverContextProvider>
    </UserContextProvider>
  );
};

export default CombinedContextProvider;
