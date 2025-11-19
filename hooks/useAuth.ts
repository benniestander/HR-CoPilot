import { useState, useEffect } from 'react';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, createUserProfile } from '../services/firestoreService';
import type { User } from '../types';
import type { AuthFlow } from '../AppContent';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [unverifiedUser, setUnverifiedUser] = useState<FirebaseUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            setIsLoading(true);
            try {
                if (firebaseUser) {
                    if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
                        setUnverifiedUser(firebaseUser);
                        setUser(null);
                        return;
                    }

                    setUnverifiedUser(null);
                    let appUser = null;
                    try {
                        appUser = await getUserProfile(firebaseUser.uid);
                    } catch (e) {
                        console.error("Error fetching user profile:", e);
                    }
                    
                    if (!appUser) {
                        const flow = window.localStorage.getItem('authFlow') as AuthFlow | null;
                        const detailsJson = window.localStorage.getItem('authDetails');
                        const details = detailsJson ? JSON.parse(detailsJson) : null;
                        
                        let plan: 'pro' | 'payg' = 'payg';
                        if (flow === 'signup') plan = 'pro';

                        try {
                            appUser = await createUserProfile(firebaseUser.uid, firebaseUser.email!, plan, details?.name || firebaseUser.displayName || undefined, details?.contactNumber);
                        } catch (e) {
                            console.error("Error creating user profile:", e);
                        }

                        window.localStorage.removeItem('authFlow');
                        window.localStorage.removeItem('authDetails');
                    }

                    if (appUser && (!appUser.profile.companyName || !appUser.profile.industry)) {
                        setNeedsOnboarding(true);
                    } else {
                        setNeedsOnboarding(false);
                    }

                    if (appUser) {
                        setUser(appUser);
                        setIsAdmin(!!appUser.isAdmin);
                    } else {
                        // If profile creation failed, we still have a firebaseUser but no appUser.
                        // The UI should probably handle this gracefully, but for now we just stop loading.
                    }

                } else {
                    setUser(null);
                    setUnverifiedUser(null);
                    setIsAdmin(false);
                    setNeedsOnboarding(false);
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