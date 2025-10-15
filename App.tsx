
import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, isSignInWithEmailLink, signInWithEmailLink, User } from 'firebase/auth';
import { auth } from './services/firebase';

import HomePage from './components/HomePage';
import CompanyProfileSetup from './components/CompanyProfileSetup';
import Questionnaire from './components/Questionnaire';
import PolicyPreview from './components/PolicyPreview';
import ConfirmationModal from './components/ConfirmationModal';
import Login from './components/Login';
import FullPageLoader from './components/FullPageLoader';
import { generatePolicyStream, generateFormStream } from './services/geminiService';
import type { Policy, Form, FormAnswers, AppStatus, CompanyProfile, Source } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');
  
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<FormAnswers>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [navDestination, setNavDestination] = useState<'home' | 'profile' | null>(null);
  
  const hasUnsavedQuestionAnswers = Object.keys(questionAnswers).length > 0;

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
            signInWithEmailLink(auth, email, window.location.href)
                .then(() => {
                    window.localStorage.removeItem('emailForSignIn');
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch((error) => {
                    console.error("Sign in with email link error", error);
                    alert(`Error signing in: ${error.message}`);
                });
        }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthStatus(currentUser ? 'authed' : 'unauthed');
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setSelectedItem(null);
    setCompanyProfile(null);
    resetDocumentState();
  };

  const resetDocumentState = () => {
    setQuestionAnswers({});
    setGeneratedDocument('');
    setSources([]);
    setStatus('idle');
  };

  const handleSelectItem = (item: Policy | Form) => {
    setSelectedItem(item);
    // Reset everything downstream
    setCompanyProfile(null);
    resetDocumentState();
  };

  const handleProfileSubmit = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
  };
  
  const handleBack = (currentView: 'profile' | 'document') => {
     if (currentView === 'document' && hasUnsavedQuestionAnswers) {
        setNavDestination('profile');
        setShowConfirmation(true);
     } else if (currentView === 'document') {
        setCompanyProfile(null);
        resetDocumentState();
     } else { // currentView is 'profile'
        setSelectedItem(null);
     }
  }

  const confirmNavigation = () => {
    if (navDestination === 'profile') {
      setCompanyProfile(null);
      resetDocumentState();
    } else if (navDestination === 'home') {
       setSelectedItem(null);
       setCompanyProfile(null);
       resetDocumentState();
    }
    setShowConfirmation(false);
    setNavDestination(null);
  };

  const cancelNavigation = () => {
    setShowConfirmation(false);
    setNavDestination(null);
  };

  const handleGenerateDocument = useCallback(async () => {
    if (!selectedItem || !companyProfile) return;

    setStatus('loading');
    setGeneratedDocument('');
    setSources([]);

    // Combine profile and specific answers for the service
    const allAnswers: FormAnswers = {
        ...companyProfile,
        ...questionAnswers
    };

    try {
      if (selectedItem.kind === 'policy') {
        const stream = generatePolicyStream(selectedItem.type, allAnswers);
        for await (const chunk of stream) {
          // Append text
          if (chunk.text) {
              setGeneratedDocument((prev) => prev + chunk.text);
          }
          
          // Collect unique sources
          const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (newSources) {
            setSources(prevSources => {
              const existingUris = new Set(prevSources.map(s => s.web?.uri));
              // FIX: Map `GroundingChunk` objects from the API to `Source` objects to fix a type error.
              // `Source` requires `web.uri` and `web.title`, which are optional on the API's `GroundingChunk`.
              const uniqueNewSources: Source[] = newSources
                .filter(s => s.web?.uri && !existingUris.has(s.web.uri))
                .map(s => ({
                  web: {
                    uri: s.web!.uri!,
                    title: s.web!.title || s.web!.uri!,
                  },
                }));
              return [...prevSources, ...uniqueNewSources];
            });
          }
        }
      } else {
        const stream = generateFormStream(selectedItem.type, allAnswers);
         for await (const chunk of stream) {
            setGeneratedDocument((prev) => prev + chunk);
        }
      }
      setStatus('success');
    } catch (error) {
      console.error('Failed to generate document:', error);
      setStatus('error');
    }
  }, [selectedItem, companyProfile, questionAnswers]);

  if (authStatus === 'loading') {
    return <FullPageLoader />;
  }

  if (authStatus === 'unauthed') {
    return <Login />;
  }
  
  const AuthHeader = () => (
     <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
              <img 
                  src="https://i.postimg.cc/DyvJchrf/edited-image-11.png" 
                  alt="Ingcweti Logo" 
                  className="h-12"
              />
              <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                  <button onClick={handleLogout} className="text-sm font-semibold text-primary hover:underline">
                      Logout
                  </button>
              </div>
          </div>
      </header>
  );

  const AppFooter = () => (
      <footer className="bg-secondary text-white py-8">
          <div className="container mx-auto px-6 text-center">
              <img 
              src="https://i.postimg.cc/DyvJchrf/edited-image-11.png" 
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
    if (!selectedItem) {
      return (
          <HomePage onSelectItem={handleSelectItem} />
      );
    }

    if (!companyProfile) {
      return (
          <CompanyProfileSetup 
              item={selectedItem}
              onProfileSubmit={handleProfileSubmit}
              onBack={() => handleBack('profile')}
          />
      )
    }

    return (
      <div>
          <button
            onClick={() => handleBack('document')}
            className="mb-6 text-primary font-semibold hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Profile Setup
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Questionnaire
              item={selectedItem}
              companyProfile={companyProfile}
              answers={questionAnswers}
              onAnswersChange={setQuestionAnswers}
              onGenerate={handleGenerateDocument}
              status={status}
            />
            <PolicyPreview
              policyText={generatedDocument}
              status={status}
              onRetry={handleGenerateDocument}
              isForm={selectedItem.kind === 'form'}
              outputFormat={selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word'}
              sources={sources}
            />
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col">
      <AuthHeader />
      <main className="container mx-auto px-6 py-8 flex-grow">
        {renderMainContent()}
      </main>
      <AppFooter />
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
};

export default App;
