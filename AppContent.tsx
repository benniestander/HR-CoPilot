
import React, { useRef, useEffect, lazy, Suspense } from 'react';
import Dashboard from './components/Dashboard';
import FullPageLoader from './components/FullPageLoader';
import Login from './components/Login';
import EmailSentPage from './components/EmailSentPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import Toast from './components/Toast';
import PaymentModal from './components/PaymentModal';
import LegalModal from './components/LegalModal';
import AdminNotificationPanel from './components/AdminNotificationPanel';
import InitialProfileSetup from './components/InitialProfileSetup';
import ConfirmationModal from './components/ConfirmationModal';
import { UserIcon, BellIcon, BookIcon } from './components/Icons';
import { useAuthContext } from './contexts/AuthContext';
import { useDataContext } from './contexts/DataContext';
import { useUIContext } from './contexts/UIContext';
import { useModalContext } from './contexts/ModalContext';
import { PRIVACY_POLICY_CONTENT, TERMS_OF_USE_CONTENT } from './legalContent';
import type { Policy, Form } from './types';

export type AuthPage = 'landing' | 'login' | 'email-sent' | 'verify-email';
export type AuthFlow = 'signup' | 'login' | 'payg_signup';

// Lazy-loaded components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const GeneratorPage = lazy(() => import('./components/GeneratorPage'));
const PolicyUpdater = lazy(() => import('./components/PolicyUpdater'));
const ComplianceChecklist = lazy(() => import('./components/ComplianceChecklist'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const PlanSelectionPage = lazy(() => import('./components/PlanSelectionPage'));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage'));
const PaygPaymentPage = lazy(() => import('./components/PaygPaymentPage'));
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'));


const AppContent: React.FC = () => {
    const {
        user,
        unverifiedUser,
        isAdmin,
        isLoading,
        handleLogout,
        authPage,
        setAuthPage,
        authEmail,
        authFlow,
        needsOnboarding,
        onboardingSkipped,
        handleSkipOnboarding,
        handleGoToProfileSetup,
        isSubscribed,
        handleStartAuthFlow,
    } = useAuthContext();

    const {
        paginatedUsers,
        handleNextUsers,
        handlePrevUsers,
        isFetchingUsers,
        paginatedDocuments,
        handleNextDocs,
        handlePrevDocs,
        isFetchingDocs,
        transactionsForUserPage,
        paginatedLogs,
        handleNextLogs,
        handlePrevLogs,
        isFetchingLogs,
        adminNotifications,
        coupons,
        handleInitialProfileSubmit,
        adminActions,
        handleMarkNotificationRead,
        handleMarkAllNotificationsRead,
        handleSubscriptionSuccess,
        handleTopUpSuccess,
        handleDocumentGenerated,
        handleDeductCredit,
    } = useDataContext();

    const {
        currentView,
        navigateTo,
        selectedItem,
        setSelectedItem,
        documentToView,
        setDocumentToView,
        toastMessage,
        setToastMessage,
        isNotificationPanelOpen,
        setNotificationPanelOpen,
        showOnboardingWalkthrough,
        setShowOnboardingWalkthrough,
        setIsPrePaid
    } = useUIContext();

    const { legalModalContent, showLegalModal, confirmation, hideConfirmationModal, showConfirmationModal } = useModalContext();

    const notificationPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
                setNotificationPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setNotificationPanelOpen]);

    useEffect(() => {
        if (!user) {
            navigateTo('dashboard');
            setSelectedItem(null);
            setDocumentToView(null);
            setShowOnboardingWalkthrough(false);
        }
    }, [user, navigateTo, setSelectedItem, setDocumentToView, setShowOnboardingWalkthrough]);

    const handleCloseWalkthrough = () => {
        setShowOnboardingWalkthrough(false);
    };

    const handleStartOver = () => {
        navigateTo('dashboard');
        setSelectedItem(null);
        setDocumentToView(null);
    };

    const handleShowProfile = () => {
        navigateTo('profile');
    };

    const handleBackToDashboard = () => {
        navigateTo('dashboard');
        setSelectedItem(null);
        setDocumentToView(null);
    }

    const handleSelectDocument = (item: Policy | Form) => {
        if (!user) return;
    
        // 1. Pro User Profile Check
        if (user.plan === 'pro') {
            // Ensure basic profile data exists before generating
            if (!user.profile.companyName || (item.kind === 'policy' && !user.profile.industry)) {
                 showConfirmationModal({
                    title: "Complete Your Profile",
                    message: "To generate documents with your Pro plan, please complete your company profile details first.",
                    confirmText: "Go to Profile Setup",
                    onConfirm: () => {
                        hideConfirmationModal();
                        handleGoToProfileSetup();
                    },
                    cancelText: "Cancel"
                });
                return;
            }
            
            setSelectedItem(item);
            setDocumentToView(null);
            setIsPrePaid(false); // Not relevant for Pro, but good hygiene
            navigateTo('generator');
            return;
        }
    
        // 2. PAYG Checks
        if (user.plan === 'payg') {
            const price = item.price;
            const balance = user.creditBalance || 0;
    
            if (balance < price) {
                 showConfirmationModal({
                    title: "Insufficient Credit",
                    message: (
                        <div className="text-center">
                            <p className="text-red-600 font-semibold mb-2">You do not have enough credit.</p>
                            <p className="mb-4">
                                This document costs <strong className="text-secondary">R{(price / 100).toFixed(2)}</strong>, but you only have <strong>R{(balance / 100).toFixed(2)}</strong> available.
                            </p>
                            <p className="text-sm text-gray-600">Please top up to continue.</p>
                        </div>
                    ),
                    confirmText: "Top Up Now",
                    onConfirm: () => {
                        hideConfirmationModal();
                        navigateTo('topup');
                    },
                    cancelText: "Cancel"
                });
                return;
            }
    
            // Confirm Cost AND Deduct immediately
            showConfirmationModal({
                title: "Confirm Generation",
                message: (
                    <div className="text-center">
                        <p className="mb-4">
                            Generating a <strong>{item.title}</strong> costs <strong className="text-secondary">R{(price / 100).toFixed(2)}</strong>.
                        </p>
                        <p className="text-sm text-gray-600">
                            This amount will be deducted from your credit balance immediately.
                        </p>
                    </div>
                ),
                confirmText: "Confirm & Generate",
                onConfirm: async () => {
                    // Execute deduction logic HERE
                    const success = await handleDeductCredit(price, `Generated: ${item.title}`);
                    
                    if (success) {
                        hideConfirmationModal();
                        setSelectedItem(item);
                        setDocumentToView(null);
                        setIsPrePaid(true); // Flag that payment was collected
                        navigateTo('generator');
                    } else {
                        // handleDeductCredit shows the toast error
                        hideConfirmationModal();
                    }
                },
                cancelText: "Cancel"
            });
        }
    };

    const AuthHeader = ({ isAdminHeader = false }: { isAdminHeader?: boolean }) => {
        const unreadCount = adminNotifications.filter(n => !n.isRead).length;

        return (
            <header className="bg-white shadow-sm py-4 sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <img
                        src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
                        alt="HR CoPilot Logo"
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
                            <button 
                                onClick={() => navigateTo('knowledge-base')}
                                className="flex items-center text-sm font-semibold text-gray-600 hover:text-primary transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200"
                                title="Help & Guides"
                            >
                                <BookIcon className="w-5 h-5 mr-1.5" />
                                <span className="hidden sm:inline">Help</span>
                            </button>

                            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                            <span className="text-sm text-gray-600 hidden md:block">{user?.email}</span>
                            
                            {user?.plan === 'payg' && (
                                <div className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
                                    Credit: R{(Number(user.creditBalance) / 100).toFixed(2)}
                                </div>
                            )}
                            <button onClick={handleShowProfile} className="flex items-center text-sm font-semibold text-primary hover:underline whitespace-nowrap">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                                ) : (
                                    <UserIcon className="w-5 h-5 mr-1" />
                                )}
                                <span className="hidden sm:inline">My Profile</span>
                            </button>
                            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline whitespace-nowrap">
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
                    alt="HR CoPilot Logo"
                    className="h-10 mx-auto mb-4"
                />
                <div className="flex justify-center space-x-6 mb-4">
                    <button onClick={() => showLegalModal('Privacy Policy', PRIVACY_POLICY_CONTENT)} className="text-sm text-gray-300 hover:text-white hover:underline">
                        Privacy Policy
                    </button>
                    <button onClick={() => showLegalModal('Terms of Use', TERMS_OF_USE_CONTENT)} className="text-sm text-gray-300 hover:text-white hover:underline">
                        Terms of Use
                    </button>
                </div>
                <p className="text-sm text-gray-300">
                    © {new Date().getFullYear()} HR CoPilot. All rights reserved.
                </p>
            </div>
        </footer>
    );

    const renderDashboardContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard
                    onStartUpdate={() => navigateTo('updater')}
                    onStartChecklist={() => navigateTo('checklist')}
                    showOnboardingWalkthrough={showOnboardingWalkthrough}
                    onCloseWalkthrough={handleCloseWalkthrough}
                    onGoToProfileSetup={handleGoToProfileSetup}
                    onSelectDocument={handleSelectDocument}
                />;
            case 'generator':
                if (!selectedItem || !user) {
                    // Safe fallback
                    return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
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
                />;
            case 'checklist':
                if (!user) { 
                     return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
                }
                return <ComplianceChecklist
                    userProfile={user.profile}
                    onBack={handleBackToDashboard}
                    onSelectDocument={handleSelectDocument}
                />;
            case 'profile':
                if (!user) { 
                     return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
                }
                return <ProfilePage
                    onBack={handleBackToDashboard}
                    onUpgrade={() => navigateTo('upgrade')}
                    onGoToTopUp={() => navigateTo('topup')}
                />;
            case 'upgrade':
                if (!user) { 
                     return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
                }
                return <SubscriptionPage
                    onSuccess={handleSubscriptionSuccess}
                    onCancel={handleBackToDashboard}
                />;
            case 'topup':
                // FIX: Do not return null or call state setter here. 
                // Render fallback Dashboard if logic fails. useEffect will handle navigation if needed elsewhere,
                // or the user sees the dashboard and realizes they can't top up (though button shouldn't be visible).
                if (!user || user.plan !== 'payg') { 
                     return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
                }
                return <PaygPaymentPage
                    onTopUpSuccess={handleTopUpSuccess}
                    onCancel={handleBackToDashboard}
                    onUpgrade={() => navigateTo('upgrade')}
                />;
            case 'knowledge-base':
                if (!user) { 
                     return <Dashboard
                        onStartUpdate={() => navigateTo('updater')}
                        onStartChecklist={() => navigateTo('checklist')}
                        showOnboardingWalkthrough={false}
                        onCloseWalkthrough={handleCloseWalkthrough}
                        onGoToProfileSetup={handleGoToProfileSetup}
                        onSelectDocument={handleSelectDocument}
                    />;
                }
                return <KnowledgeBase onBack={handleBackToDashboard} />;
            default:
                return <Dashboard
                    onStartUpdate={() => navigateTo('updater')}
                    onStartChecklist={() => navigateTo('checklist')}
                    showOnboardingWalkthrough={showOnboardingWalkthrough}
                    onCloseWalkthrough={handleCloseWalkthrough}
                    onGoToProfileSetup={handleGoToProfileSetup}
                    onSelectDocument={handleSelectDocument}
                />;
        }
    }

    const renderPage = () => {
        if (isLoading) {
            return <FullPageLoader />;
        }

        if (user && isAdmin) {
            return (
                <div className="min-h-screen bg-gray-100 text-secondary flex flex-col">
                    <AuthHeader isAdminHeader={true} />
                    <main className="container mx-auto px-6 py-8 flex-grow">
                        <Suspense fallback={<FullPageLoader />}>
                            <AdminDashboard
                                paginatedUsers={paginatedUsers}
                                onNextUsers={handleNextUsers}
                                onPrevUsers={handlePrevUsers}
                                isFetchingUsers={isFetchingUsers}
                                paginatedDocuments={paginatedDocuments}
                                onNextDocs={handleNextDocs}
                                onPrevDocs={handlePrevDocs}
                                isFetchingDocs={isFetchingDocs}
                                transactionsForUserPage={transactionsForUserPage}
                                paginatedLogs={paginatedLogs}
                                onNextLogs={handleNextLogs}
                                onPrevLogs={handlePrevLogs}
                                isFetchingLogs={isFetchingLogs}
                                adminNotifications={adminNotifications}
                                coupons={coupons}
                                adminActions={adminActions}
                            />
                        </Suspense>
                    </main>
                    <AppFooter />
                </div>
            );
        }

        if (unverifiedUser) {
            return <VerifyEmailPage user={unverifiedUser} />;
        }

        if (!user) {
            if (authPage === 'email-sent' && authEmail && authFlow) {
                return <EmailSentPage email={authEmail} flowType={authFlow} />;
            }

            if (authPage === 'login') {
                return <Login />;
            }

            return (
                <Suspense fallback={<FullPageLoader />}>
                    <PlanSelectionPage
                        onStartAuthFlow={handleStartAuthFlow}
                        onShowLogin={() => setAuthPage('login')}
                        onShowPrivacyPolicy={() => showLegalModal('Privacy Policy', PRIVACY_POLICY_CONTENT)}
                        onShowTerms={() => showLegalModal('Terms of Use', TERMS_OF_USE_CONTENT)}
                    />
                </Suspense>
            );
        }

        if (user.plan === 'pro' && !isSubscribed) {
            return (
                <Suspense fallback={<FullPageLoader />}>
                    <SubscriptionPage
                        onSuccess={handleSubscriptionSuccess}
                        onCancel={handleLogout}
                    />
                </Suspense>
            );
        }

        if (user && needsOnboarding && !onboardingSkipped) {
            return <InitialProfileSetup onProfileSubmit={handleInitialProfileSubmit} userEmail={user.email} userName={user.name} onSkip={handleSkipOnboarding} />;
        }

        if (user) {
            return (
                <div className="min-h-screen bg-light text-secondary flex flex-col">
                    <AuthHeader />
                    <main className="container mx-auto px-6 py-8 flex-grow">
                        <Suspense fallback={<FullPageLoader />}>
                            {renderDashboardContent()}
                        </Suspense>
                    </main>
                    <AppFooter />
                </div>
            );
        }

        return <FullPageLoader />;
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            {renderPage()}
            {legalModalContent && (
                <LegalModal
                    isOpen={!!legalModalContent}
                    onClose={legalModalContent.onClose}
                    title={legalModalContent.title}
                    content={legalModalContent.content}
                />
            )}
            {confirmation && (
                <ConfirmationModal
                    isOpen={!!confirmation}
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirm={confirmation.onConfirm}
                    onCancel={hideConfirmationModal}
                    confirmText={confirmation.confirmText}
                    cancelText={confirmation.cancelText}
                />
            )}
        </>
    );
};

export default AppContent;
