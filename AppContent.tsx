
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
import { UserIcon, BellIcon } from './components/Icons';
import { useAuthContext } from './contexts/AuthContext';
import { useDataContext } from './contexts/DataContext';
import { useUIContext } from './contexts/UIContext';
import { useModalContext } from './contexts/ModalContext';
import { PRIVACY_POLICY_CONTENT, TERMS_OF_USE_CONTENT } from './legalContent';

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
        handleStartGoogleAuthFlow
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
        setShowOnboardingWalkthrough
    } = useUIContext();

    const { legalModalContent, showLegalModal, confirmation, hideConfirmationModal } = useModalContext();

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

    const AuthHeader = ({ isAdminHeader = false }: { isAdminHeader?: boolean }) => {
        const unreadCount = adminNotifications.filter(n => !n.isRead).length;

        return (
            <header className="bg-white shadow-sm py-4">
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
                            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                            {user?.plan === 'payg' && (
                                <div className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
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
                />;
            case 'checklist':
                if (!user) { handleBackToDashboard(); return null; }
                return <ComplianceChecklist
                    userProfile={user.profile}
                    onBack={handleBackToDashboard}
                />;
            case 'profile':
                if (!user) { handleBackToDashboard(); return null; }
                return <ProfilePage
                    onBack={handleBackToDashboard}
                    onUpgrade={() => navigateTo('upgrade')}
                    onGoToTopUp={() => navigateTo('topup')}
                />;
            case 'upgrade':
                if (!user) { handleBackToDashboard(); return null; }
                return <SubscriptionPage
                    onSuccess={handleSubscriptionSuccess}
                    onCancel={handleBackToDashboard}
                />;
            case 'topup':
                if (!user || user.plan !== 'payg') { handleBackToDashboard(); return null; }
                return <PaygPaymentPage
                    onTopUpSuccess={handleTopUpSuccess}
                    onCancel={handleBackToDashboard}
                    onUpgrade={() => navigateTo('upgrade')}
                />;
            default:
                return <Dashboard
                    onStartUpdate={() => navigateTo('updater')}
                    onStartChecklist={() => navigateTo('checklist')}
                    showOnboardingWalkthrough={showOnboardingWalkthrough}
                    onCloseWalkthrough={handleCloseWalkthrough}
                    onGoToProfileSetup={handleGoToProfileSetup}
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
                        onStartGoogleAuthFlow={handleStartGoogleAuthFlow}
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
