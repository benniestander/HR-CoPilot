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
            if (firebaseUser) {
                if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
                    setUnverifiedUser(firebaseUser);
                    setUser(null);
                    setAuthPage('verify-email');
                    setIsLoading(false);
                    return;
                }

                setUnverifiedUser(null);
                let appUser = await getUserProfile(firebaseUser.uid);
                
                if (!appUser) {
                    const flow = window.localStorage.getItem('authFlow') as AuthFlow | null;
                    const detailsJson = window.localStorage.getItem('authDetails');
                    const details = detailsJson ? JSON.parse(detailsJson) : null;
                    
                    let plan: 'pro' | 'payg' = 'payg';
                    if (flow === 'signup') plan = 'pro';

                    appUser = await createUserProfile(firebaseUser.uid, firebaseUser.email!, plan, details?.name || firebaseUser.displayName || undefined, details?.contactNumber);

                    window.localStorage.removeItem('authFlow');
                    window.localStorage.removeItem('authDetails');
                }

                if (appUser && (!appUser.profile.companyName || !appUser.profile.industry)) {
                    setNeedsOnboarding(true);
                } else {
                    setNeedsOnboarding(false);
                }

                setUser(appUser);
                setIsAdmin(!!appUser.isAdmin);
                setAuthPage('landing');

            } else {
                setUser(null);
                setUnverifiedUser(null);
                setIsAdmin(false);
                setNeedsOnboarding(false);
                setAuthPage('landing');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // A variable to set auth page, which is not part of the hook's returned values
    // This is managed in the AuthContext now.
    const [authPage, setAuthPage] = useState<'landing' | 'login' | 'email-sent' | 'verify-email'>('landing');


    return { user, setUser, unverifiedUser, isAdmin, isLoading, needsOnboarding, setNeedsOnboarding };
};