

import React, { useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { POLICIES, FORMS } from './constants';

import Dashboard from './components/Dashboard';
import GeneratorPage from './components/GeneratorPage';
import PolicyUpdater from './components/PolicyUpdater';
import ComplianceChecklist from './components/ComplianceChecklist';

import type { Policy, Form, AppStatus, GeneratedDocument, PolicyType, FormType } from './types';

// A mock user object to simulate a logged-in state.
const mockUser = {
    uid: 'mock-user-123',
    email: 'user@example.com',
    displayName: 'Demo User',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'password',
} as User;


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockUser);
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'updater' | 'checklist'>('dashboard');
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);

  const handleStartOver = () => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setDocumentToView(null);
  };

  const handleSelectItem = (item: Policy | Form) => {
    setSelectedItem(item);
    setDocumentToView(null); // Ensure we are in "create" mode
    setCurrentView('generator');
  };

  const handleStartUpdate = () => {
    setCurrentView('updater');
  };

  const handleStartChecklist = () => {
    setCurrentView('checklist');
  };
  
  const handleBackToDashboard = () => {
      setCurrentView('dashboard');
      setSelectedItem(null);
      setDocumentToView(null);
  }

  const handleDocumentGenerated = (doc: GeneratedDocument) => {
    setGeneratedDocuments(prev => [doc, ...prev].slice(0, 5)); // Keep last 5 docs
    handleBackToDashboard();
  };
  
  const handleViewDocument = (doc: GeneratedDocument) => {
    setDocumentToView(doc);
    const item = doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType];
    setSelectedItem(item);
    setCurrentView('generator');
  };

  const AuthHeader = () => (
     <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
              <img 
                  src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" 
                  alt="Ingcweti Logo" 
                  className="h-12 cursor-pointer"
                  onClick={handleStartOver}
              />
              <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                  <button onClick={handleStartOver} className="text-sm font-semibold text-primary hover:underline">
                      Dashboard
                  </button>
              </div>
          </div>
      </header>
  );

  const AppFooter = () => (
      <footer className="bg-secondary text-white py-8">
          <div className="container mx-auto px-6 text-center">
              <img 
              src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" 
              alt="Ingcweti Logo" 
              className="h-10 mx-auto mb-4"
              />
              <p className="text-sm text-gray-300">
                  © {new Date().getFullYear()} Ingcweti. All rights reserved.
              </p>
          </div>
      </footer>
  );
  
  const renderMainContent = () => {
    switch (currentView) {
        case 'dashboard':
            return <Dashboard 
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist}
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                    />;
        case 'generator':
            if (!selectedItem) {
                handleBackToDashboard();
                return null;
            }
            return <GeneratorPage 
                        selectedItem={selectedItem}
                        initialData={documentToView}
                        onDocumentGenerated={handleDocumentGenerated}
                        onBack={handleBackToDashboard}
                    />;
        case 'updater':
            return <PolicyUpdater onBack={handleBackToDashboard} />;
        case 'checklist':
            return <ComplianceChecklist onBack={handleBackToDashboard} onSelectItem={handleSelectItem} />;
        default:
             return <Dashboard 
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist} 
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                    />;
    }
  }

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col">
      <AuthHeader />
      <main className="container mx-auto px-6 py-8 flex-grow">
        {renderMainContent()}
      </main>
      <AppFooter />
    </div>
  );
};

export default App;