
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedDocument, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon, PolicyDraft, Policy, Form, PolicyType, FormType } from '../types';
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
import { POLICIES, FORMS } from '../constants';

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
        // Pricing actions
        setProPrice: (priceInCents: number) => Promise<void>;
        setDocPrice: (docType: string, priceInCents: number, category: 'policy' | 'form') => Promise<void>;
    };
    validateCoupon: (code: string, planType: 'pro' | 'payg') => Promise<{ valid: boolean; coupon?: Coupon; message?: string }>;
    handleMarkNotificationRead: (notificationId: string) => Promise<void>;
    handleMarkAllNotificationsRead: () => Promise<void>;
    handleSubscriptionSuccess: () => Promise<void>;
    handleTopUpSuccess: (amountInCents: number) => Promise<void>;
    handleDeductCredit: (amountInCents: number, description: string) => Promise<boolean>;
    handleDocumentGenerated: (doc: GeneratedDocument, originalId?: string, shouldNavigate?: boolean) => Promise<GeneratedDocument | undefined>;
    handleSaveDraft: (draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
    handleDeleteDraft: (id: string) => Promise<void>;

    // Pricing Data
    proPlanPrice: number;
    getDocPrice: (item: Policy | Form) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, isAdmin, setNeedsOnboarding } = useAuthContext();
    const { setToastMessage, navigateTo, setShowOnboardingWalkthrough } = useUIContext();
    const { showConfirmationModal, hideConfirmationModal } = useModalContext();

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

    // Pricing State
    const [proPlanPrice, setProPlanPrice] = useState(74700); // Default R747
    const [docPriceMap, setDocPriceMap] = useState<Record<string, number>>({});

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

    // Initial Load - Fetch Pricing
    useEffect(() => {
        const loadPricing = async () => {
            try {
                const { settings, docPrices } = await getPricingSettings();

                // Set Pro Price
                const proSetting = settings.find((s: any) => s.key === 'pro_plan_yearly');
                if (proSetting) setProPlanPrice(proSetting.value);

                // Set Doc Prices
                const priceMap: Record<string, number> = {};
                docPrices.forEach((dp: any) => {
                    priceMap[dp.doc_type] = dp.price;
                });
                setDocPriceMap(priceMap);
            } catch (error) {
                console.error("Failed to load pricing settings", error);
            }
        };
        loadPricing();
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            if (user.uid === 'sandbox-user-123') {
                console.log("🛠️ SANDBOX MODE: Seeding Mock Data...");
                const mockDocs: GeneratedDocument[] = [
                    {
                        id: 'mock-1',
                        uid: user.uid,
                        kind: 'policy',
                        type: 'disciplinary_code',
                        content: '# Disciplinary Code\n\nStandard disciplinary procedures for Atlas Tech Corp.',
                        version: 1,
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
                        history: []
                    },
                    {
                        id: 'mock-2',
                        uid: user.uid,
                        kind: 'policy',
                        type: 'social_media_policy',
                        content: '# Social Media Policy\n\nGuidelines for employee conduct on social platforms.',
                        version: 1,
                        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
                        history: []
                    },
                    {
                        id: 'mock-3',
                        uid: user.uid,
                        kind: 'form',
                        type: 'employment_contract_fixed',
                        content: '# Fixed-Term Employment Contract\n\nAgreement for project-based engineering roles.',
                        version: 1,
                        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
                        history: []
                    }
                ];
                setGeneratedDocuments(mockDocs);
                setIsLoadingUserDocs(false);
                setIsLoadingUserFiles(false);
                return;
            }

            if (isAdmin) {
                if (userCursors.length > 0) fetchUsersPage(0).catch(e => console.error(e));
                if (docCursors.length > 0) fetchDocsPage(0).catch(e => console.error(e));
                if (logCursors.length > 0) fetchLogsPage(0).catch(e => console.error(e));
                getAdminNotifications().then(setAdminNotifications);
                getCoupons().then(setCoupons);
            } else {
                setIsLoadingUserDocs(true);
                getGeneratedDocuments(user.uid).then(docs => {
                    setGeneratedDocuments(docs);
                    setIsLoadingUserDocs(false);
                });
                setIsLoadingUserFiles(true);
                getUserFiles(user.uid).then(files => {
                    setUserFiles(files);
                    setIsLoadingUserFiles(false);
                });
                getPolicyDrafts(user.uid).then(setPolicyDrafts);
            }
        } else {
            // Reset state on logout
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
        // Return dynamic price if exists, else fallback to constant
        if (docPriceMap[item.type]) return docPriceMap[item.type];
        return item.price;
    };

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
        } catch (error: any) {
            setToastMessage(`Upload failed: ${error.message}`);
        }
    };

    const handleProfilePhotoDelete = async () => {
        if (!user) return;
        try {
            await deleteProfilePhoto(user.uid);
            const updatedUser = { ...user };
            delete updatedUser.photoURL;
            setUser(updatedUser);
            setToastMessage("Profile photo deleted.");
        } catch (error: any) {
            setToastMessage(`Deletion failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file: File, notes: string) => {
        if (!user) return;
        try {
            await uploadUserFile(user.uid, file, notes);
            const updatedFiles = await getUserFiles(user.uid);
            setUserFiles(updatedFiles);
            setToastMessage("File uploaded successfully!");
        } catch (error: any) {
            setToastMessage(`Upload failed: ${error.message}`);
        }
    };

    const handleFileDownload = async (storagePath: string) => {
        try {
            const url = await getDownloadUrlForFile(storagePath);
            window.open(url, '_blank');
        } catch (error: any) {
            setToastMessage(`Download failed: ${error.message}`);
        }
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
                } catch (error: any) {
                    setToastMessage(`Error deleting file: ${error.message}`);
                }
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
            } catch (error: any) {
                setToastMessage(`Failed to create coupon: ${error.message}`);
            }
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
        if (updatedUser) setUser(updatedUser);
    };

    const handleTopUpSuccess = async (amountInCents: number) => {
        if (!user) return;
        setUser(prev => prev ? ({ ...prev, creditBalance: (prev.creditBalance || 0) + amountInCents }) : null);
        setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added.`);
        navigateTo('dashboard');
        const updatedUser = await getUserProfile(user.uid);
        if (updatedUser) setUser(updatedUser);
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
                if (shouldNavigate) setToastMessage("Document updated successfully!");
            }
        } else {
            docToSave = { ...doc, version: 1, history: [] };
            if (shouldNavigate) setToastMessage("Document saved successfully!");
        }

        try {
            const savedDoc = await saveGeneratedDocument(user.uid, docToSave);
            setGeneratedDocuments(prevDocs => {
                if (originalId) {
                    return prevDocs.map(d => d.id === originalId ? savedDoc : d);
                } else {
                    return [savedDoc, ...prevDocs];
                }
            });
            getGeneratedDocuments(user.uid).then(updatedDocs => { setGeneratedDocuments(updatedDocs); }).catch(err => console.warn(err));

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
        } catch (error: any) {
            console.error("Failed to delete draft:", error);
        }
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
};
