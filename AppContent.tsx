import { useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import FullPageLoader from './components/FullPageLoader';
import Login from './components/Login';
import EmailSentPage from './components/EmailSentPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import Toast from './components/Toast';
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
import { emailService } from './services/emailService';
import { logMarketingEvent } from './services/dbService';

export type AuthPage = 'landing' | 'login' | 'email-sent' | 'verify-email';
export type AuthFlow = 'signup' | 'login' | 'payg_signup';

// Lazy-loaded components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ConsultantClientSelector = lazy(() => import('./components/ConsultantClientSelector'));
const GeneratorPage = lazy(() => import('./components/GeneratorPage'));
const PolicyUpdater = lazy(() => import('./components/PolicyUpdater'));
const ComplianceChecklist = lazy(() => import('./components/ComplianceChecklist'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const PlanSelectionPage = lazy(() => import('./components/PlanSelectionPage'));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage'));
const PaygPaymentPage = lazy(() => import('./components/PaygPaymentPage'));
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'));
const PaymentSuccessPage = lazy(() => import('./components/PaymentSuccessPage'));
const TransactionsPage = lazy(() => import('./components/TransactionsPage'));
const PolicyAuditor = lazy(() => import('./components/PolicyAuditor'));
const WaitlistLanding = lazy(() => import('./components/WaitlistLanding'));
const ConsultantLockoutScreen = lazy(() => import('./components/ConsultantLockoutScreen'));
const ConsultationPage = lazy(() => import('./components/ConsultationPage'));

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

        // Consultant Props
        activeClient,
        selectClient,
        switchToConsultant,
        isAccountLocked,
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
        handleSearchUsers,
        handleRunRetentionCheck,
        handleWaitlistSignup,
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
        setIsPrePaid,
        isMobile
    } = useUIContext();

    // Watch for Yoco Redirects
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            console.log("Detected success redirect from Yoco...");
            navigateTo('payment-success' as any);
            setTimeout(() => {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            }, 500);
        } else if (params.get('payment') === 'cancel') {
            const lastView = window.location.hash.includes('upgrade') ? 'upgrade' : 'topup';
            navigateTo(lastView as any);
            setTimeout(() => {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            }, 500);
        }
    }, [navigateTo]);

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

    // Apply branding colors
    useEffect(() => {
        if (user?.isConsultant && user.branding) {
            const { primaryColor, accentColor } = user.branding;
            if (primaryColor) document.documentElement.style.setProperty('--primary-color', primaryColor);
            if (accentColor) document.documentElement.style.setProperty('--accent-color', accentColor);
        } else {
            document.documentElement.style.setProperty('--primary-color', '#188693');
            document.documentElement.style.setProperty('--secondary-color', '#143a67');
            document.documentElement.style.setProperty('--accent-color', '#f8b43b');
        }
    }, [user]);

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

        if (user.plan === 'pro') {
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
            setIsPrePaid(false);
            navigateTo('generator');
            return;
        }

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
                        if (user?.email) {
                            emailService.sendInsufficientCreditNudge(user.email, user.name || '', item.title);
                            logMarketingEvent(user.uid, 'insufficient_credit_nudge', {
                                document_title: item.title,
                                document_type: item.type,
                                current_balance: user.creditBalance
                            });
                        }
                        navigateTo('topup');
                    },
                    cancelText: "Cancel"
                });
                return;
            }

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
                        <p className="text-xs text-green-600 mt-3 font-semibold bg-green-50 p-2 rounded border border-green-100">
                            ✨ Includes free updates for 7 days.
                        </p>
                    </div>
                ),
                confirmText: "Confirm & Generate",
                onConfirm: async () => {
                    const success = await handleDeductCredit(price, `Generated: ${item.title}`);
                    if (success) {
                        hideConfirmationModal();
                        setSelectedItem(item);
                        setDocumentToView(null);
                        setIsPrePaid(true);
                        navigateTo('generator');
                    } else {
                        hideConfirmationModal();
                    }
                },
                cancelText: "Cancel"
            });
        }
    };

    const TopBar = () => {
        const isAdminHeader = isAdmin && (currentView === 'admin' || currentView === 'dashboard');
        const unreadCount = adminNotifications.filter(n => !n.isRead).length;

        return (
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/40 backdrop-blur-xl border-b border-secondary/5 py-4 px-8 sticky top-0 z-40 transition-all flex justify-between items-center"
            >
                <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/40 font-sans">
                        {currentView === 'dashboard' ? 'Overview' : currentView.replace('-', ' ')}
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    {isAdminHeader && (
                        <div className="flex items-center gap-4 border-r border-secondary/5 pr-6">
                            <span className="font-bold text-red-500 bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full text-[8px] tracking-widest uppercase font-sans">Admin Console</span>
                            <div className="relative" ref={notificationPanelRef}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setNotificationPanelOpen(prev => !prev)}
                                    className="relative p-2 text-secondary/40 hover:text-primary transition-all"
                                >
                                    <BellIcon className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm"
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </motion.button>
                                <AnimatePresence>
                                    {isNotificationPanelOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2"
                                        >
                                            <AdminNotificationPanel
                                                notifications={adminNotifications}
                                                onMarkAsRead={handleMarkNotificationRead}
                                                onMarkAllAsRead={handleMarkAllNotificationsRead}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {user?.plan === 'payg' && (
                            <div className="bg-emerald-500/5 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-500/10 text-[9px] font-black uppercase tracking-wider">
                                R{(Number(user.creditBalance) / 100).toFixed(2)}
                            </div>
                        )}
                        <button
                            onClick={() => navigateTo('profile')}
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-secondary/5 border border-secondary/5 flex items-center justify-center group-hover:border-primary transition-all overflow-hidden p-0.5 shadow-inner">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <UserIcon className="w-4 h-4 text-secondary/30 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-[10px] font-medium text-secondary truncate max-w-[100px] leading-tight font-serif italic">{user?.name || user?.email}</p>
                                <p className="text-[7px] font-black text-secondary/30 uppercase tracking-widest leading-none">Settings</p>
                            </div>
                        </button>
                    </div>
                </div>
            </motion.header>
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
            case 'auditor':
                return <PolicyAuditor
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
                    onRedoOnboarding={handleGoToProfileSetup}
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
                return <KnowledgeBase
                    onBack={handleBackToDashboard}
                    isPro={user?.plan === 'pro'}
                    onUpgrade={() => navigateTo('upgrade')}
                />;
            case 'transactions':
                return <TransactionsPage
                    onBack={() => navigateTo('profile')}
                />;
            case 'payment-success':
                return <PaymentSuccessPage
                    onVerified={() => {
                        handleBackToDashboard();
                        setToastMessage("Payment confirmed! Your account has been updated.");
                    }}
                    onBack={handleBackToDashboard}
                />;
            case 'consultation':
                return <ConsultationPage
                    onBack={handleBackToDashboard}
                />;
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
                <div className="min-h-screen bg-light flex">
                    <Sidebar activeView={currentView} />
                    <div className="flex-1 flex flex-col min-w-0">
                        <TopBar />
                        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
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
                                    onSearchUsers={handleSearchUsers}
                                    onRunRetention={handleRunRetentionCheck}
                                />
                            </Suspense>
                        </main>
                    </div>
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

            if (currentView === 'waitlist') {
                return (
                    <Suspense fallback={<FullPageLoader />}>
                        <WaitlistLanding
                            onSignup={(name, email) => handleWaitlistSignup(name, email)}
                            onShowLogin={() => setAuthPage('login')}
                        />
                    </Suspense>
                );
            }

            return (
                <Suspense fallback={<FullPageLoader />}>
                    <PlanSelectionPage
                        onStartAuthFlow={handleStartAuthFlow}
                        onShowLogin={() => setAuthPage('login')}
                        onShowPrivacyPolicy={() => showLegalModal('Privacy Policy', PRIVACY_POLICY_CONTENT)}
                        onShowTerms={() => showLegalModal('Terms of Use', TERMS_OF_USE_CONTENT)}
                        onShowWaitlist={() => navigateTo('waitlist')}
                    />
                </Suspense>
            );
        }

        if (isAccountLocked) {
            return (
                <Suspense fallback={<FullPageLoader />}>
                    <ConsultantLockoutScreen />
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
            return <InitialProfileSetup onProfileSubmit={handleInitialProfileSubmit} userEmail={user.email} userName={user.name} onSkip={handleSkipOnboarding} initialProfile={user.profile.companyName ? user.profile : undefined} />;
        }

        if (user) {
            // Consultant Selection Logic
            if (user.isConsultant && !activeClient) {
                return (
                    <div className="min-h-screen bg-light text-secondary flex flex-col items-center justify-center">
                        <Suspense fallback={<FullPageLoader />}>
                            <ConsultantClientSelector
                                clients={user.clients || []}
                                onSelect={selectClient}
                            />
                        </Suspense>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-light flex flex-col md:flex-row">
                    {/* Desktop Sidebar */}
                    {!isMobile && <Sidebar activeView={currentView} />}

                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Refined TopBar */}
                        <TopBar />

                        <main className={`flex-1 p-6 md:p-12 overflow-y-auto ${isMobile ? 'pb-32' : ''}`}>
                            <Suspense fallback={<FullPageLoader />}>
                                {renderDashboardContent()}
                            </Suspense>
                        </main>
                    </div>

                    {/* Mobile Navigation Bar */}
                    {isMobile && <MobileNav activeView={currentView} />}
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
