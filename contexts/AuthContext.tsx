
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import type { AuthPage, AuthFlow } from '../AppContent';
import { createAdminNotification } from '../services/dbService';

interface AuthContextType {
    user: User | null;
    unverifiedUser: any | null;
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
    
    const [isSubscribed, setIsSubscribed] = useState(false);
    React.useEffect(() => {
        if (user) {
            setIsSubscribed(user.plan === 'pro');
        } else {
            setIsSubscribed(false);
        }
    }, [user]);

    const handleStartAuthFlow = async (flow: AuthFlow, email: string, details: { password: string; name?: string; contactNumber?: string }) => {
        const { password, name, contactNumber } = details;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        contact_number: contactNumber
                    }
                }
            });

            if (error) throw error;

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
        try {
            window.localStorage.setItem('authFlow', flow);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            throw error;
        }
    };
    
    const handleLogin = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error: any) {
            throw error;
        }
    };

    const handleForgotPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
             redirectTo: window.location.origin + '/#reset-password', // You might need to handle this route
        });
        
        if (error) throw error;
        
        await createAdminNotification({
            type: 'password_reset_request',
            message: `User with email ${email} requested a password reset.`,
        });
    };

    const handleLogout = () => {
        supabase.auth.signOut().then(() => {
            window.localStorage.removeItem('hr_copilot_user_profile');
        });
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
