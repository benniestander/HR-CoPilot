
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedDocument, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, PolicyType, FormType } from '../types';
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
    getUserProfile
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
    
    // Paginated Admin Data
    paginatedUsers: { data: User[]; pageInfo: PageInfo };
    handleNextUsers: () => void;
    handlePrevUsers: () => void;

    paginatedDocuments: { data: GeneratedDocument[]; pageInfo: PageInfo };
    handleNextDocs: () => void;
    handlePrevDocs: () => void;

    transactionsForUserPage: Transaction[];

    paginatedLogs: { data: AdminActionLog[]; pageInfo: PageInfo };
    handleNextLogs: () => void;
    handlePrevLogs: () => void;

    // Non-paginated admin data
    adminNotifications: AdminNotification[];
    
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
        simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
    };
    handleMarkNotificationRead: (notificationId: string) => Promise<void>;
    handleMarkAllNotificationsRead: () => Promise<void>;
    handleSubscriptionSuccess: () => Promise<void>;
    handleTopUpSuccess: (amountInCents: number) => Promise<void>;
    handleDocumentGenerated: (doc: GeneratedDocument, originalId?: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, isAdmin, setNeedsOnboarding } = useAuthContext();
    const { setToastMessage, navigateTo, setShowOnboardingWalkthrough } = useUIContext();
    const { showConfirmationModal, hideConfirmationModal } = useModalContext();

    // User data
    const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
    const [userFiles, setUserFiles] = useState<UserFile[]>([]);

    // Admin data (paginated)
    const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
    // For Supabase, cursors are simply offsets (numbers)
    const [userCursors, setUserCursors] = useState<number[]>([0]);
    const [userPageIndex, setUserPageIndex] = useState(0);
    const [userHasNextPage, setUserHasNextPage] = useState(true);

    const [paginatedDocuments, setPaginatedDocuments] = useState<GeneratedDocument[]>([]);
    const [docCursors, setDocCursors] = useState<number[]>([0]);
    const [docPageIndex, setDocPageIndex] = useState(0);
    const [docHasNextPage, setDocHasNextPage] = useState(true);

    const [paginatedLogs, setPaginatedLogs] = useState<AdminActionLog[]>([]);
    const [logCursors, setLogCursors] = useState<number[]>([0]);
    const [logPageIndex, setLogPageIndex] = useState(0);
    const [logHasNextPage, setLogHasNextPage] = useState(true);
    
    // Admin data (non-paginated)
    const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);

    const createPageFetcher = <T,>(
        fetchFn: (pageSize: number, cursor?: number) => Promise<{ data: T[], lastVisible: number | null }>,
        setData: React.Dispatch<React.SetStateAction<T[]>>,
        setCursors: React.Dispatch<React.SetStateAction<number[]>>,
        setPageIndex: React.Dispatch<React.SetStateAction<number>>,
        setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>,
        cursors: number[]
    ) => async (pageIndex: number) => {
        if (pageIndex < 0 || pageIndex >= cursors.length) return;
        const cursor = cursors[pageIndex];
        const { data, lastVisible } = await fetchFn(PAGE_SIZE, cursor);

        setData(data);
        setPageIndex(pageIndex);

        if (pageIndex === cursors.length - 1) {
            if (lastVisible !== null && data.length === PAGE_SIZE) {
                setCursors(prev => [...prev, lastVisible]);
                setHasNextPage(true);
            } else {
                setHasNextPage(false);
            }
        }
    };

    const fetchUsersPage = useCallback(createPageFetcher(getAllUsers, setPaginatedUsers, setUserCursors, setUserPageIndex, setUserHasNextPage, userCursors), [userCursors]);
    const fetchDocsPage = useCallback(createPageFetcher(getAllDocumentsForAllUsers, setPaginatedDocuments, setDocCursors, setDocPageIndex, setDocHasNextPage, docCursors), [docCursors]);
    const fetchLogsPage = useCallback(createPageFetcher(getAdminActionLogs, setPaginatedLogs, setLogCursors, setLogPageIndex, setLogHasNextPage, logCursors), [logCursors]);

    const handleNextUsers = () => { if (userHasNextPage) fetchUsersPage(userPageIndex + 1); };
    const handlePrevUsers = () => { if (userPageIndex > 0) fetchUsersPage(userPageIndex - 1); };
    const handleNextDocs = () => { if (docHasNextPage) fetchDocsPage(docPageIndex + 1); };
    const handlePrevDocs = () => { if (docPageIndex > 0) fetchDocsPage(docPageIndex - 1); };
    const handleNextLogs = () => { if (logHasNextPage) fetchLogsPage(logPageIndex + 1); };
    const handlePrevLogs = () => { if (logPageIndex > 0) fetchLogsPage(logPageIndex - 1); };

    const transactionsForUserPage = useMemo(() => {
        return paginatedUsers.flatMap(user => 
            (user.transactions || []).map(tx => ({
                ...tx,
                userEmail: user.email
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [paginatedUsers]);


    useEffect(() => {
        if (user) {
            if (isAdmin) {
                fetchUsersPage(0);
                fetchDocsPage(0);
                fetchLogsPage(0);
                getAdminNotifications().then(setAdminNotifications);
            } else {
                getGeneratedDocuments(user.uid).then(setGeneratedDocuments);
                getUserFiles(user.uid).then(setUserFiles);
            }
        } else {
            setGeneratedDocuments([]);
            setUserFiles([]);
            setPaginatedUsers([]);
            setPaginatedDocuments([]);
            setPaginatedLogs([]);
            setAdminNotifications([]);
        }
    }, [user, isAdmin]);

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
            
            if (updatedUser) {
                setPaginatedUsers(prev => prev.map(u => u.uid === targetUid ? updatedUser : u));
            } else {
                await fetchUsersPage(userPageIndex);
            }
            setToastMessage(`Credit adjusted.`);
        },
        changePlan: async (targetUid: string, newPlan: 'pro' | 'payg') => {
            if (!user || !isAdmin) return;
            await changeUserPlanByAdmin(user.email, targetUid, newPlan);
            await fetchUsersPage(userPageIndex);
            setToastMessage("User plan changed successfully.");
        },
        simulateFailedPayment: async (targetUid: string, targetUserEmail: string) => {
            if (!user || !isAdmin) return;
            await simulateFailedPaymentForUser(user.email, targetUid, targetUserEmail);
            await getAdminNotifications().then(setAdminNotifications);
            setToastMessage(`Simulated a failed payment for ${targetUserEmail}.`);
        },
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
        const updatedUser = { ...user, plan: 'pro' as const };
        setUser(updatedUser);
        await updateUser(user.uid, { plan: 'pro' });
        await addTransactionToUser(user.uid, { description: 'HR CoPilot Pro Subscription (12 months)', amount: -74700 });
        setToastMessage("Success! Welcome to HR CoPilot Pro.");
        navigateTo('dashboard');
        setShowOnboardingWalkthrough(true);
    };
    
    const handleTopUpSuccess = async (amountInCents: number) => {
        if (!user) return;
        await addTransactionToUser(user.uid, { description: 'Credit Top-Up', amount: amountInCents });
        const updatedUser = await getUserProfile(user.uid);
        if(updatedUser) setUser(updatedUser);
        setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added.`);
        navigateTo('dashboard');
    };
    
    const handleDocumentGenerated = async (doc: GeneratedDocument, originalId?: string) => {
        if (!user) return;
        
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
            // Correctly lookup price for deduction based on plan
            if (user.plan === 'payg') {
                let price = 0;
                if (doc.kind === 'policy') {
                    price = POLICIES[doc.type as PolicyType]?.price || 0;
                } else {
                    price = FORMS[doc.type as FormType]?.price || 0;
                }

                if (price > 0) {
                    await addTransactionToUser(user.uid, { description: `Generated: ${doc.title}`, amount: -price });
                    const updatedUser = await getUserProfile(user.uid);
                    if(updatedUser) setUser(updatedUser);
                    setToastMessage("Document generated! Cost deducted from credit.");
                } else {
                     setToastMessage("Document generated successfully!");
                }
            } else {
                setToastMessage("Document generated successfully!");
            }
        }

        await saveGeneratedDocument(user.uid, docToSave);
        const updatedDocs = await getGeneratedDocuments(user.uid);
        setGeneratedDocuments(updatedDocs);
        navigateTo('dashboard');
    };

    const value: DataContextType = {
        generatedDocuments,
        userFiles,
        paginatedUsers: { data: paginatedUsers, pageInfo: { pageIndex: userPageIndex, pageSize: PAGE_SIZE, hasNextPage: userHasNextPage, dataLength: paginatedUsers.length } },
        handleNextUsers,
        handlePrevUsers,
        paginatedDocuments: { data: paginatedDocuments, pageInfo: { pageIndex: docPageIndex, pageSize: PAGE_SIZE, hasNextPage: docHasNextPage, dataLength: paginatedDocuments.length } },
        handleNextDocs,
        handlePrevDocs,
        transactionsForUserPage,
        paginatedLogs: { data: paginatedLogs, pageInfo: { pageIndex: logPageIndex, pageSize: PAGE_SIZE, hasNextPage: logHasNextPage, dataLength: paginatedLogs.length } },
        handleNextLogs,
        handlePrevLogs,
        adminNotifications,
        handleUpdateProfile,
        handleInitialProfileSubmit,
        handleProfilePhotoUpload,
        handleProfilePhotoDelete,
        handleFileUpload,
        handleFileDownload,
        handleDeleteUserFile,
        adminActions,
        handleMarkNotificationRead,
        handleMarkAllNotificationsRead,
        handleSubscriptionSuccess,
        handleTopUpSuccess,
        handleDocumentGenerated,
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
