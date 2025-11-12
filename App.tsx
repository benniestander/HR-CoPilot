import React, { useState, useEffect } from 'react';

import { POLICIES, FORMS } from './constants';
import { PRIVACY_POLICY_CONTENT, TERMS_OF_USE_CONTENT } from './legalContent';

import Dashboard from './components/Dashboard';
import GeneratorPage from './components/GeneratorPage';
import PolicyUpdater from './components/PolicyUpdater';
import ComplianceChecklist from './components/ComplianceChecklist';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import PlanSelectionPage from './components/PlanSelectionPage';
import EmailSentPage from './components/EmailSentPage';
import Toast from './components/Toast';
import FullPageLoader from './components/FullPageLoader';
import PaymentModal from './components/PaymentModal';
import LegalModal from './components/LegalModal';
import AdminDashboard from './components/AdminDashboard';


import type { Policy, Form, GeneratedDocument, PolicyType, FormType, CompanyProfile, User, Transaction, AdminActionLog } from './types';
import { UserIcon } from './components/Icons';

import {
  getUserProfile,
  createUserProfile,
  updateUser,
  getGeneratedDocuments,
  saveGeneratedDocument,
  addTransactionToUser,
  getAllUsers,
  getAllDocumentsForAllUsers,
  getAdminActionLogs,
  getAllTransactions,
  updateUserByAdmin,
  adjustUserCreditByAdmin,
  changeUserPlanByAdmin,
} from './services/firestoreService';

type AuthPage = 'landing' | 'login' | 'email-sent';
type AuthFlow = 'signup' | 'login' | 'payg_signup';

const ADMIN_EMAIL = 'admin@hrcopilot.co.za';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth state
  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authFlow, setAuthFlow] = useState<AuthFlow | null>(null);
  const [authDetails, setAuthDetails] = useState<{name: string, contactNumber: string} | null>(null);
  const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);


  // State for managing the current view (e.g., dashboard, generator, updater)
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'updater' | 'checklist' | 'profile' | 'upgrade'>('dashboard');
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin state
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allDocuments, setAllDocuments] = useState<GeneratedDocument[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [adminActionLogs, setAdminActionLogs] = useState<AdminActionLog[]>([]);


  // State for legal modals
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; content: string } | null>(null);

  const handleStartAuthFlow = (flow: AuthFlow, email: string, details?: { name: string, contactNumber: string }) => {
    setAuthEmail(email);
    setAuthFlow(flow);
     if (details) {
        setAuthDetails(details);
    }
    setAuthPage('email-sent');
  };
  
  const fetchAdminData = async () => {
      const [users, docs, transactions, logs] = await Promise.all([
        getAllUsers(), 
        getAllDocumentsForAllUsers(),
        getAllTransactions(),
        getAdminActionLogs(),
      ]);
      setAllUsers(users);
      setAllDocuments(docs);
      setAllTransactions(transactions);
      setAdminActionLogs(logs);
  }

  const handleAuthVerified = async () => {
    if (!authEmail) return;
    setIsLoading(true);

    const lowerCaseEmail = authEmail.toLowerCase();
    const isDemoUser = lowerCaseEmail === 'a@b.com';
    const uid = isDemoUser ? 'demo-user-uid' : `user-uid-${lowerCaseEmail}`;

    let currentUser = await getUserProfile(uid);

    if (!currentUser) {
        switch (authFlow) {
            case 'payg_signup':
                currentUser = await createUserProfile(uid, lowerCaseEmail, 'payg', authDetails?.name, authDetails?.contactNumber);
                setCurrentView('upgrade');
                break;
            case 'signup':
                currentUser = await createUserProfile(uid, lowerCaseEmail, 'pro', authDetails?.name, authDetails?.contactNumber);
                break;
            case 'login':
                if (isDemoUser) {
                    currentUser = await createUserProfile(uid, lowerCaseEmail, 'pro', 'Demo User', '0821234567');
                } else if (lowerCaseEmail === ADMIN_EMAIL) {
                    currentUser = await createUserProfile(uid, lowerCaseEmail, 'pro', 'Admin', '0000000000');
                }
                else {
                    currentUser = await createUserProfile(uid, lowerCaseEmail, 'payg');
                    setCurrentView('upgrade'); 
                }
                break;
        }
    }

    setUser(currentUser);
    setIsSubscribed(currentUser?.plan === 'pro');

    if (currentUser?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        await fetchAdminData();
    } else if (currentUser) {
        const docs = await getGeneratedDocuments(currentUser.uid);
        setGeneratedDocuments(docs);
    }

    setAuthEmail(null);
    setAuthFlow(null);
    setAuthDetails(null);
    setAuthPage('landing');
    setIsLoading(false);
  };

  const handleUpdateProfile = async (updatedProfile: CompanyProfile) => {
    if (!user) return;
    const updatedUser = { ...user, profile: updatedProfile };
    setUser(updatedUser);
    await updateUser(user.uid, { profile: updatedProfile });
    setToastMessage("Profile updated successfully!");
  };

  // Admin action handlers
  const handleAdminUpdateUser = async (targetUid: string, updates: Partial<User>) => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await updateUserByAdmin(user.email, targetUid, updates);
    await fetchAdminData(); // Refresh all admin data
    setToastMessage("User profile updated.");
  };

  const handleAdminAdjustCredit = async (targetUid: string, amountInCents: number, reason: string) => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await adjustUserCreditByAdmin(user.email, targetUid, amountInCents, reason);
    await fetchAdminData();
    const amountRand = (amountInCents / 100).toFixed(2);
    setToastMessage(`Credit adjusted by R${amountRand}.`);
  };

  const handleAdminChangePlan = async (targetUid: string, newPlan: 'pro' | 'payg') => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await changeUserPlanByAdmin(user.email, targetUid, newPlan);
    await fetchAdminData();
    setToastMessage("User plan changed successfully.");
  };


  const handleSubscriptionSuccess = async () => {
    if (!user) return;
    setIsSubscribed(true);
    const updatedUser = { ...user, plan: 'pro' as const };
    setUser(updatedUser);
    await updateUser(user.uid, { plan: 'pro' });
    await addTransactionToUser(user.uid, { description: 'Ingcweti Pro Subscription (12 months)', amount: 74700 });
    setToastMessage("Success! Welcome to Ingcweti Pro. Your dashboard is ready.");
    setCurrentView('dashboard');
    setShowOnboardingWalkthrough(true); // Trigger walkthrough for new pro users
  };
  
  const handleTopUpSuccess = async (amountInCents: number) => {
    if (!user) return;
    await addTransactionToUser(user.uid, { description: 'Credit Top-Up', amount: amountInCents });
    const updatedUser = await getUserProfile(user.uid);
    if(updatedUser) setUser(updatedUser);
    setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added to your account.`);
    setCurrentView('dashboard');
  };

  const handleCloseWalkthrough = () => {
    setShowOnboardingWalkthrough(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
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
    setAllUsers([]);
    setAllDocuments([]);
  };

  const handleStartOver = () => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setDocumentToView(null);
  };

  const handleSelectItem = (item: Policy | Form) => {
    if (user?.plan === 'payg' && user.creditBalance < item.price) {
        setToastMessage("Insufficient credit. Please top up your account.");
        setCurrentView('upgrade');
        return;
    }
    setSelectedItem(item);
    setDocumentToView(null);
    setCurrentView('generator');
  };

  const handleStartUpdate = () => {
    setCurrentView('updater');
  };
  
  const handleShowProfile = () => {
    setCurrentView('profile');
  };
  
  const handleGoToUpgrade = () => {
    setCurrentView('upgrade');
  };

  const handleStartChecklist = () => {
    setCurrentView('checklist');
  };

  const handleBackToDashboard = () => {
      setCurrentView('dashboard');
      setSelectedItem(null);
      setDocumentToView(null);
  }

  const handleDocumentGenerated = async (doc: GeneratedDocument, originalId?: string) => {
    if (!user || !selectedItem) return;
    
    let docToSave = { ...doc };

    if (originalId) {
      const oldDoc = generatedDocuments.find(d => d.id === originalId);
      if (oldDoc) {
        const historyEntry = {
          version: oldDoc.version,
          createdAt: oldDoc.createdAt,
          content: oldDoc.content,
        };
        docToSave = {
          ...doc,
          id: originalId,
          version: oldDoc.version + 1,
          createdAt: new Date().toISOString(),
          history: [historyEntry, ...(oldDoc.history || [])],
        };
        setToastMessage("Document updated successfully!");
      }
    } else {
        docToSave = { ...doc, version: 1, history: [] };
        if (user.plan === 'payg') {
            await addTransactionToUser(user.uid, { description: `Generated: ${doc.title}`, amount: -selectedItem.price });
            const updatedUser = await getUserProfile(user.uid);
            if(updatedUser) setUser(updatedUser);
            setToastMessage("Document generated! The cost has been deducted from your credit.");
        } else {
            setToastMessage("Document generated successfully!");
        }
    }

    await saveGeneratedDocument(user.uid, docToSave);
    const updatedDocs = await getGeneratedDocuments(user.uid);
    setGeneratedDocuments(updatedDocs);
    handleBackToDashboard();
  };
  
  const handleViewDocument = (doc: GeneratedDocument) => {
    setDocumentToView(doc);
    const item = doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType];
    setSelectedItem(item);
    setCurrentView('generator');
  };

  const handleShowPrivacyPolicy = () => {
    setLegalModalContent({ title: 'Privacy Policy', content: PRIVACY_POLICY_CONTENT });
  };

  const handleShowTerms = () => {
    setLegalModalContent({ title: 'Terms of Use', content: TERMS_OF_USE_CONTENT });
  };

  const AuthHeader = ({ isAdminHeader = false }: { isAdminHeader?: boolean }) => (
     <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
              <img 
                  src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" 
                  alt="Ingcweti Logo" 
                  className="h-12 cursor-pointer"
                  onClick={handleStartOver}
              />
               {isAdminHeader ? (
                 <div className="flex items-center space-x-4">
                    <span className="font-bold text-red-600">ADMIN PANEL</span>
                    <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">
                        Logout
                    </button>
                 </div>
               ) : (
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                    {user?.plan === 'payg' && (
                        <div className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            Credit: R{(user.creditBalance / 100).toFixed(2)}
                        </div>
                    )}
                    <button onClick={handleShowProfile} className="flex items-center text-sm font-semibold text-primary hover:underline">
                        <UserIcon className="w-5 h-5 mr-1" />
                        My Profile
                    </button>
                    <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">
                        Logout
                    </button>
                </div>
               )}
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
               <div className="flex justify-center space-x-6 mb-4">
                  <button onClick={handleShowPrivacyPolicy} className="text-sm text-gray-300 hover:text-white hover:underline">
                    Privacy Policy
                  </button>
                  <button onClick={handleShowTerms} className="text-sm text-gray-300 hover:text-white hover:underline">
                    Terms of Use
                  </button>
              </div>
              <p className="text-sm text-gray-300">
                  © {new Date().getFullYear()} Ingcweti. All rights reserved.
              </p>
          </div>
      </footer>
  );
  
  const renderDashboardContent = () => {
    switch (currentView) {
        case 'dashboard':
            return <Dashboard 
                        user={user}
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist}
                        onGoToProfile={handleGoToUpgrade}
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
        case 'upgrade':
            if (!user) { handleBackToDashboard(); return null; }
            return <ProfilePage 
                        user={user}
                        isOnboarding={currentView === 'upgrade'}
                        onUpdateProfile={handleUpdateProfile}
                        onSubscriptionSuccess={handleSubscriptionSuccess}
                        onTopUpSuccess={handleTopUpSuccess}
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
                        onGoToProfile={handleGoToUpgrade}
                        generatedDocuments={generatedDocuments}
                        onViewDocument={handleViewDocument}
                        showOnboardingWalkthrough={showOnboardingWalkthrough}
                        onCloseWalkthrough={handleCloseWalkthrough}
                    />;
    }
  }

  const renderPage = () => {
    if (isLoading) {
        return <FullPageLoader />;
    }

    // Admin View
    if (user && isAdmin) {
        return (
            <div className="min-h-screen bg-gray-100 text-secondary flex flex-col">
                 {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
                <AuthHeader isAdminHeader={true} />
                <main className="container mx-auto px-6 py-8 flex-grow">
                    <AdminDashboard
                        allUsers={allUsers}
                        allDocuments={allDocuments}
                        allTransactions={allTransactions}
                        adminActionLogs={adminActionLogs}
                        adminActions={{
                            updateUser: handleAdminUpdateUser,
                            adjustCredit: handleAdminAdjustCredit,
                            changePlan: handleAdminChangePlan,
                        }}
                    />
                </main>
                <AppFooter />
            </div>
        );
    }
    
    // Auth Flow
    if (!user) {
      if (authPage === 'email-sent' && authEmail && authFlow) {
        return <EmailSentPage email={authEmail} flowType={authFlow} onVerify={handleAuthVerified} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} />;
      }
      
      if (authPage === 'login') {
        return <Login onLogin={(email) => handleStartAuthFlow('login', email)} onShowLanding={() => setAuthPage('landing')} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} />;
      }

      return <PlanSelectionPage onStartAuthFlow={handleStartAuthFlow} onShowLogin={() => setAuthPage('login')} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} />;
    }
    
    // A 'pro' user who is not subscribed is always in the onboarding/payment flow.
    if (user.plan === 'pro' && !isSubscribed) {
      return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
          <AuthHeader />
          <main className="container mx-auto px-6 py-8 flex-grow">
            <ProfilePage
              user={user}
              isOnboarding={true}
              onUpdateProfile={handleUpdateProfile}
              onSubscriptionSuccess={handleSubscriptionSuccess}
              onTopUpSuccess={handleTopUpSuccess}
              onLogout={handleLogout}
              onBack={handleBackToDashboard}
              generatedDocuments={[]}
              onViewDocument={() => {}}
            />
          </main>
          <AppFooter />
        </div>
      );
    }

    // Main App View for subscribed pro users OR payg users
    if (user) {
      return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
          <AuthHeader />
          <main className="container mx-auto px-6 py-8 flex-grow">
            {renderDashboardContent()}
          </main>
          <AppFooter />
        </div>
      );
    }

    // Fallback, should not be reached
    return <div>Loading...</div>;
  };

  return (
    <>
      {renderPage()}
      {legalModalContent && (
        <LegalModal
          isOpen={!!legalModalContent}
          onClose={() => setLegalModalContent(null)}
          title={legalModalContent.title}
          content={legalModalContent.content}
        />
      )}
    </>
  );
};

export default App;
