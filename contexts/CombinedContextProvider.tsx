// CombinedContextProvider.tsx
import React from 'react';
import { UserContextProvider } from './UserContext';  // Adjust the import based on your file structure
import { DriverContextProvider } from './DriverContext';  // Adjust the import based on your file structure

const CombinedContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContextProvider>
      <DriverContextProvider>
        {children}
      </DriverContextProvider>
    </UserContextProvider>
  );
};

export default CombinedContextProvider;
