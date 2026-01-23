
import { useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import FullPageLoader from './components/FullPageLoader';
import Login from './components/Login';
import EmailSentPage from './components/EmailSentPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import Toast from './components/Toast';
import LegalModal from './components/LegalModal';
import AdminNotificationPanel from './components/AdminNotificationPanel';
import InitialProfileSetup from './components/InitialProfileSetup';
import ConfirmationModal from './components/ConfirmationModal';
import SupportWidget from './components/SupportWidget';
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
const LandingPageV2 = lazy(() => import('./components/LandingPageV2'));

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
        setIsPrePaid
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

    const AuthHeader = ({ isAdminHeader = false }: { isAdminHeader?: boolean }) => {
        const unreadCount = adminNotifications.filter(n => !n.isRead).length;

        // CONSULTANT HEADER
        if (user?.isConsultant && !isAdminHeader) {
            return (
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 py-3"
                >
                    <div className="container mx-auto flex justify-between items-center px-6">
                        <div className="flex items-center space-x-4">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                src={user.branding?.logoUrl || "https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"}
                                alt="HR CoPilot Logo"
                                className="h-10 cursor-pointer object-contain"
                                onClick={handleStartOver}
                            />
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-5">
                            {activeClient ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={switchToConsultant}
                                    className="hidden sm:flex items-center text-xs font-bold text-gray-500 hover:text-primary transition-all bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
                                >
                                    <span className="mr-2 text-gray-400">CLIENT:</span>
                                    {activeClient.companyName}
                                    <span className="ml-2 text-[10px] bg-gray-200 px-1 rounded text-gray-500">SWITCH</span>
                                </motion.button>
                            ) : (
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-widest">
                                    Consultant Mode
                                </span>
                            )}

                            <div className="h-6 w-px bg-gray-100 hidden sm:block"></div>

                            <motion.button
                                whileHover={{ y: -2 }}
                                onClick={handleShowProfile}
                                className="flex items-center group"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center p-0.5 group-hover:border-primary transition-colors overflow-hidden">
                                    <UserIcon className="w-4 h-4 text-indigo-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="ml-2 hidden lg:block text-left">
                                    <p className="text-xs font-bold text-secondary truncate max-w-[120px]">{user?.name}</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-tighter">Consultant</p>
                                </div>
                            </motion.button>

                            <button onClick={handleLogout} className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors">
                                Exit
                            </button>
                        </div>
                    </div>
                </motion.header>
            );
        }

        return (
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 py-3"
            >
                <div className="container mx-auto flex justify-between items-center px-6">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        src={(user?.isConsultant && user.branding?.logoUrl) ? user.branding.logoUrl : "https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"}
                        alt="HR CoPilot Logo"
                        className="h-10 cursor-pointer object-contain"
                        onClick={handleStartOver}
                    />
                    {isAdminHeader ? (
                        <div className="flex items-center space-x-6">
                            <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs tracking-widest uppercase">Admin Panel</span>
                            <div className="relative" ref={notificationPanelRef}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setNotificationPanelOpen(prev => !prev)}
                                    className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full transition-all"
                                >
                                    <BellIcon className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
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
                            <button onClick={handleLogout} className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 sm:space-x-5">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigateTo('knowledge-base')}
                                className="flex items-center text-xs font-bold text-gray-500 hover:text-primary transition-all bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                                title="Help & Guides"
                            >
                                <BookIcon className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline uppercase tracking-widest">Guide</span>
                            </motion.button>

                            <div className="h-6 w-px bg-gray-100 hidden sm:block"></div>

                            {user?.plan === 'payg' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-100 hidden md:block"
                                >
                                    Balance: R{(Number(user.creditBalance) / 100).toFixed(2)}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ y: -2 }}
                                onClick={handleShowProfile}
                                className="flex items-center group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-0.5 group-hover:border-primary transition-colors overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <div className="ml-2 hidden lg:block text-left">
                                    <p className="text-xs font-bold text-secondary truncate max-w-[120px]">{user?.name || user?.email}</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-tighter">{user?.plan === 'pro' ? 'Pro Member' : 'Pay-As-You-Go'}</p>
                                </div>
                            </motion.button>

                            <button onClick={handleLogout} className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors">
                                Exit
                            </button>
                        </div>
                    )}
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
                                onSearchUsers={handleSearchUsers}
                                onRunRetention={handleRunRetentionCheck}
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
                    <LandingPageV2 />
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
                    <div className="min-h-screen bg-light text-secondary flex flex-col">
                        <AuthHeader />
                        <main className="container mx-auto px-6 py-8 flex-grow flex items-center justify-center">
                            <Suspense fallback={<FullPageLoader />}>
                                <ConsultantClientSelector
                                    clients={user.clients || []}
                                    onSelect={selectClient}
                                />
                            </Suspense>
                        </main>
                        <AppFooter />
                    </div>
                );
            }

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
            <SupportWidget />
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
