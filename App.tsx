

import React, { useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './services/firebase';

import { POLICIES, FORMS } from './constants';
import { PRIVACY_POLICY_CONTENT, TERMS_OF_USE_CONTENT } from './legalContent';

import Dashboard from './components/Dashboard';
import GeneratorPage from './components/GeneratorPage';
import PolicyUpdater from './components/PolicyUpdater';
import ComplianceChecklist from './components/ComplianceChecklist';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import PlanSelectionPage from './components/PlanSelectionPage';
import SubscriptionPage from './components/SubscriptionPage';
import PaygPaymentPage from './components/PaygPaymentPage';
import EmailSentPage from './components/EmailSentPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import Toast from './components/Toast';
import FullPageLoader from './components/FullPageLoader';
import PaymentModal from './components/PaymentModal';
import LegalModal from './components/LegalModal';
import AdminDashboard from './components/AdminDashboard';
import AdminNotificationPanel from './components/AdminNotificationPanel';
import InitialProfileSetup from './components/InitialProfileSetup';


import type { Policy, Form, GeneratedDocument, PolicyType, FormType, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon } from './types';
import { UserIcon, BellIcon } from './components/Icons';

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
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  simulateFailedPaymentForUser,
  getUserFiles,
  uploadUserFile,
  getDownloadUrlForFile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  createCoupon,
  getCoupons,
  deactivateCoupon,
  validateCoupon,
  createAdminNotification,
} from './services/firestoreService';

type AuthPage = 'landing' | 'login' | 'email-sent' | 'verify-email';
type AuthFlow = 'signup' | 'login' | 'payg_signup';

const ADMIN_EMAIL = 'admin@hrcopilot.co.za';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [unverifiedUser, setUnverifiedUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth state
  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authFlow, setAuthFlow] = useState<AuthFlow | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);


  // State for managing the current view (e.g., dashboard, generator, updater)
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'updater' | 'checklist' | 'profile' | 'upgrade' | 'topup'>('dashboard');
  const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin state
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allDocuments, setAllDocuments] = useState<GeneratedDocument[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [adminActionLogs, setAdminActionLogs] = useState<AdminActionLog[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [allCoupons, setAllCoupons] = useState<Coupon[]>([]);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  // State for legal modals
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
            setNotificationPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        // User is signed in. Check if their email is verified.
        if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
          // Logged in but not verified. Show verification screen.
          // Only for email/password, not for Google which is auto-verified.
          setUnverifiedUser(firebaseUser);
          setUser(null);
          setAuthPage('verify-email');
          setIsLoading(false);
          return;
        }

        // User is signed in AND verified.
        setUnverifiedUser(null);
        let appUser = await getUserProfile(firebaseUser.uid);
        
        if (!appUser) {
          // This is a new, verified user. Create their profile.
          const flow = window.localStorage.getItem('authFlow') as AuthFlow | null;
          const detailsJson = window.localStorage.getItem('authDetails');
          const details = detailsJson ? JSON.parse(detailsJson) : null;
          
          let plan: 'pro' | 'payg' = 'payg';
          if (flow === 'signup') plan = 'pro';

          appUser = await createUserProfile(firebaseUser.uid, firebaseUser.email!, plan, details?.name || firebaseUser.displayName || undefined, details?.contactNumber);

          // Clean up local storage after profile creation
          window.localStorage.removeItem('authFlow');
          window.localStorage.removeItem('authDetails');
        }

        // Onboarding Check: If essential profile info is missing, trigger the setup flow.
        if (appUser && (!appUser.profile.companyName || !appUser.profile.industry)) {
            setNeedsOnboarding(true);
        } else {
            setNeedsOnboarding(false);
        }

        setUser(appUser);
        setIsSubscribed(appUser.plan === 'pro');
        setAuthPage('landing');
        
        if (appUser.email === ADMIN_EMAIL) {
          setIsAdmin(true);
          await fetchAdminData();
        } else {
          const [docs, files] = await Promise.all([
            getGeneratedDocuments(appUser.uid),
            getUserFiles(appUser.uid)
          ]);
          setGeneratedDocuments(docs);
          setUserFiles(files);
        }
      } else {
        // User is signed out. Reset all state.
        setUser(null);
        setUnverifiedUser(null);
        setIsAdmin(false);
        setIsSubscribed(false);
        setCurrentView('dashboard');
        setSelectedItem(null);
        setGeneratedDocuments([]);
        setUserFiles([]);
        setDocumentToView(null);
        setShowOnboardingWalkthrough(false);
        setNeedsOnboarding(false);
        setAllUsers([]);
        setAllDocuments([]);
        setAuthPage('landing');
        setAuthEmail(null);
        setAuthFlow(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartAuthFlow = async (
    flow: 'signup' | 'payg_signup', 
    email: string, 
    details: { password: string; name?: string; contactNumber?: string }
  ) => {
    const { password, name, contactNumber } = details;
    setIsLoading(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await signOut(auth); // Sign out immediately to force verification.

        // Store details for profile creation after verification
        window.localStorage.setItem('authFlow', flow);
        if (name || contactNumber) {
            window.localStorage.setItem('authDetails', JSON.stringify({ name, contactNumber }));
        }

        setAuthEmail(email);
        setAuthFlow(flow);
        setAuthPage('email-sent');
    } catch (error: any) {
        setToastMessage(`Sign up error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartGoogleAuthFlow = (flow: 'signup' | 'payg_signup') => {
    window.localStorage.setItem('authFlow', flow);
    signInWithPopup(auth, googleProvider).catch((error: any) => {
      setToastMessage(`Google sign-in failed: ${error.message}`);
    });
  };

  const handleSignInWithGoogle = async () => {
    // Explicitly set authFlow for a sign-in attempt to avoid using stale signup flows
    window.localStorage.setItem('authFlow', 'login');
    setIsLoading(true);
    try {
        await signInWithPopup(auth, googleProvider);
        // onAuthStateChanged will handle the rest
    } catch (error: any) {
        setToastMessage(`Google sign-in failed: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle routing to the app or verification screen.
    } catch (error: any) {
      setToastMessage(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      await createAdminNotification({
        type: 'password_reset_request',
        message: `User with email ${email} requested a password reset.`,
      });
    } catch (error: any) {
      setToastMessage(`Error: ${error.message}`);
      throw error;
    }
  };

  const fetchAdminData = async () => {
      const [users, docs, transactions, logs, notifications, coupons] = await Promise.all([
        getAllUsers(), 
        getAllDocumentsForAllUsers(),
        getAllTransactions(),
        getAdminActionLogs(),
        getAdminNotifications(),
        getCoupons(),
      ]);
      setAllUsers(users);
      setAllDocuments(docs);
      setAllTransactions(transactions);
      setAdminActionLogs(logs);
      setAdminNotifications(notifications);
      setAllCoupons(coupons);
  }

  const handleUpdateProfile = async (updatedProfile: CompanyProfile) => {
    if (!user) return;
    const updatedUser = { ...user, profile: updatedProfile };
    setUser(updatedUser);
    await updateUser(user.uid, { profile: updatedProfile });
    setToastMessage("Profile updated successfully!");
  };

  const handleInitialProfileSubmit = async (profileData: CompanyProfile) => {
    if (!user) return;
    
    const updatedProfile = { ...user.profile, ...profileData };
    await handleUpdateProfile(updatedProfile); // Re-use the existing function
    
    setNeedsOnboarding(false);
    setShowOnboardingWalkthrough(true); // Trigger guided tour
  };

  const handleProfilePhotoUpload = async (file: File) => {
    if (!user) {
        setToastMessage("You must be logged in to upload a photo.");
        return;
    }
    setIsLoading(true);
    try {
        const photoURL = await uploadProfilePhoto(user.uid, file);
        const updatedUser = { ...user, photoURL };
        setUser(updatedUser);
        setToastMessage("Profile photo updated successfully!");
    } catch (error: any) {
        setToastMessage(`Upload failed: ${error.message}`);
        console.error("Photo upload error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleProfilePhotoDelete = async () => {
    if (!user) {
        setToastMessage("You must be logged in to delete your photo.");
        return;
    }
    if (window.confirm("Are you sure you want to delete your profile photo?")) {
        setIsLoading(true);
        try {
            await deleteProfilePhoto(user.uid);
            const updatedUser = { ...user };
            delete updatedUser.photoURL;
            setUser(updatedUser);
            setToastMessage("Profile photo deleted.");
        } catch (error: any) {
            setToastMessage(`Deletion failed: ${error.message}`);
            console.error("Photo deletion error:", error);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleFileUpload = async (file: File, notes: string) => {
    if (!user) {
        setToastMessage("You must be logged in to upload files.");
        return;
    }
    try {
        await uploadUserFile(user.uid, file, notes);
        const updatedFiles = await getUserFiles(user.uid);
        setUserFiles(updatedFiles);
        setToastMessage("File uploaded successfully!");
    } catch (error: any) {
        setToastMessage(`Upload failed: ${error.message}`);
        console.error("File upload error:", error);
    }
  };

  const handleFileDownload = async (storagePath: string) => {
      try {
          const url = await getDownloadUrlForFile(storagePath);
          window.open(url, '_blank');
      } catch (error: any) {
          setToastMessage(`Download failed: ${error.message}`);
          console.error("File download error:", error);
      }
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

  const handleSimulateFailedPayment = async (targetUid: string, targetUserEmail: string) => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await simulateFailedPaymentForUser(user.email, targetUid, targetUserEmail);
    await fetchAdminData();
    setToastMessage(`Simulated a failed payment for ${targetUserEmail}.`);
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    await fetchAdminData();
  };

  const handleMarkAllNotificationsRead = async () => {
    await markAllNotificationsAsRead();
    await fetchAdminData();
    setNotificationPanelOpen(false);
  };
  
  const handleCreateCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>) => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await createCoupon(user.email, couponData);
    await fetchAdminData();
    setToastMessage(`Coupon "${couponData.code}" created successfully!`);
  };

  const handleDeactivateCoupon = async (couponId: string) => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    await deactivateCoupon(user.email, couponId);
    await fetchAdminData();
    setToastMessage(`Coupon deactivated.`);
  };

  const handleValidateCoupon = async (code: string) => {
    if (!user) return { valid: false, message: 'You must be logged in.' };
    return await validateCoupon(user.uid, code);
  };


  const handleSubscriptionSuccess = async (couponCode?: string) => {
    if (!user) return;
    setIsSubscribed(true);
    const updatedUser = { ...user, plan: 'pro' as const };
    setUser(updatedUser);
    await updateUser(user.uid, { plan: 'pro' });
    await addTransactionToUser(user.uid, { description: 'Ingcweti Pro Subscription (12 months)', amount: 74700 }, couponCode);
    setToastMessage("Success! Welcome to Ingcweti Pro. Your dashboard is ready.");
    setCurrentView('dashboard');
    setShowOnboardingWalkthrough(true); // Trigger walkthrough for new pro users
  };
  
  const handleTopUpSuccess = async (amountInCents: number, couponCode?: string) => {
    if (!user) return;
    await addTransactionToUser(user.uid, { description: 'Credit Top-Up', amount: amountInCents }, couponCode);
    const updatedUser = await getUserProfile(user.uid);
    if(updatedUser) setUser(updatedUser);
    setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added to your account.`);
    setCurrentView('dashboard');
  };

  const handleCloseWalkthrough = () => {
    setShowOnboardingWalkthrough(false);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
        setToastMessage("Failed to log out.");
    });
  };

  const handleStartOver = () => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setDocumentToView(null);
  };

  const handleSelectItem = (item: Policy | Form) => {
    if (user?.plan === 'payg' && user.creditBalance < item.price) {
        setToastMessage("Insufficient credit. Please top up your account.");
        setCurrentView('topup');
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

  const handleGoToTopUp = () => {
    setCurrentView('topup');
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

  const AuthHeader = ({ isAdminHeader = false }: { isAdminHeader?: boolean }) => {
     const unreadCount = adminNotifications.filter(n => !n.isRead).length;

     return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
                <img 
                    src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" 
                    alt="Ingcweti Logo" 
                    className="h-12 cursor-pointer"
                    onClick={handleStartOver}
                />
                {isAdminHeader ? (
                    <div className="flex items-center space-x-6">
                        <span className="font-bold text-red-600">ADMIN PANEL</span>
                        <div className="relative" ref={notificationPanelRef}>
                            <button onClick={() => setNotificationPanelOpen(prev => !prev)} className="relative text-gray-600 hover:text-primary">
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>}
                            </button>
                            {isNotificationPanelOpen && (
                                <AdminNotificationPanel 
                                    notifications={adminNotifications}
                                    onMarkAsRead={handleMarkNotificationRead}
                                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                                />
                            )}
                        </div>
                        <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                        {user?.plan === 'payg' && (
                            <div className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                {/* FIX: Cast creditBalance to Number to prevent type errors. */}
                                Credit: R{(Number(user.creditBalance) / 100).toFixed(2)}
                            </div>
                        )}
                        <button onClick={handleShowProfile} className="flex items-center text-sm font-semibold text-primary hover:underline">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5 mr-1" />
                            )}
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
  };

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
                        onGoToTopUp={handleGoToTopUp}
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
            if (!user) { handleBackToDashboard(); return null; }
            return <ProfilePage 
                        user={user}
                        onUpdateProfile={handleUpdateProfile}
                        onLogout={handleLogout} 
                        onBack={handleBackToDashboard}
                        generatedDocuments={generatedDocuments}
                        userFiles={userFiles}
                        onFileUpload={handleFileUpload}
                        onFileDownload={handleFileDownload}
                        onViewDocument={handleViewDocument}
                        onProfilePhotoUpload={handleProfilePhotoUpload}
                        onProfilePhotoDelete={handleProfilePhotoDelete}
                        onUpgrade={handleGoToUpgrade}
                        onGoToTopUp={handleGoToTopUp}
                    />;
        case 'upgrade':
             if (!user) { handleBackToDashboard(); return null; }
             return <SubscriptionPage
                        user={user}
                        onSuccess={handleSubscriptionSuccess}
                        onCancel={handleBackToDashboard}
                        onValidateCoupon={handleValidateCoupon}
                    />;
        case 'topup':
            if (!user || user.plan !== 'payg') { handleBackToDashboard(); return null; }
            return <PaygPaymentPage
                        user={user}
                        onTopUpSuccess={handleTopUpSuccess}
                        onCancel={handleBackToDashboard}
                        onUpgrade={handleGoToUpgrade}
                        onValidateCoupon={handleValidateCoupon}
                    />;
        default:
             return <Dashboard 
                        user={user}
                        onSelectItem={handleSelectItem} 
                        onStartUpdate={handleStartUpdate} 
                        onStartChecklist={handleStartChecklist} 
                        onGoToTopUp={handleGoToTopUp}
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
                        allCoupons={allCoupons}
                        adminActions={{
                            updateUser: handleAdminUpdateUser,
                            adjustCredit: handleAdminAdjustCredit,
                            changePlan: handleAdminChangePlan,
                            simulateFailedPayment: handleSimulateFailedPayment,
                            createCoupon: handleCreateCoupon,
                            deactivateCoupon: handleDeactivateCoupon,
                        }}
                    />
                </main>
                <AppFooter />
            </div>
        );
    }
    
    // Auth Flow
    if (unverifiedUser) {
        return <VerifyEmailPage user={unverifiedUser} onLogout={handleLogout} />;
    }
    
    if (!user) {
      if (authPage === 'email-sent' && authEmail && authFlow) {
        return <EmailSentPage email={authEmail} flowType={authFlow} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} />;
      }
      
      if (authPage === 'login') {
        return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} onShowLanding={() => setAuthPage('landing')} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} onSignInWithGoogle={handleSignInWithGoogle} />;
      }

      return <PlanSelectionPage onStartAuthFlow={handleStartAuthFlow} onStartGoogleAuthFlow={handleStartGoogleAuthFlow} onShowLogin={() => setAuthPage('login')} onShowPrivacyPolicy={handleShowPrivacyPolicy} onShowTerms={handleShowTerms} />;
    }
    
    // A 'pro' user who has not paid is always in the subscription flow.
    if (user.plan === 'pro' && !isSubscribed) {
      return (
        <SubscriptionPage
          user={user}
          onSuccess={handleSubscriptionSuccess}
          onCancel={handleLogout}
          onValidateCoupon={handleValidateCoupon}
        />
      );
    }

    // A new user (Pro or PAYG) with an incomplete profile must complete onboarding.
    if (user && needsOnboarding) {
        return <InitialProfileSetup onProfileSubmit={handleInitialProfileSubmit} userEmail={user.email} />;
    }

    // Main App View for paid pro users OR payg users who have completed onboarding
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
    return <FullPageLoader />;
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