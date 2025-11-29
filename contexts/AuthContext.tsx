
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import type { AuthPage, AuthFlow } from '../AppContent';

interface AuthContextType {
  user: User | null;
  unverifiedUser: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  authPage: AuthPage;
  setAuthPage: (page: AuthPage) => void;
  authEmail?: string;
  authFlow?: AuthFlow;
  
  handleLogin: (email: string, pass: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleStartAuthFlow: (flow: AuthFlow, email: string, details: any) => void;
  
  needsOnboarding: boolean;
  onboardingSkipped: boolean;
  handleSkipOnboarding: () => void;
  handleGoToProfileSetup: () => void;
  isSubscribed: boolean;
  
  // Setters exposed for specific flows
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setNeedsOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding } = useAuth();
  
  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authFlow, setAuthFlow] = useState<AuthFlow | undefined>(undefined);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);

  const handleLogin = async (email: string, pass: string) => {
    const { error } = await (supabase.auth as any).signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  };

  const handleLogout = async () => {
    await (supabase.auth as any).signOut();
    setUser(null);
    setAuthPage('login');
    // Clear local storage or state if needed
    window.location.hash = '';
  };

  const handleForgotPassword = async (email: string) => {
    const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`, // Ensure this route exists or is handled
    });
    if (error) throw error;
  };

  const handleStartAuthFlow = async (flow: AuthFlow, email: string, details: any) => {
    setAuthEmail(email);
    setAuthFlow(flow);
    
    // Store temp details for profile creation after signup
    window.localStorage.setItem('authFlow', flow);
    window.localStorage.setItem('authDetails', JSON.stringify(details));

    const { error } = await (supabase.auth as any).signUp({
      email,
      password: details.password,
      options: {
        data: {
          full_name: details.name,
          contact_number: details.contactNumber,
        }
      }
    });

    if (error) throw error;
    setAuthPage('email-sent');
  };

  const handleSkipOnboarding = () => {
    setOnboardingSkipped(true);
  };

  const handleGoToProfileSetup = () => {
    setOnboardingSkipped(false);
    setNeedsOnboarding(true);
  };

  // Calculate subscription status
  const isSubscribed = useMemo(() => {
    if (!user) return false;
    
    // Strict check: User must be on 'pro' plan AND have a valid transaction in the last year
    if (user.plan === 'pro') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        // If no transactions exist, they cannot be validly subscribed (unless manually overridden in DB without log, which is discouraged)
        if (!user.transactions || user.transactions.length === 0) {
            return false;
        }

        // Find a qualifying transaction
        const validTransaction = user.transactions.find(tx => {
            const desc = tx.description ? tx.description.toLowerCase() : '';
            // Robust keyword matching for any subscription-like transaction
            const isSubTx = /subscription|pro plan|membership/i.test(desc);
            
            const txDate = new Date(tx.date);
            // Check if transaction date is valid and occurred AFTER one year ago
            const isValidDate = !isNaN(txDate.getTime()) && txDate > oneYearAgo;

            return isSubTx && isValidDate;
        });

        return !!validTransaction;
    }
    return false;
  }, [user]);

  const value = {
    user,
    setUser,
    unverifiedUser,
    isAdmin,
    isLoading,
    authPage,
    setAuthPage,
    authEmail,
    authFlow,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleStartAuthFlow,
    needsOnboarding,
    setNeedsOnboarding,
    onboardingSkipped,
    handleSkipOnboarding,
    handleGoToProfileSetup,
    isSubscribed,
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
