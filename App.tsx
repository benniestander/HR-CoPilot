
import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import CompanyProfileSetup from './components/CompanyProfileSetup';
import Questionnaire from './components/Questionnaire';
import PolicyPreview from './components/PolicyPreview';
import ConfirmationModal from './components/ConfirmationModal';
import { generatePolicyStream, generateFormStream } from './services/geminiService';
import { INDUSTRIES } from './constants';
import type { Policy, Form, FormAnswers, AppStatus, CompanyProfile, Source } from './types';

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<FormAnswers>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [navDestination, setNavDestination] = useState<'home' | 'profile' | null>(null);
  
  const hasUnsavedQuestionAnswers = Object.keys(questionAnswers).length > 0;

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
              const uniqueNewSources = newSources.filter(s => s.web?.uri && !existingUris.has(s.web.uri));
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
  
  const renderHeaderFooter = (children: React.ReactNode) => (
     <>
      <header className="bg-white shadow-sm py-6">
          <div className="container mx-auto flex justify-center items-center">
          <img 
              src="https://i.postimg.cc/DyvJchrf/edited-image-11.png" 
              alt="Ingcweti Logo" 
              className="h-12"
          />
          </div>
      </header>
      {children}
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
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
     </>
  )

  if (!selectedItem) {
    return renderHeaderFooter(
      <main className="container mx-auto px-6 py-8 flex-grow">
        <HomePage onSelectItem={handleSelectItem} />
      </main>
    );
  }

  if (!companyProfile) {
    return renderHeaderFooter(
        <main className="container mx-auto px-6 py-8 flex-grow">
            <CompanyProfileSetup 
                item={selectedItem}
                onProfileSubmit={handleProfileSubmit}
                onBack={() => handleBack('profile')}
            />
        </main>
    )
  }

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col">
       <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto flex justify-center items-center">
          <img 
            src="https://i.postimg.cc/DyvJchrf/edited-image-11.png" 
            alt="Ingcweti Logo" 
            className="h-12"
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-grow">
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
      </main>

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

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
};

export default App;
