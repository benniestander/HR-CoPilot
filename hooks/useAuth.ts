
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { getUserProfile, createUserProfile } from '../services/dbService';
import type { User } from '../types';
import type { AuthFlow } from '../AppContent';

const USER_CACHE_KEY = 'hr_copilot_user_profile';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const cached = window.localStorage.getItem(USER_CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error("Failed to parse user cache", error);
            return null;
        }
    });
    
    const [unverifiedUser, setUnverifiedUser] = useState<any | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    useEffect(() => {
        // Initial Session Check
        (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
            handleSessionChange(session);
        });

        // Listen for changes
        const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
            handleSessionChange(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSessionChange = async (session: any) => {
        if (!session?.user) {
            setUser(null);
            setUnverifiedUser(null);
            setIsAdmin(false);
            setNeedsOnboarding(false);
            setIsLoading(false);
            window.localStorage.removeItem(USER_CACHE_KEY);
            return;
        }

        // NOTE: Supabase handles verification via email redirects usually, 
        // but we can check `email_confirmed_at` if needed.
        // If you strictly require verification before login, you configure that in Supabase Dashboard.

        // Only set loading if we don't have a user yet
        if (!user) setIsLoading(true);

        try {
            const sbUser = session.user;
            let appUser: User | null = null;

            try {
                appUser = await getUserProfile(sbUser.id);
            } catch (e) {
                console.error("Error fetching user profile:", e);
            }

            if (appUser) {
                setUser(appUser);
                setIsAdmin(!!appUser.isAdmin);
                window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(appUser));
                
                if (!appUser.profile.companyName) setNeedsOnboarding(true);
                else setNeedsOnboarding(false);

            } else {
                // New User logic - Profile doesn't exist yet in 'profiles' table
                const flow = window.localStorage.getItem('authFlow') as AuthFlow | null;
                const detailsJson = window.localStorage.getItem('authDetails');
                const details = detailsJson ? JSON.parse(detailsJson) : null;
                
                let plan: 'pro' | 'payg' = 'payg';
                if (flow === 'signup') plan = 'pro';

                try {
                    appUser = await createUserProfile(
                        sbUser.id, 
                        sbUser.email!, 
                        plan, 
                        details?.name || sbUser.user_metadata?.full_name, 
                        details?.contactNumber
                    );
                    
                    setUser(appUser);
                    setIsAdmin(false);
                    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(appUser));
                    setNeedsOnboarding(true); // New profiles usually need onboarding
                    
                    // Clean up temp storage
                    window.localStorage.removeItem('authFlow');
                    window.localStorage.removeItem('authDetails');

                } catch (e) {
                    console.error("Error creating profile:", e);
                }
            }

        } catch (error) {
            console.error("Auth Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding };
};
