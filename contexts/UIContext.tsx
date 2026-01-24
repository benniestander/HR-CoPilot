
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Policy, Form, GeneratedDocument } from '../types';

type View = 'dashboard' | 'generator' | 'updater' | 'checklist' | 'profile' | 'upgrade' | 'topup' | 'knowledge-base' | 'payment-success' | 'transactions' | 'auditor' | 'waitlist' | 'consultants' | 'templates' | 'library';

interface UIContextType {
    currentView: View;
    selectedItem: Policy | Form | null;
    documentToView: GeneratedDocument | null;
    toastMessage: string | null;
    isNotificationPanelOpen: boolean;
    showOnboardingWalkthrough: boolean;
    isPrePaid: boolean; // New state to track if session was paid in Dashboard
    navigateTo: (view: View, params?: Record<string, string>) => void;
    setSelectedItem: React.Dispatch<React.SetStateAction<Policy | Form | null>>;
    setDocumentToView: React.Dispatch<React.SetStateAction<GeneratedDocument | null>>;
    setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setNotificationPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowOnboardingWalkthrough: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPrePaid: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentView: (view: View) => void; // Compatibility
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const getViewFromPath = (): View => {
    const path = window.location.pathname.slice(1); // Remove leading /
    const baseView = path.split('?')[0].split('/')[0];
    return (baseView || 'dashboard') as View;
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<View>(getViewFromPath());
    const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
    const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
    const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);
    const [isPrePaid, setIsPrePaid] = useState(false);

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentView(getViewFromPath());
        };

        window.addEventListener('popstate', handleLocationChange);

        // Listen for internal navigation
        window.addEventListener('pushstate', handleLocationChange);
        window.addEventListener('replacestate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('pushstate', handleLocationChange);
            window.removeEventListener('replacestate', handleLocationChange);
        };
    }, []);

    const navigateTo = useCallback((view: View, params?: Record<string, string>) => {
        let path = view === 'dashboard' ? '/' : `/${view}`;

        // Handle sub-paths for templates
        if (view === 'templates' && params?.slug) {
            path += `/${params.slug}`;
            // Remove slug from remaining params so it's not in the query string
            const { slug, ...rest } = params;
            if (Object.keys(rest).length > 0) {
                path += `?${new URLSearchParams(rest).toString()}`;
            }
        } else if (params) {
            path += `?${new URLSearchParams(params).toString()}`;
        }

        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('pushstate'));
    }, []);


    const value = {
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
        isPrePaid,
        setIsPrePaid,
        setCurrentView: (view: View) => navigateTo(view),
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
};
