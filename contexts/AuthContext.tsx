
import React, { createContext, useContext, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import type { AuthPage, AuthFlow } from '../AppContent';
import { createAdminNotification } from '../services/firestoreService';

interface AuthContextType {
    user: User | null;
    unverifiedUser: import('firebase/auth').User | null;
    isAdmin: boolean;
    isLoading: boolean;
    isSubscribed: boolean;
    authPage: AuthPage;
    authEmail: string | null;
    authFlow: AuthFlow | null;
    needsOnboarding: boolean;
    onboardingSkipped: boolean;
    showOnboardingWalkthrough: boolean;
    handleStartAuthFlow: (flow: 'signup' | 'payg_signup', email: string, details: { password: string; name?: string; contactNumber?: string }) => Promise<void>;
    handleStartGoogleAuthFlow: (flow: 'signup' | 'payg_signup') => Promise<void>;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleForgotPassword: (email: string) => Promise<void>;
    handleLogout: () => void;
    setAuthPage: (page: AuthPage) => void;
    handleSkipOnboarding: () => void;
    handleGoToProfileSetup: () => void;
    setShowOnboardingWalkthrough: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setNeedsOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding } = useAuth();
    const [authPage, setAuthPage] = useState<AuthPage>('landing');
    const [authEmail, setAuthEmail] = useState<string | null>(null);
    const [authFlow, setAuthFlow] = useState<AuthFlow | null>(null);
    const [onboardingSkipped, setOnboardingSkipped] = useState(false);
    const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);
    
    // This state is derived from user, but we manage it here to pass down
    const [isSubscribed, setIsSubscribed] = useState(false);
    React.useEffect(() => {
        if (user) {
            // A 'pro' user is considered subscribed if their profile exists with the pro plan.
            // The payment status would be a more robust check in a real app.
            setIsSubscribed(user.plan === 'pro');
        } else {
            setIsSubscribed(false);
        }
    }, [user]);

    const handleStartAuthFlow = async (flow: AuthFlow, email: string, details: { password: string; name?: string; contactNumber?: string }) => {
        const { password, name, contactNumber } = details;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Attempt to send email verification, but don't block the flow if it fails (e.g. rate limiting)
            // The VerifyEmailPage has a manual resend button.
            try {
                await sendEmailVerification(userCredential.user);
            } catch (emailError) {
                console.warn("Failed to send initial verification email:", emailError);
            }

            await signOut(auth);
            window.localStorage.setItem('authFlow', flow);
            if (name || contactNumber) {
                window.localStorage.setItem('authDetails', JSON.stringify({ name, contactNumber }));
            }
            setAuthEmail(email);
            setAuthFlow(flow);
            setAuthPage('email-sent');
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    const handleStartGoogleAuthFlow = async (flow: AuthFlow) => {
        const provider = new GoogleAuthProvider();
        try {
            window.localStorage.setItem('authFlow', flow);
            // Use signInWithPopup for better compatibility and UX in this environment
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            // Rethrow so the UI can handle loading states
            throw error;
        }
    };
    
    const handleLogin = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw error;
        }
    };

    const handleForgotPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
        await createAdminNotification({
            type: 'password_reset_request',
            message: `User with email ${email} requested a password reset.`,
        });
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                window.localStorage.removeItem('hr_copilot_user_profile');
            })
            .catch((error) => console.error("Logout Error:", error));
    };
    
    const handleSkipOnboarding = () => {
        setOnboardingSkipped(true);
    };

    const handleGoToProfileSetup = () => {
        setOnboardingSkipped(false);
    };


    const value = {
        user,
        unverifiedUser,
        isAdmin,
        isLoading,
        isSubscribed,
        authPage,
        authEmail,
        authFlow,
        needsOnboarding,
        onboardingSkipped,
        showOnboardingWalkthrough,
        handleStartAuthFlow,
        handleStartGoogleAuthFlow,
        handleLogin,
        handleForgotPassword,
        handleLogout,
        setAuthPage,
        handleSkipOnboarding,
        handleGoToProfileSetup,
        setShowOnboardingWalkthrough,
        setUser,
        setNeedsOnboarding,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
