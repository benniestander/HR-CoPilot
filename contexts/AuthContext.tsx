import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
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
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding, refetchProfile } = useAuth();

  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authFlow, setAuthFlow] = useState<AuthFlow | undefined>(undefined);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);

  // --- SANDBOX MODE BYPASS (Localhost only) ---
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isLocalhost && !user && !isLoading) {
      console.log("🛠️ SANDBOX MODE: Injecting Mock Pro User...");
      const mockUser: User = {
        uid: 'sandbox-user-123',
        email: 'ceo@atlastech.co.za',
        name: 'John Galt',
        plan: 'pro',
        creditBalance: 50000, // R500.00
        createdAt: new Date().toISOString(),
        profile: {
          companyName: 'Atlas Tech Corp',
          industry: 'Technology',
          companySize: '50-100',
          complianceScore: 85,
        } as any,
        transactions: [
          {
            id: 'tx-1',
            date: new Date().toISOString(),
            amount: 74700,
            description: 'HR CoPilot Pro Membership (Yearly)',
          }
        ]
      };
      setUser(mockUser);
    }
  }, [isLocalhost, user, isLoading, setUser]);

  const handleLogin = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Configuration Error: Database connection details are missing.");
    }
    const { error } = await (supabase.auth as any).signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await (supabase.auth as any).signOut();
    }
    setUser(null);
    setAuthPage('login');
    // Clear local storage or state if needed
    window.location.hash = '';
  };

  const handleForgotPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Configuration Error: Database connection details are missing.");
    }
    const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    });
    if (error) throw error;
  };

  const handleStartAuthFlow = (flow: AuthFlow, email: string, details: any) => {
    setAuthFlow(flow);
    setAuthEmail(email);
    setAuthPage('email-sent');

    // Store details temporarily for profile creation after email verification
    window.localStorage.setItem('authFlow', flow);
    if (details) {
      window.localStorage.setItem('authDetails', JSON.stringify(details));
    }
  };

  const handleSkipOnboarding = () => {
    setOnboardingSkipped(true);
    setNeedsOnboarding(false);
  };

  const handleGoToProfileSetup = () => {
    setNeedsOnboarding(true);
    setOnboardingSkipped(false);
    window.location.hash = '#/dashboard'; // Ensure we are on dashboard to see the setup
  };

  const isSubscribed = useMemo(() => {
    return user?.plan === 'pro';
  }, [user]);

  // HIGH-6 FIX: Ensure global loading state waits for profile hydration.
  const isProfileHydrating = !!user &&
    user.profile &&
    Object.keys(user.profile).length <= 1 &&
    !user.profile.companyName &&
    !needsOnboarding;

  const combinedLoading = isLoading || isProfileHydrating;

  const value = {
    user,
    setUser,
    unverifiedUser,
    isAdmin,
    isLoading: combinedLoading,
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
    refetchProfile,
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