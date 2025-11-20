
import { useState, useEffect } from 'react';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, createUserProfile } from '../services/firestoreService';
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
    
    const [unverifiedUser, setUnverifiedUser] = useState<FirebaseUser | null>(null);
    
    const [isAdmin, setIsAdmin] = useState(() => {
        try {
             const cached = window.localStorage.getItem(USER_CACHE_KEY);
             return cached ? !!JSON.parse(cached).isAdmin : false;
        } catch {
            return false;
        }
    });

    // If we have a cached user, we are not "loading" in the sense of blocking the UI
    const [isLoading, setIsLoading] = useState(!user); 
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (!firebaseUser) {
                setUser(null);
                setUnverifiedUser(null);
                setIsAdmin(false);
                setNeedsOnboarding(false);
                setIsLoading(false);
                window.localStorage.removeItem(USER_CACHE_KEY);
                return;
            }

            // Only set loading if we don't already have a user to show (prevents flash)
            if (!user) setIsLoading(true);

            try {
                if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
                    setUnverifiedUser(firebaseUser);
                    setUser(null);
                    window.localStorage.removeItem(USER_CACHE_KEY);
                    setIsLoading(false);
                    return;
                }

                setUnverifiedUser(null);
                let appUser: User | null = null;

                try {
                    // Fetch fresh data
                    appUser = await getUserProfile(firebaseUser.uid);
                    if (appUser) {
                         // Update state and cache with fresh data
                         setUser(appUser);
                         setIsAdmin(!!appUser.isAdmin);
                         window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(appUser));
                    }
                } catch (e) {
                    console.error("Error fetching user profile:", e);
                }
                
                // Fallback to cache if fetch failed but we have data (handled by initial state, but checking mismatch)
                if (!appUser && user && user.uid === firebaseUser.uid) {
                    appUser = user;
                }

                if (!appUser) {
                    const flow = window.localStorage.getItem('authFlow') as AuthFlow | null;
                    const detailsJson = window.localStorage.getItem('authDetails');
                    const details = detailsJson ? JSON.parse(detailsJson) : null;
                    
                    let plan: 'pro' | 'payg' = 'payg';
                    if (flow === 'signup') plan = 'pro';

                    try {
                        appUser = await createUserProfile(firebaseUser.uid, firebaseUser.email!, plan, details?.name || firebaseUser.displayName || undefined, details?.contactNumber);
                        setUser(appUser);
                        setIsAdmin(!!appUser.isAdmin);
                        window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(appUser));
                    } catch (e) {
                        console.error("Error creating user profile:", e);
                        // CRITICAL FALLBACK: Create a temporary in-memory user 
                        appUser = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            name: firebaseUser.displayName || details?.name || '',
                            contactNumber: details?.contactNumber || '',
                            plan: plan,
                            creditBalance: 0,
                            transactions: [],
                            profile: { companyName: '', industry: '' },
                            createdAt: new Date().toISOString(),
                            isAdmin: false
                        };
                        setUser(appUser);
                    }

                    window.localStorage.removeItem('authFlow');
                    window.localStorage.removeItem('authDetails');
                }

                if (appUser) {
                    if (!appUser.profile.companyName || !appUser.profile.industry) {
                        setNeedsOnboarding(true);
                    } else {
                        setNeedsOnboarding(false);
                    }
                }

            } catch (error) {
                console.error("Auth state change error:", error);
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding };
};
