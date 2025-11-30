import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedDocument, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon, PolicyDraft, Policy, Form } from '../types';
import {
    updateUser,
    getGeneratedDocuments,
    saveGeneratedDocument,
    addTransactionToUser,
    getAllUsers,
    getAllDocumentsForAllUsers,
    getAdminActionLogs,
    updateUserByAdmin,
    adjustUserCreditByAdmin,
    changeUserPlanByAdmin,
    grantProPlanByAdmin,
    getAdminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    simulateFailedPaymentForUser,
    getUserFiles,
    uploadUserFile,
    getDownloadUrlForFile,
    deleteUserFile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    getUserProfile,
    createCoupon,
    getCoupons,
    deactivateCoupon,
    validateCoupon,
    savePolicyDraft,
    getPolicyDrafts,
    deletePolicyDraft,
    getPricingSettings,
    updateProPrice,
    updateDocumentPrice
} from '../services/dbService';
import { useAuthContext } from './AuthContext';
import { useUIContext } from './UIContext';
import { useModalContext } from './ModalContext';

const PAGE_SIZE = 25;

export interface PageInfo {
    pageIndex: number;
    pageSize: number;
    hasNextPage: boolean;
    dataLength: number;
    total?: number;
}

interface DataContextType {
    generatedDocuments: GeneratedDocument[];
    userFiles: UserFile[];
    policyDrafts: PolicyDraft[];
    paginatedUsers: { data: User[]; pageInfo: PageInfo };
    handleNextUsers: () => void;
    handlePrevUsers: () => void;
    isFetchingUsers: boolean;
    paginatedDocuments: { data: GeneratedDocument[]; pageInfo: PageInfo };
    handleNextDocs: () => void;
    handlePrevDocs: () => void;
    isFetchingDocs: boolean;
    transactionsForUserPage: Transaction[];
    paginatedLogs: { data: AdminActionLog[]; pageInfo: PageInfo };
    handleNextLogs: () => void;
    handlePrevLogs: () => void;
    isFetchingLogs: boolean;
    adminNotifications: AdminNotification[];
    coupons: Coupon[];
    isLoadingUserDocs: boolean;
    isLoadingUserFiles: boolean;
    handleUpdateProfile: (data: { profile: CompanyProfile; name?: string; contactNumber?: string }) => Promise<void>;
    handleInitialProfileSubmit: (profileData: CompanyProfile, name: string) => Promise<void>;
    handleProfilePhotoUpload: (file: File) => Promise<void>;
    handleProfilePhotoDelete: () => Promise<void>;
    handleFileUpload: (file: File, notes: string) => Promise<void>;
    handleFileDownload: (storagePath: string) => Promise<void>;
    handleDeleteUserFile: (fileId: string, storagePath: string) => void;
    adminActions: {
        updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
        adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
        changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
        grantPro: (targetUid: string) => Promise<void>;
        simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
        createCoupon: (data: Partial<Coupon>) => Promise<void>;
        deactivateCoupon: (id: string) => Promise<void>;
        setProPrice: (priceInCents: number) => Promise<void>;
        setDocPrice: (docType: string, priceInCents: number, category: 'policy' | 'form') => Promise<void>;
    };
    validateCoupon: (code: string, planType: 'pro' | 'payg') => Promise<{ valid: boolean; coupon?: Coupon; message?: string }>;
    handleMarkNotificationRead: (notificationId: string) => Promise<void>;
    handleMarkAllNotificationsRead: () => Promise<void>;
    handleSubscriptionSuccess: () => Promise<void>;
    handleTopUpSuccess: (amountInCents: number) => Promise<void>;
    handleDeductCredit: (amountInCents: number, description: string) => Promise<boolean>;
    // Updated signature to allow optional navigation and return saved document
    handleDocumentGenerated: (doc: GeneratedDocument, originalId?: string, shouldNavigate?: boolean) => Promise<GeneratedDocument | undefined>;
    handleSaveDraft: (draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
    handleDeleteDraft: (id: string) => Promise<void>;
    proPlanPrice: number;
    getDocPrice: (item: Policy | Form) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, isAdmin, setNeedsOnboarding } = useAuthContext();
    const { setToastMessage, navigateTo, setShowOnboardingWalkthrough } = useUIContext();
    const { showConfirmationModal, hideConfirmationModal } = useModalContext();

    // ... (State and Fetchers logic unchanged) ...
    const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
    const [userFiles, setUserFiles] = useState<UserFile[]>([]);
    const [policyDrafts, setPolicyDrafts] = useState<PolicyDraft[]>([]);
    const [isLoadingUserDocs, setIsLoadingUserDocs] = useState(true);
    const [isLoadingUserFiles, setIsLoadingUserFiles] = useState(true);
    const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
    const [userCursors, setUserCursors] = useState<number[]>([0]);
    const [userPageIndex, setUserPageIndex] = useState(0);
    const [userHasNextPage, setUserHasNextPage] = useState(true);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const [paginatedDocuments, setPaginatedDocuments] = useState<GeneratedDocument[]>([]);
    const [docCursors, setDocCursors] = useState<number[]>([0]);
    const [docPageIndex, setDocPageIndex] = useState(0);
    const [docHasNextPage, setDocHasNextPage] = useState(true);
    const [isFetchingDocs, setIsFetchingDocs] = useState(false);
    const [paginatedLogs, setPaginatedLogs] = useState<AdminActionLog[]>([]);
    const [logCursors, setLogCursors] = useState<number[]>([0]);
    const [logPageIndex, setLogPageIndex] = useState(0);
    const [logHasNextPage, setLogHasNextPage] = useState(true);
    const [isFetchingLogs, setIsFetchingLogs] = useState(false);
    const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [proPlanPrice, setProPlanPrice] = useState(74700);
    const [docPriceMap, setDocPriceMap] = useState<Record<string, number>>({});

    // ... (createPageFetcher implementation unchanged) ...
    const createPageFetcher = <T,>(
        fetchFn: (pageSize: number, cursor?: number) => Promise<{ data: T[], lastVisible: number | null }>,
        setData: React.Dispatch<React.SetStateAction<T[]>>,
        setCursors: React.Dispatch<React.SetStateAction<number[]>>,
        setPageIndex: React.Dispatch<React.SetStateAction<number>>,
        setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>,
        cursors: number[],
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => async (pageIndex: number) => {
        if (pageIndex < 0) return;
        if (pageIndex >= cursors.length) return;
        
        const cursor = cursors[pageIndex];
        if (cursor === undefined || cursor === null) return;

        setLoading(true);
        try {
            const { data, lastVisible } = await fetchFn(PAGE_SIZE, cursor);
            setData(data || []); 
            setPageIndex(pageIndex);

            if (pageIndex === cursors.length - 1) {
                if (lastVisible !== null && data && data.length === PAGE_SIZE) {
                    setCursors(prev => {
                        if (prev[prev.length - 1] !== lastVisible) {
                            return [...prev, lastVisible];
                        }
                        return prev;
                    });
                    setHasNextPage(true);
                } else {
                    setHasNextPage(false);
                }
            } else {
                setHasNextPage(pageIndex < cursors.length - 1);
            }
        } catch (err: any) {
            console.error(`Pagination error (Page ${pageIndex}):`, err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersPage = useCallback(createPageFetcher(getAllUsers, setPaginatedUsers, setUserCursors, setUserPageIndex, setUserHasNextPage, userCursors, setIsFetchingUsers), [userCursors]);
    const fetchDocsPage = useCallback(createPageFetcher(getAllDocumentsForAllUsers, setPaginatedDocuments, setDocCursors, setDocPageIndex, setDocHasNextPage, docCursors, setIsFetchingDocs), [docCursors]);
    const fetchLogsPage = useCallback(createPageFetcher(getAdminActionLogs, setPaginatedLogs, setLogCursors, setLogPageIndex, setLogHasNextPage, logCursors, setIsFetchingLogs), [logCursors]);

    const handleNextUsers = () => { if (userHasNextPage) fetchUsersPage(userPageIndex + 1); };
    const handlePrevUsers = () => { if (userPageIndex > 0) fetchUsersPage(userPageIndex - 1); };
    const handleNextDocs = () => { if (docHasNextPage) fetchDocsPage(docPageIndex + 1); };
    const handlePrevDocs = () => { if (docPageIndex > 0) fetchDocsPage(docPageIndex - 1); };
    const handleNextLogs = () => { if (logHasNextPage) fetchLogsPage(logPageIndex + 1); };
    const handlePrevLogs = () => { if (logPageIndex > 0) fetchLogsPage(logPageIndex - 1); };

    const transactionsForUserPage = useMemo(() => {
        return paginatedUsers.flatMap(user => 
            (user.transactions || []).map(tx => ({ ...tx, userEmail: user.email }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [paginatedUsers]);

    // ... (Effects for pricing and user data loading unchanged) ...
    useEffect(() => {
        const loadPricing = async () => {
            try {
                const { settings, docPrices } = await getPricingSettings();
                const proSetting = settings.find((s: any) => s.key === 'pro_plan_yearly');
                if (proSetting) setProPlanPrice(proSetting.value);
                const priceMap: Record<string, number> = {};
                docPrices.forEach((dp: any) => { priceMap[dp.doc_type] = dp.price; });
                setDocPriceMap(priceMap);
            } catch (error) { console.error("Failed to load pricing", error); }
        };
        loadPricing();
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            if (isAdmin) {
                if (userCursors.length > 0) fetchUsersPage(0).catch(e => console.error(e));
                if (docCursors.length > 0) fetchDocsPage(0).catch(e => console.error(e));
                if (logCursors.length > 0) fetchLogsPage(0).catch(e => console.error(e));
                getAdminNotifications().then(setAdminNotifications);
                getCoupons().then(setCoupons);
            } else {
                setIsLoadingUserDocs(true);
                getGeneratedDocuments(user.uid).then(docs => { setGeneratedDocuments(docs); setIsLoadingUserDocs(false); });
                setIsLoadingUserFiles(true);
                getUserFiles(user.uid).then(files => { setUserFiles(files); setIsLoadingUserFiles(false); });
                getPolicyDrafts(user.uid).then(setPolicyDrafts);
            }
        } else {
            setGeneratedDocuments([]);
            setUserFiles([]);
            setPolicyDrafts([]);
            setPaginatedUsers([]);
            setPaginatedDocuments([]);
            setPaginatedLogs([]);
            setAdminNotifications([]);
            setCoupons([]);
            setIsLoadingUserDocs(false);
            setIsLoadingUserFiles(false);
        }
    }, [user?.uid, isAdmin]);

    const getDocPrice = (item: Policy | Form): number => {
        if (docPriceMap[item.type]) return docPriceMap[item.type];
        return item.price;
    };

    // ... (Handlers for profile, files, admin actions unchanged) ...
    const handleUpdateProfile = async (data: { profile: CompanyProfile; name?: string; contactNumber?: string }) => {
        if (!user) return;
        const updatedProfile = { ...user.profile, ...data.profile };
        const updates: Partial<User> = { profile: updatedProfile };
        if (data.name !== undefined) updates.name = data.name;
        if (data.contactNumber !== undefined) updates.contactNumber = data.contactNumber;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await updateUser(user.uid, updates);
        setToastMessage("Profile updated successfully!");
    };
    
    const handleInitialProfileSubmit = async (profileData: CompanyProfile, name: string) => {
        if (!user) return;
        const updatedProfile = { ...user.profile, ...profileData };
        const updatedUser = { ...user, name, profile: updatedProfile };
        setUser(updatedUser);
        await updateUser(user.uid, { name, profile: updatedProfile });
        setNeedsOnboarding(false);
        setShowOnboardingWalkthrough(true);
    };

    const handleProfilePhotoUpload = async (file: File) => {
        if (!user) return;
        try {
            const photoURL = await uploadProfilePhoto(user.uid, file);
            setUser({ ...user, photoURL });
            setToastMessage("Profile photo updated successfully!");
        } catch (error: any) { setToastMessage(`Upload failed: ${error.message}`); }
    };
    
    const handleProfilePhotoDelete = async () => {
        if (!user) return;
        try {
            await deleteProfilePhoto(user.uid);
            const updatedUser = { ...user };
            delete updatedUser.photoURL;
            setUser(updatedUser);
            setToastMessage("Profile photo deleted.");
        } catch (error: any) { setToastMessage(`Deletion failed: ${error.message}`); }
    };
    
    const handleFileUpload = async (file: File, notes: string) => {
        if (!user) return;
        try {
            await uploadUserFile(user.uid, file, notes);
            const updatedFiles = await getUserFiles(user.uid);
            setUserFiles(updatedFiles);
            setToastMessage("File uploaded successfully!");
        } catch (error: any) { setToastMessage(`Upload failed: ${error.message}`); }
    };
    
    const handleFileDownload = async (storagePath: string) => {
        try {
            const url = await getDownloadUrlForFile(storagePath);
            window.open(url, '_blank');
        } catch (error: any) { setToastMessage(`Download failed: ${error.message}`); }
    };
    
    const handleDeleteUserFile = (fileId: string, storagePath: string) => {
        if (!user) return;
        const file = userFiles.find(f => f.id === fileId);
        if (!file) return;
        showConfirmationModal({
            title: "Delete File",
            message: `Are you sure you want to permanently delete the file "${file.name}"?`,
            onConfirm: async () => {
                hideConfirmationModal();
                try {
                    await deleteUserFile(user.uid, fileId, storagePath);
                    setUserFiles(prev => prev.filter(f => f.id !== fileId));
                    setToastMessage("File deleted successfully.");
                } catch (error: any) { setToastMessage(`Error deleting file: ${error.message}`); }
            }
        });
    };

    const adminActions = {
        updateUser: async (targetUid: string, updates: Partial<User>) => {
            if (!user || !isAdmin) return;
            await updateUserByAdmin(user.email, targetUid, updates);
            await fetchUsersPage(userPageIndex);
            setToastMessage("User profile updated.");
        },
        adjustCredit: async (targetUid: string, amountInCents: number, reason: string) => {
            if (!user || !isAdmin) return;
            const updatedUser = await adjustUserCreditByAdmin(user.email, targetUid, amountInCents, reason);
            if (updatedUser) setPaginatedUsers(prev => prev.map(u => u.uid === targetUid ? updatedUser : u));
            else await fetchUsersPage(userPageIndex);
            setToastMessage(`Credit adjusted.`);
        },
        changePlan: async (targetUid: string, newPlan: 'pro' | 'payg') => {
            if (!user || !isAdmin) return;
            await changeUserPlanByAdmin(user.email, targetUid, newPlan);
            await fetchUsersPage(userPageIndex);
            setToastMessage("User plan changed successfully.");
        },
        grantPro: async (targetUid: string) => {
            if (!user || !isAdmin) return;
            await grantProPlanByAdmin(user.email, targetUid);
            await fetchUsersPage(userPageIndex);
            setToastMessage("Granted Free Pro Plan (12 Months).");
        },
        simulateFailedPayment: async (targetUid: string, targetUserEmail: string) => {
            if (!user || !isAdmin) return;
            await simulateFailedPaymentForUser(user.email, targetUid, targetUserEmail);
            await getAdminNotifications().then(setAdminNotifications);
            setToastMessage(`Simulated a failed payment for ${targetUserEmail}.`);
        },
        createCoupon: async (data: Partial<Coupon>) => {
            if (!user || !isAdmin) return;
            try {
                await createCoupon(data);
                await getCoupons().then(setCoupons);
                setToastMessage("Coupon created successfully.");
            } catch (error: any) { setToastMessage(`Failed to create coupon: ${error.message}`); }
        },
        deactivateCoupon: async (id: string) => {
            if (!user || !isAdmin) return;
            await deactivateCoupon(id);
            await getCoupons().then(setCoupons);
            setToastMessage("Coupon deactivated.");
        },
        setProPrice: async (priceInCents: number) => {
            if (!user || !isAdmin) return;
            await updateProPrice(priceInCents);
            setProPlanPrice(priceInCents);
            setToastMessage("Pro Plan price updated.");
        },
        setDocPrice: async (docType: string, priceInCents: number, category: 'policy' | 'form') => {
            if (!user || !isAdmin) return;
            await updateDocumentPrice(docType, priceInCents, category);
            setDocPriceMap(prev => ({ ...prev, [docType]: priceInCents }));
            setToastMessage("Document price updated.");
        }
    };
    
    const handleMarkNotificationRead = async (notificationId: string) => {
        await markNotificationAsRead(notificationId);
        await getAdminNotifications().then(setAdminNotifications);
    };

    const handleMarkAllNotificationsRead = async () => {
        await markAllNotificationsAsRead();
        await getAdminNotifications().then(setAdminNotifications);
    };

    const handleSubscriptionSuccess = async () => {
        if (!user) return;
        setUser(prev => prev ? ({ ...prev, plan: 'pro' }) : null);
        setToastMessage("Success! Welcome to HR CoPilot Pro.");
        navigateTo('dashboard');
        setShowOnboardingWalkthrough(true);
        const updatedUser = await getUserProfile(user.uid);
        if(updatedUser) setUser(updatedUser);
    };
    
    const handleTopUpSuccess = async (amountInCents: number) => {
        if (!user) return;
        setUser(prev => prev ? ({ ...prev, creditBalance: (prev.creditBalance || 0) + amountInCents }) : null);
        setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added.`);
        navigateTo('dashboard');
        const updatedUser = await getUserProfile(user.uid);
        if(updatedUser) setUser(updatedUser);
    };

    const handleDeductCredit = async (amountInCents: number, description: string): Promise<boolean> => {
        if (!user) return false;
        if (user.creditBalance < amountInCents) {
            setToastMessage("Insufficient credit.");
            return false;
        }
        try {
            setUser(prev => prev ? ({ ...prev, creditBalance: Math.max(0, prev.creditBalance - amountInCents) }) : null);
            await addTransactionToUser(user.uid, { description, amount: -amountInCents }, true);
            const updatedUser = await getUserProfile(user.uid);
            if (updatedUser) setUser(updatedUser);
            return true;
        } catch (error: any) {
            console.error("Deduction failed:", error);
            const updatedUser = await getUserProfile(user.uid);
            if (updatedUser) setUser(updatedUser);
            setToastMessage("Failed to deduct credit. Please try again.");
            return false;
        }
    };
    
    const handleDocumentGenerated = async (doc: GeneratedDocument, originalId?: string, shouldNavigate: boolean = true): Promise<GeneratedDocument | undefined> => {
        if (!user) return undefined;
        let docToSave = { ...doc };
        if (originalId) {
            const oldDoc = generatedDocuments.find(d => d.id === originalId);
            if (oldDoc) {
                docToSave = {
                    ...doc,
                    id: originalId,
                    version: oldDoc.version + 1,
                    createdAt: new Date().toISOString(),
                    history: [{ version: oldDoc.version, createdAt: oldDoc.createdAt, content: oldDoc.content }, ...(oldDoc.history || [])],
                };
                setToastMessage("Document updated successfully!");
            }
        } else {
            docToSave = { ...doc, version: 1, history: [] };
            setToastMessage("Document saved successfully!");
        }

        try {
            const savedDoc = await saveGeneratedDocument(user.uid, docToSave);
            
            // Optimistically update local state with the REAL saved doc (containing UUID)
            setGeneratedDocuments(prevDocs => {
                if (originalId) {
                    return prevDocs.map(d => d.id === originalId ? savedDoc : d);
                } else {
                    return [savedDoc, ...prevDocs];
                }
            });
            
            // If we are navigating (manual save), we go to dashboard.
            if (shouldNavigate) {
                navigateTo('dashboard');
            }
            
            return savedDoc;
        } catch (error) {
            console.error("Failed to save document:", error);
            setToastMessage("Error saving document to database.");
            return undefined;
        }
    };

    const handleSaveDraft = async (draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
        if (!user) return;
        try {
            await savePolicyDraft(user.uid, draft);
            const updatedDrafts = await getPolicyDrafts(user.uid);
            setPolicyDrafts(updatedDrafts);
            setToastMessage("Draft saved successfully!");
        } catch (error: any) {
            setToastMessage(`Failed to save draft: ${error.message}`);
        }
    };

    const handleDeleteDraft = async (id: string) => {
        if (!user) return;
        try {
            await deletePolicyDraft(id);
            setPolicyDrafts(prev => prev.filter(d => d.id !== id));
        } catch (error: any) { console.error("Failed to delete draft:", error); }
    };

    const value: DataContextType = {
        generatedDocuments,
        userFiles,
        policyDrafts,
        paginatedUsers: { data: paginatedUsers, pageInfo: { pageIndex: userPageIndex, pageSize: PAGE_SIZE, hasNextPage: userHasNextPage, dataLength: paginatedUsers.length, total: undefined } },
        handleNextUsers,
        handlePrevUsers,
        isFetchingUsers,
        paginatedDocuments: { data: paginatedDocuments, pageInfo: { pageIndex: docPageIndex, pageSize: PAGE_SIZE, hasNextPage: docHasNextPage, dataLength: paginatedDocuments.length, total: undefined } },
        handleNextDocs,
        handlePrevDocs,
        isFetchingDocs,
        transactionsForUserPage,
        paginatedLogs: { data: paginatedLogs, pageInfo: { pageIndex: logPageIndex, pageSize: PAGE_SIZE, hasNextPage: logHasNextPage, dataLength: paginatedLogs.length, total: undefined } },
        handleNextLogs,
        handlePrevLogs,
        isFetchingLogs,
        adminNotifications,
        coupons,
        isLoadingUserDocs,
        isLoadingUserFiles,
        handleUpdateProfile,
        handleInitialProfileSubmit,
        handleProfilePhotoUpload,
        handleProfilePhotoDelete,
        handleFileUpload,
        handleFileDownload,
        handleDeleteUserFile,
        adminActions,
        validateCoupon,
        handleMarkNotificationRead,
        handleMarkAllNotificationsRead,
        handleSubscriptionSuccess,
        handleTopUpSuccess,
        handleDeductCredit,
        handleDocumentGenerated,
        handleSaveDraft,
        handleDeleteDraft,
        proPlanPrice,
        getDocPrice
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};```tsx
import React, { useState, useCallback, useEffect } from 'react';
import Stepper from './Stepper';
import CompanyProfileSetup from './CompanyProfileSetup';
import GuidedQuestionnaire from './GuidedQuestionnaire';
import PolicyPreview from './PolicyPreview';
import { generatePolicyStream, generateFormStream } from '../services/geminiService';
import type { Policy, Form, CompanyProfile, FormAnswers, GeneratedDocument, AppStatus, Source, PolicyType, FormType } from '../types';
import { CheckIcon, LoadingIcon, EditIcon } from './Icons';
import { useDataContext } from '../contexts/DataContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';
import { POLICIES, FORMS } from '../constants';

interface GeneratorPageProps {
    selectedItem: Policy | Form;
    initialData: GeneratedDocument | null;
    userProfile: CompanyProfile;
    onDocumentGenerated: (doc: GeneratedDocument, originalId?: string, shouldNavigate?: boolean) => Promise<GeneratedDocument | undefined>;
    onBack: () => void;
}

const policyLoadingMessages = [
    "Analyzing your company profile...",
    "Consulting the Basic Conditions of Employment Act...",
    "Reviewing specific industry regulations...",
    "Drafting compliant legal clauses...",
    "Finalizing formatting and structure..."
];

const formLoadingMessages = [
    "Loading standard HR template...",
    "Applying your customization details...",
    "Ensuring legal compliance...",
    "Formatting for professional use..."
];

const GeneratorPage: React.FC<GeneratorPageProps> = ({ selectedItem, initialData, userProfile, onDocumentGenerated, onBack }) => {
    const { user } = useAuthContext();
    const { handleDeductCredit } = useDataContext();
    const { isPrePaid, setIsPrePaid, setToastMessage } = useUIContext();
    
    const isPolicy = selectedItem.kind === 'policy';
    const isProfileSufficient = userProfile && userProfile.companyName && (!isPolicy || userProfile.industry);

    const STEPS = ["Profile", "Customize", "Finalize"];
    const [currentStep, setCurrentStep] = useState(() => {
        if (initialData) return 3;
        if (isProfileSufficient) return 2;
        return 1;
    });

    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
        initialData?.companyProfile || (isProfileSufficient ? userProfile : null)
    );
    const [questionAnswers, setQuestionAnswers] = useState<FormAnswers>(initialData?.questionAnswers || {});
    const [generatedDocument, setGeneratedDocument] = useState<string>(initialData?.content || '');
    const [sources, setSources] = useState<Source[]>(initialData?.sources || []);
    const [status, setStatus] = useState<AppStatus>(initialData ? 'success' : 'idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [finalizedDoc, setFinalizedDoc] = useState<GeneratedDocument | null>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeducting, setIsDeducting] = useState(false);
    
    // Manage document ID locally to handle transition from Temp ID -> Real DB UUID
    const [docId, setDocId] = useState<string | undefined>(initialData?.id);
    
    // Initialize hasPaidSession with true if we came from Dashboard with isPrePaid flag
    const [hasPaidSession, setHasPaidSession] = useState(isPrePaid);

    // Reset global pre-paid flag so if they navigate away and back, they don't skip payment next time
    useEffect(() => {
        if (isPrePaid) {
            setIsPrePaid(false); 
        }
    }, []);
    
    const handleProfileSubmit = (profile: CompanyProfile) => {
        setCompanyProfile(profile);
        setCurrentStep(2);
    };

    const handleGenerate = useCallback(async () => {
        if (!selectedItem || !companyProfile || !user) return;

        // 1. Handle PAYG Credit Deduction (Fallback Logic)
        if (user.plan === 'payg' && !initialData && !hasPaidSession) {
            setIsDeducting(true);
            let price = 0;
            if (selectedItem.kind === 'policy') {
                price = POLICIES[selectedItem.type as PolicyType]?.price || 0;
            } else {
                price = FORMS[selectedItem.type as FormType]?.price || 0;
            }

            if (price > 0) {
                const success = await handleDeductCredit(price, `Generated: ${selectedItem.title}`);
                setIsDeducting(false);
                if (!success) {
                    return; 
                }
                setHasPaidSession(true); 
            } else {
                setIsDeducting(false);
            }
        }

        setCurrentStep(3);
        setStatus('loading');
        setGeneratedDocument('');
        setSources([]);
        setErrorMessage(null);

        const allAnswers: FormAnswers = { ...companyProfile, ...questionAnswers };

        try {
            let fullText = '';
            let finalSources: Source[] = [];
            if (selectedItem.kind === 'policy') {
                const stream = generatePolicyStream(selectedItem.type, allAnswers);
                for await (const chunk of stream) {
                    if (chunk.text) {
                        fullText += chunk.text;
                        setGeneratedDocument(prev => prev + chunk.text);
                    }
                    const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                    if (newSources) {
                        const uniqueNewSources: Source[] = newSources
                            .filter(s => s.web?.uri)
                            .map(s => ({ web: { uri: s.web!.uri!, title: s.web!.title || s.web!.uri! } }));
                        
                        finalSources = [...finalSources, ...uniqueNewSources].reduce((acc, current) => {
                            if (!acc.find(item => item.web?.uri === current.web?.uri)) {
                                acc.push(current);
                            }
                            return acc;
                        }, [] as Source[]);

                        setSources(finalSources);
                    }
                }
            } else {
                const stream = generateFormStream(selectedItem.type, allAnswers);
                for await (const chunk of stream) {
                    fullText += chunk;
                    setGeneratedDocument(prev => prev + chunk);
                }
            }
            setStatus('success');
            
            // Create Document Object
            const newDoc: GeneratedDocument = {
                // Use existing ID if editing/regenerating, otherwise temp ID
                id: docId || `${selectedItem.type}-${Date.now()}`,
                title: selectedItem.title,
                kind: selectedItem.kind,
                type: selectedItem.type,
                content: fullText,
                createdAt: new Date().toISOString(),
                companyProfile,
                questionAnswers,
                outputFormat: selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word',
                sources: finalSources,
                version: initialData?.version || 0 
            };
            setFinalizedDoc(newDoc);

            // AUTO-SAVE AS DRAFT (No Navigation)
            // This ensures work is not lost if user navigates away, and sets the DB ID.
            try {
                const savedDoc = await onDocumentGenerated(newDoc, docId, false);
                if (savedDoc) {
                    setFinalizedDoc(savedDoc);
                    setDocId(savedDoc.id); // Update local ID to the real UUID from DB
                    setToastMessage("Auto-saved to documents.");
                }
            } catch (err) {
                console.warn("Auto-save failed:", err);
            }

        } catch (error: any) {
            console.error('Failed to generate document:', error);
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        }
    }, [selectedItem, companyProfile, questionAnswers, initialData, user, handleDeductCredit, hasPaidSession, docId, onDocumentGenerated, setToastMessage]);

    // Handle manual content edits from PolicyPreview
    const handleContentChange = (newContent: string) => {
        if (finalizedDoc) {
            setFinalizedDoc(prev => prev ? ({ ...prev, content: newContent }) : null);
        }
    };

    const handleSaveDocument = async () => {
        if (finalizedDoc) {
            setIsSaving(true);
            try {
                // Save and Navigate
                await onDocumentGenerated(finalizedDoc, docId, true);
            } catch (error) {
                console.error("Error saving document:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <CompanyProfileSetup 
                            item={selectedItem}
                            initialProfile={userProfile}
                            onProfileSubmit={handleProfileSubmit} 
                            onBack={onBack} 
                        />;
            case 2:
                if (!companyProfile) {
                    setCurrentStep(1);
                    return null;
                }
                if (isDeducting) {
                    return (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
                            <LoadingIcon className="w-12 h-12 animate-spin text-primary mb-4" />
                            <h3 className="text-xl font-bold text-secondary">Processing Payment...</h3>
                            <p className="text-gray-600">Please wait while we secure your document generation.</p>
                        </div>
                    )
                }
                return (
                    <GuidedQuestionnaire
                        item={selectedItem}
                        companyProfile={companyProfile}
                        initialAnswers={questionAnswers}
                        onAnswersChange={setQuestionAnswers}
                        onGenerate={handleGenerate}
                    />
                );
            case 3:
                 if (!companyProfile) { 
                    setCurrentStep(1);
                    return null;
                }
                return (
                    <div>
                        <PolicyPreview
                            policyText={generatedDocument}
                            status={status}
                            onRetry={handleGenerate}
                            isForm={selectedItem.kind === 'form'}
                            outputFormat={selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word'}
                            sources={sources}
                            errorMessage={errorMessage}
                            loadingMessages={selectedItem.kind === 'policy' ? policyLoadingMessages : formLoadingMessages}
                            onContentChange={handleContentChange}
                        />
                        {status === 'success' && (
                             <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 gap-4">
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                    <button onClick={onBack} disabled={isSaving} className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 whitespace-nowrap">
                                        Cancel & Start Over
                                    </button>
                                    <button 
                                        onClick={() => setCurrentStep(2)} 
                                        disabled={isSaving}
                                        className="text-sm font-bold text-primary hover:underline flex items-center disabled:opacity-50 whitespace-nowrap"
                                    >
                                        <EditIcon className="w-4 h-4 mr-1" />
                                        Edit Details & Regenerate
                                    </button>
                                </div>
                                <button
                                    onClick={handleSaveDocument}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Saving...</> : <><CheckIcon className="w-5 h-5 mr-2" /> Save Document</>}
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} isStepClickable={!!companyProfile && !isSaving && !isDeducting} />
            <div className="mt-8">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default GeneratorPage;