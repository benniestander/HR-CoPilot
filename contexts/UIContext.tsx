
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Policy, Form, GeneratedDocument } from '../types';

type View = 'dashboard' | 'generator' | 'updater' | 'checklist' | 'profile' | 'upgrade' | 'topup' | 'knowledge-base' | 'payment-success' | 'transactions' | 'auditor' | 'waitlist';

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

const getViewFromHash = (): View => {
    const hash = window.location.hash.slice(2); // Remove #/
    return (hash || 'dashboard') as View;
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<View>(getViewFromHash());
    const [selectedItem, setSelectedItem] = useState<Policy | Form | null>(null);
    const [documentToView, setDocumentToView] = useState<GeneratedDocument | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
    const [showOnboardingWalkthrough, setShowOnboardingWalkthrough] = useState(false);
    const [isPrePaid, setIsPrePaid] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentView(getViewFromHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        // Set initial hash if none exists
        if (!window.location.hash) {
            window.location.hash = '#/dashboard';
        }
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = useCallback((view: View, params?: Record<string, string>) => {
        let path = `/${view}`;
        if (params) {
            const query = new URLSearchParams(params).toString();
            path += `?${query}`;
        }
        window.location.hash = path;
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
