
import React, { useState, useEffect } from 'react';

import { POLICIES, FORMS } from './constants';

import Dashboard from './components/Dashboard';
import GeneratorPage from './components/GeneratorPage';
import PolicyUpdater from './components/PolicyUpdater';
import ComplianceChecklist from './components/ComplianceChecklist';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import PlanSelectionPage from './components/PlanSelectionPage';
import EmailSentPage from './components/EmailSentPage';
import Toast from './components/Toast';


import type { Policy, Form, GeneratedDocument, PolicyType, FormType, CompanyProfile, User } from './types';
import { UserIcon } from './components/Icons';

type AuthPage = 'landing' | 'login' | 'email-sent';
type AuthFlow = 'signup' | 'login' | 'trial_signup';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>({
    email: 'a@b.com',
    name: 'Demo User',
    contactNumber: '0821234567',
    plan: 'pro',
    trialPoliciesGenerated: 0,
    profile: {
      companyName: 'Ingcweti Demo Inc.',
      industry: 'Technology',
      address: '123 Tech Street, Cape Town, 8001',
      companyUrl: 'https://www.ingcweti.co.za',
      summary: 'A leading provider of AI-powered HR solutions for small businesses in South Africa.',
      companySize: '11-50',
    }
  });
  const [isSubscribed, setIsSubscribed] = useState(true);
  
  // Auth state
  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authFlow, setAuthFlow] = useState<AuthFlow | null>(null);
  const [authDetails, setAuthDetails] = useState<{name: string, contactNumber: string} | null>(null);
  const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);


  // State for managing the current view (e.g., dashboard, generator, updater)
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'updater' | 'checklist' | 'profile' | 'upgrade'>('dashboard');
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([
    {
      id: 'leave-1629876543210',
      title: 'Leave Policy',
      kind: 'policy',
      type: 'leave',
      content: '## Leave Policy for Ingcweti Demo Inc.\n\nThis is a sample leave policy...',
      createdAt: new Date().toISOString(),
      companyProfile: { companyName: 'Ingcweti Demo Inc.', industry: 'Technology', companyUrl: 'https://www.ingcweti.co.za', companySize: '11-50' },
      questionAnswers: { annualLeaveDays: 21 },
      version: 1,
      sources: [],
      history: [],
    },
    {
      id: 'job-application-1629876543211',
      title: 'Job Application Form',
      kind: 'form',
      type: 'job-application',
      outputFormat: 'word',
      content: '## Job Application Form\n\nPlease fill out all sections...',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      companyProfile: { companyName: 'Ingcweti Demo Inc.', industry: 'Technology', companyUrl: 'https://www.ingcweti.co.za', companySize: '11-50' },
      questionAnswers: { position: 'Software Developer' },
      version: 2,
      sources: [],
      history: [
        {
          version: 1,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          content: '## Job Application Form - Version 1\n\nInitial version of the form.'
        }
      ]
    }
  ]);
  const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStartAuthFlow = (flow: AuthFlow, email: string, details?: { name: string, contactNumber: string }) => {
    setAuthEmail(email);
    setAuthFlow(flow);
     if (details) {
        setAuthDetails(details);
    }
    setAuthPage('email-sent');
  };

  const handleAuthVerified = () => {
    if (!authEmail) return;

    switch (authFlow) {
      case 'trial_signup':
        if (authDetails) {
          setUser({
            email: authEmail,
            name: authDetails.name,
            contactNumber: authDetails.contactNumber,
            profile: { companyName: '', industry: '' },
            plan: 'trial',
            trialPoliciesGenerated: 0,
          });
          setIsSubscribed(false);
          setCurrentView('dashboard');
          setShowOnboardingWalkthrough(true); // Trigger walkthrough for new trial users
        }
        break;
      
      case 'signup':
        // Create a new, unsubscribed user for the Pro plan
        setUser({
          email: authEmail,
          plan: 'pro',
          trialPoliciesGenerated: 0,
          profile: { companyName: '', industry: '' }
        });
        setIsSubscribed(false);
        break;

      case 'login':
        if (authEmail.toLowerCase() === 'a@b.com') {
          setUser({
            email: 'a@b.com',
            name: 'Demo User',
            contactNumber: '0821234567',
            plan: 'pro',
            trialPoliciesGenerated: 0,
            profile: {
              companyName: 'Ingcweti Demo Inc.',
              industry: 'Technology',
              address: '123 Tech Street, Cape Town, 8001',
              companyUrl: 'https://www.ingcweti.co.za',
              summary: 'A leading provider of AI-powered HR solutions for small businesses in South Africa.',
              companySize: '11-50',
            }
          });
          setIsSubscribed(true);
        } else {
           // For any other user, simulate a login to an existing but unsubscribed account
           setUser({ email: authEmail, plan: 'pro', trialPoliciesGenerated: 0, profile: { companyName: '', industry: '' } });
           setIsSubscribed(false);
        }
        break;
    }
    
    // Reset auth flow state
    setAuthEmail(null);
    setAuthFlow(null);
    setAuthDetails(null);
    setAuthPage('landing');
  };

  const handleUpdateProfile = (updatedProfile: CompanyProfile) => {
    if (!user) return;
    setUser({ ...user, profile: updatedProfile });
    setToastMessage("Profile updated successfully!");
  };

  const handleSubscriptionSuccess = () => {
    if (!user) return;
    setIsSubscribed(true);
    setUser(prev => prev ? {...prev, plan: 'pro'} : null);
    setToastMessage("Success! Welcome to Ingcweti Pro. Your dashboard is ready.");
    setCurrentView('dashboard');
    setShowOnboardingWalkthrough(true); // Trigger walkthrough for new pro users
  };
  
  const handleCloseWalkthrough = () => {
    setShowOnboardingWalkthrough(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsSubscribed(false);
    setAuthPage('landing');
    setCurrentView('dashboard');
    setSelectedItem(null);
    setGeneratedDocuments([]);
    setDocumentToView(null);
    setAuthEmail(null);
    setAuthFlow(null);
    setAuthDetails(null);
    setShowOnboardingWalkthrough(false);
  };

  const handleStartOver = () => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setDocumentToView(null);
  };

  const handleSelectItem = (item: Policy | Form) => {
    if (user?.plan === 'trial' && user.trialPoliciesGenerated >= 1 && item.kind === 'policy') {
        setToastMessage("Your trial has ended. Please subscribe to generate more policies.");
        setCurrentView('upgrade');
        return;
    }
    setSelectedItem(item);
    setDocumentToView(null);
    setCurrentView('generator');
  };

  // Navigation function to switch to the policy updater view
  const handleStartUpdate = () => {
    setCurrentView('updater');
  };
  
  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const handleStartChecklist = () => {
    setCurrentView('checklist');
  };

  const handleBackToDashboard = () => {
      setCurrentView('dashboard');
      setSelectedItem(null);
      setDocumentToView(null);
  }

  const handleDocumentGenerated = (doc: GeneratedDocument, originalId?: string) => {
    if (originalId) {
      setGeneratedDocuments(prev => {
        const oldDoc = prev.find(d => d.id === originalId);
        if (!oldDoc) return prev;

        const historyEntry = {
          version: oldDoc.version,
          createdAt: oldDoc.createdAt,
          content: oldDoc.content,
        };
        
        const newHistory = [historyEntry, ...(oldDoc.history || [])];
        const newVersion = oldDoc.version + 1;
        
        const updatedDoc = { 
          ...doc, 
          version: newVersion, 
          id: originalId, 
          createdAt: new Date().toISOString(),
          history: newHistory,
        };
        
        return [updatedDoc, ...prev.filter(d => d.id !== originalId)].slice(0, 10);
      });
      setToastMessage("Document updated successfully!");
    } else {
      const newDocWithVersion = { ...doc, version: 1, history: [] };
      setGeneratedDocuments(prev => [newDocWithVersion, ...prev].slice(0, 10));
       if (user?.plan === 'trial' && doc.kind === 'policy') {
            setUser(prev => prev ? {...prev, trialPoliciesGenerated: prev.trialPoliciesGenerated + 1} : null);
            setToastMessage("Trial policy generated! Upgrade to create more.");
        } else {
            setToastMessage("Document generated successfully!");
        }
    }
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
                   <button onClick={handleShowProfile} className="flex items-center text-sm font-semibold text-primary hover:underline">
                      <UserIcon className="w-5 h-5 mr-1" />
                      My Profile
                  </button>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">
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
                        user={user}
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist}
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                        showOnboardingWalkthrough={showOnboardingWalkthrough}
                        onCloseWalkthrough={handleCloseWalkthrough}
                    />;
        case 'generator':
            if (!selectedItem || !user) {
                handleBackToDashboard();
                return null;
            }
            return <GeneratorPage 
                        selectedItem={selectedItem}
                        initialData={documentToView}
                        userProfile={user.profile}
                        onDocumentGenerated={handleDocumentGenerated}
                        onBack={handleBackToDashboard}
                    />;
        case 'updater':
            return <PolicyUpdater 
                        onBack={handleBackToDashboard}
                        generatedDocuments={generatedDocuments}
                        onDocumentGenerated={handleDocumentGenerated}
                    />;
        case 'checklist':
            if (!user) { handleBackToDashboard(); return null; }
            return <ComplianceChecklist
                        userProfile={user.profile}
                        generatedDocuments={generatedDocuments}
                        onBack={handleBackToDashboard}
                        onSelectItem={handleSelectItem}
                        onViewDocument={handleViewDocument}
                    />;
        case 'profile':
        case 'upgrade': // The upgrade view is just the profile page in onboarding mode
            if (!user) { handleBackToDashboard(); return null; }
            return <ProfilePage 
                        user={user}
                        isOnboarding={currentView === 'upgrade'}
                        onUpdateProfile={handleUpdateProfile}
                        onSubscriptionSuccess={handleSubscriptionSuccess}
                        onLogout={handleLogout} 
                        onBack={handleBackToDashboard}
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                    />;
        default:
             return <Dashboard 
                        user={user}
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist} 
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                        showOnboardingWalkthrough={showOnboardingWalkthrough}
                        onCloseWalkthrough={handleCloseWalkthrough}
                    />;
    }
  }

  // Auth Flow
  if (!user) {
    if (authPage === 'email-sent' && authEmail && authFlow) {
      return <EmailSentPage email={authEmail} flowType={authFlow} onVerify={handleAuthVerified} />;
    }
    
    if (authPage === 'login') {
      return <Login onLogin={(email) => handleStartAuthFlow('login', email)} onShowLanding={() => setAuthPage('landing')} />;
    }

    return <PlanSelectionPage onStartAuthFlow={handleStartAuthFlow} onShowLogin={() => setAuthPage('login')} />;
  }
  
  // Determine user status
  const isTrialUser = user.plan === 'trial';
  const isProUserOnboarding = user.plan === 'pro' && !isSubscribed;
  const hasFullAccess = (user && isSubscribed) || isTrialUser;

  if (isProUserOnboarding) {
    // A 'pro' user who is not subscribed is always in the onboarding/payment flow.
    return (
      <div className="min-h-screen bg-light text-secondary flex flex-col">
        <AuthHeader />
        <main className="container mx-auto px-6 py-8 flex-grow">
          <ProfilePage
            user={user}
            isOnboarding={true}
            onUpdateProfile={handleUpdateProfile}
            onSubscriptionSuccess={handleSubscriptionSuccess}
            onLogout={handleLogout}
            onBack={handleBackToDashboard} // This won't be shown in onboarding, but needed by prop types
            generatedDocuments={[]} // No documents yet
            onViewDocument={() => {}} // No documents yet
          />
        </main>
        <AppFooter />
      </div>
    );
  }

  // Main App View for subscribed pro users OR trial users
  if (hasFullAccess) {
    return (
      <div className="min-h-screen bg-light text-secondary flex flex-col">
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        <AuthHeader />
        <main className="container mx-auto px-6 py-8 flex-grow">
          {renderMainContent()}
        </main>
        <AppFooter />
      </div>
    );
  }

  // Fallback, should not be reached
  return <div>Loading...</div>;
};

export default App;
