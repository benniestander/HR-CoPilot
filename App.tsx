import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { UIProvider } from './contexts/UIContext';
import { ModalProvider } from './contexts/ModalContext';
import AppContent from './AppContent';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIProvider>
        <ModalProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </ModalProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;
