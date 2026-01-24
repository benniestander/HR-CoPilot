import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { createUserProfile } from '../services/dbService';
import { emailService } from '../services/emailService';
import { useAuth } from '../hooks/useAuth';
import type { User, ClientProfile } from '../types';
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
  handleSignUp: (email: string, pass: string, data: any) => Promise<boolean>;
  handleStartAuthFlow: (flow: AuthFlow, email: string, details: any) => Promise<void>;

  needsOnboarding: boolean;
  onboardingSkipped: boolean;
  handleSkipOnboarding: () => void;
  handleGoToProfileSetup: () => void;
  isSubscribed: boolean;

  // Setters exposed for specific flows
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setNeedsOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  refetchProfile: () => Promise<void>;

  // Consultant Features
  selectClient: (client: ClientProfile) => Promise<void>;
  switchToConsultant: () => void;
  realConsultantUser: User | null;
  activeClient: ClientProfile | null;
  isAccountLocked: boolean;
  isConsultantPlatformFeeActive: boolean;
  payConsultantPlatformFee: () => Promise<void>;
  payClientAccessFee: (clientId: string) => Promise<void>;
  updateBranding: (branding: User['branding']) => Promise<void>;
  markConsultantWelcomeAsSeen: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding, refetchProfile } = useAuth();

  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authFlow, setAuthFlow] = useState<AuthFlow | undefined>(undefined);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);

  const [realConsultantUser, setRealConsultantUser] = useState<User | null>(null);
  const [activeClient, setActiveClient] = useState<ClientProfile | null>(null);

  // --- SANDBOX MODE BYPASS (Localhost only) ---
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    const isWaitlist = window.location.hash.includes('waitlist');
    if (isLocalhost && !user && !isLoading && !isWaitlist) {
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
        } as any,
        transactions: [
          {
            id: 'tx-1',
            date: new Date().toISOString(),
            amount: 74700,
            description: 'HR CoPilot Pro Membership (Yearly)',
          }
        ],
        isConsultant: true,
        consultantPlatformFeePaidUntil: new Date(Date.now() + 86400000).toISOString(), // Active for 1 day
        clients: [
          { id: 'client-1', name: 'Alice', email: 'alice@client.com', companyName: 'Alice Corp', paidUntil: new Date(Date.now() + 86400000).toISOString() },
          { id: 'client-2', name: 'Bob', email: 'bob@client.com', companyName: 'Bob Inc', paidUntil: new Date(Date.now() - 86400000).toISOString() } // Expired
        ]
      };
      setUser(mockUser);
    }
  }, [isLocalhost, user, isLoading, setUser]);

  // Update Mock Provider Price if exists
  useEffect(() => {
    if (user?.uid === 'sandbox-user-123' && user.transactions[0].amount === 74700) {
      setUser(prev => prev ? {
        ...prev,
        transactions: [{ ...prev.transactions[0], amount: 149900 }]
      } : null);
    }
  }, [user?.uid, setUser]);

  const selectClient = async (client: ClientProfile) => {
    // Store the original consultant user if not already stored
    if (!realConsultantUser) {
      setRealConsultantUser(user);
    }

    if (client.paidUntil && new Date(client.paidUntil) < new Date()) {
      throw new Error("Access to this client has expired. Please renew access.");
    }

    setActiveClient(client);

    try {
      const { getUserProfile } = await import('../services/dbService');
      const clientUser = await getUserProfile(client.id);

      if (clientUser) {
        // Impersonate
        setUser({
          ...clientUser,
          isConsultant: true,
          clients: user?.clients || realConsultantUser?.clients
        });
      } else {
        // Fallback
        setUser({
          uid: client.id,
          email: client.email,
          name: client.name,
          plan: 'pro',
          creditBalance: 0,
          transactions: [],
          createdAt: new Date().toISOString(),
          profile: {
            companyName: client.companyName,
            industry: '',
          } as any,
          isConsultant: true,
          clients: user?.clients || realConsultantUser?.clients
        });
      }
    } catch (error) {
      console.error("Failed to switch client context", error);
      setUser({
        uid: client.id,
        email: client.email,
        name: client.name,
        plan: 'pro',
        creditBalance: 0,
        transactions: [],
        createdAt: new Date().toISOString(),
        profile: {
          companyName: client.companyName,
          industry: '',
        } as any,
        isConsultant: true,
        clients: user?.clients || realConsultantUser?.clients
      });
    }
  };

  const switchToConsultant = () => {
    if (realConsultantUser) {
      setUser(realConsultantUser);
      setRealConsultantUser(null);
      setActiveClient(null);
    }
  };

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
    setRealConsultantUser(null);
    setActiveClient(null);
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

  const handleSignUp = async (email: string, pass: string, data: any) => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    const { data: authData, error } = await (supabase.auth as any).signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: data.name,
          plan: data.plan || 'payg'
        }
      }
    });

    if (error) throw error;

    if (authData.user) {
      try {
        await createUserProfile(
          authData.user.id,
          email,
          data.plan || 'payg',
          data.name,
          data.contactNumber
        );

        await emailService.sendWelcomeEmail(email, data.name || 'User');

      } catch (profileError) {
        console.error("Profile/Email warning:", profileError);
      }
    }

    return !!authData.user;
  };

  const handleStartAuthFlow = async (flow: AuthFlow, email: string, details: any) => {
    setAuthFlow(flow);
    setAuthEmail(email);

    try {
      await handleSignUp(email, details.password, {
        name: details.name,
        contactNumber: details.contactNumber,
        plan: flow === 'signup' ? 'pro' : 'payg'
      });

      setAuthPage('email-sent');

      window.localStorage.setItem('authFlow', flow);
      if (details) {
        window.localStorage.setItem('authDetails', JSON.stringify(details));
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const handleSkipOnboarding = () => {
    setOnboardingSkipped(true);
    setNeedsOnboarding(false);
  };

  const handleGoToProfileSetup = () => {
    setNeedsOnboarding(true);
    setOnboardingSkipped(false);
    window.location.hash = '#/dashboard';
  };

  const isSubscribed = useMemo(() => {
    return user?.plan === 'pro' || user?.plan === 'consultant';
  }, [user]);

  const isConsultantPlatformFeeActive = useMemo(() => {
    if (!user || user.plan !== 'consultant') return true;
    if (!user.consultantPlatformFeePaidUntil) return false;
    return new Date(user.consultantPlatformFeePaidUntil) > new Date();
  }, [user]);

  const isAccountLocked = useMemo(() => {
    if (user?.isAdmin) return false;
    if (user?.plan === 'consultant' && !isConsultantPlatformFeeActive) return true;
    return false;
  }, [user, isConsultantPlatformFeeActive]);

  const payConsultantPlatformFee = async () => {
    if (!user) return;
    const FEE = 50000; // R500
    if (user.creditBalance < FEE) throw new Error("Insufficient balance. R500 required.");

    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + 1);

    const { updateConsultantPlatformFee } = await import('../services/dbService');
    await updateConsultantPlatformFee(user.uid, newExpiry.toISOString(), FEE);
    await refetchProfile();
  };

  const payClientAccessFee = async (clientId: string) => {
    if (!user || !user.clients) return;
    const FEE = 75000; // R750/year per client

    const isPostPaid = user.plan === 'agency'; // Agency Tier uses Ledger (Bill later)

    // Pre-Paid Check (Consultant/Pro)
    if (!isPostPaid && user.creditBalance < FEE) {
      throw new Error("Insufficient balance. R750 required.");
    }

    const newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    const updatedClients = user.clients.map(c =>
      c.id === clientId ? { ...c, paidUntil: newExpiry.toISOString() } : c
    );

    const { updateConsultantClients } = await import('../services/dbService');

    // Pass 'useLedger = true' if isPostPaid
    await updateConsultantClients(user.uid, updatedClients, FEE, `Annual access for ${clientId}`, isPostPaid);
    await refetchProfile();
  };

  const updateBranding = async (branding: User['branding']) => {
    if (!user) return;
    const { supabase } = await import('../services/supabase');
    const { error } = await supabase.from('profiles').update({ branding }).eq('id', user.uid);
    if (error) throw error;
    await refetchProfile();
  };

  const markConsultantWelcomeAsSeen = async () => {
    if (!user) return;
    const { supabase } = await import('../services/supabase');
    const { error } = await supabase.from('profiles').update({ has_seen_consultant_welcome: true }).eq('id', user.uid);
    if (error) throw error;
    await refetchProfile();
  };

  const isProfileHydrating = !!user &&
    !user.isAdmin && // Admins don't need company profile details to function
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
    handleSignUp,
    handleStartAuthFlow,
    needsOnboarding,
    setNeedsOnboarding,
    onboardingSkipped,
    handleSkipOnboarding,
    handleGoToProfileSetup,
    isSubscribed,
    refetchProfile,
    selectClient,
    switchToConsultant,
    realConsultantUser,
    activeClient,
    isAccountLocked,
    isConsultantPlatformFeeActive,
    payConsultantPlatformFee,
    payClientAccessFee,
    updateBranding,
    markConsultantWelcomeAsSeen,
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