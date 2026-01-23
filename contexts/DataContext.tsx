
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { GeneratedDocument, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon, PolicyDraft, Policy, Form, InvoiceRequest } from '../types';
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
    validateCoupon as validateCouponInDb,
    savePolicyDraft,
    getPolicyDrafts,
    deletePolicyDraft,
    getPricingSettings,
    updateProPrice,
    updateDocumentPrice,
    searchUsers,
    saveWaitlistLead,
    getWaitlistLeads,
    logMarketingEvent,
    getSupportTickets,
    updateSupportTicketStatus,
    getOpenInvoiceRequests
} from '../services/dbService';
import { supabase } from '../services/supabase';
import { useAuthContext } from './AuthContext';
import { useUIContext } from './UIContext';
import { useModalContext } from './ModalContext';
import { emailService } from '../services/emailService';

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
    handleDocumentGenerated: (doc: GeneratedDocument, originalId?: string, shouldNavigate?: boolean) => Promise<GeneratedDocument | undefined>;
    handleSaveDraft: (draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
    handleDeleteDraft: (id: string) => Promise<void>;
    handleSearchUsers: (query: string) => Promise<void>;
    handleRunRetentionCheck: () => Promise<any>;
    handleWaitlistSignup: (name: string, email: string) => Promise<void>;
    logMarketingEvent: (eventType: string, metadata?: any) => Promise<void>;
    proPlanPrice: number;
    getDocPrice: (item: Policy | Form) => number;
    waitlistLeads: any[];
    paginatedSupportTickets: { data: any[]; pageInfo: PageInfo };
    handleNextSupport: () => void;
    handlePrevSupport: () => void;
    isFetchingSupport: boolean;
    handleUpdateSupportStatus: (ticketId: string, status: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, isAdmin, setNeedsOnboarding, realConsultantUser } = useAuthContext();
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
    const [proPlanPrice, setProPlanPrice] = useState(74700);
    const [docPriceMap, setDocPriceMap] = useState<Record<string, number>>({});
    const [waitlistLeads, setWaitlistLeads] = useState<any[]>([]);
    const [paginatedSupportTickets, setPaginatedSupportTickets] = useState<any[]>([]);
    const [supportCursors, setSupportCursors] = useState<number[]>([0]);
    const [supportPageIndex, setSupportPageIndex] = useState(0);
    const [supportHasNextPage, setSupportHasNextPage] = useState(true);
    const [isFetchingSupport, setIsFetchingSupport] = useState(false);

    const createPageFetcher = useCallback((
        fetchFn: (pageSize: number, cursor?: number) => Promise<{ data: any[], lastVisible: number | null }>,
        setData: React.Dispatch<React.SetStateAction<any[]>>,
        setCursors: React.Dispatch<React.SetStateAction<number[]>>,
        setPageIndex: React.Dispatch<React.SetStateAction<number>>,
        setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        cursorsRef: React.MutableRefObject<number[]>
    ) => async (pageIndex: number) => {
        if (pageIndex < 0 || pageIndex >= cursorsRef.current.length) return;
        const cursor = cursorsRef.current[pageIndex];
        setLoading(true);
        try {
            const { data, lastVisible } = await fetchFn(PAGE_SIZE, cursor);
            setData(data || []);
            setPageIndex(pageIndex);
            if (pageIndex === cursorsRef.current.length - 1) {
                if (lastVisible !== null && data && data.length === PAGE_SIZE) {
                    if (!cursorsRef.current.includes(lastVisible)) {
                        cursorsRef.current.push(lastVisible);
                        setCursors([...cursorsRef.current]);
                    }
                    setHasNextPage(true);
                } else {
                    setHasNextPage(false);
                }
            } else {
                setHasNextPage(pageIndex < cursorsRef.current.length - 1);
            }
        } catch (err) {
            console.error("Pagination error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const userCursorsRef = useRef<number[]>([0]);
    const fetchUsersPage = useCallback(createPageFetcher(getAllUsers, setPaginatedUsers, setUserCursors, setUserPageIndex, setUserHasNextPage, setIsFetchingUsers, userCursorsRef), [createPageFetcher]);
    const docCursorsRef = useRef<number[]>([0]);
    const fetchDocsPage = useCallback(createPageFetcher(getAllDocumentsForAllUsers, setPaginatedDocuments, setDocCursors, setDocPageIndex, setDocHasNextPage, setIsFetchingDocs, docCursorsRef), [createPageFetcher]);
    const logCursorsRef = useRef<number[]>([0]);
    const fetchLogsPage = useCallback(createPageFetcher(getAdminActionLogs, setPaginatedLogs, setLogCursors, setLogPageIndex, setLogHasNextPage, setIsFetchingLogs, logCursorsRef), [createPageFetcher]);
    const supportCursorsRef = useRef<number[]>([0]);
    const fetchSupportPage = useCallback(createPageFetcher(getSupportTickets as any, setPaginatedSupportTickets, setSupportCursors, setSupportPageIndex, setSupportHasNextPage, setIsFetchingSupport, supportCursorsRef), [createPageFetcher]);

    const handleNextUsers = useCallback(() => { if (userHasNextPage) fetchUsersPage(userPageIndex + 1); }, [userHasNextPage, fetchUsersPage, userPageIndex]);
    const handlePrevUsers = useCallback(() => { if (userPageIndex > 0) fetchUsersPage(userPageIndex - 1); }, [userPageIndex, fetchUsersPage]);
    const handleNextDocs = useCallback(() => { if (docHasNextPage) fetchDocsPage(docPageIndex + 1); }, [docHasNextPage, fetchDocsPage, docPageIndex]);
    const handlePrevDocs = useCallback(() => { if (docPageIndex > 0) fetchDocsPage(docPageIndex - 1); }, [docPageIndex, fetchDocsPage]);
    const handleNextLogs = useCallback(() => { if (logHasNextPage) fetchLogsPage(logPageIndex + 1); }, [logHasNextPage, fetchLogsPage, logPageIndex]);
    const handlePrevLogs = useCallback(() => { if (logPageIndex > 0) fetchLogsPage(logPageIndex - 1); }, [logPageIndex, fetchLogsPage]);
    const handleNextSupport = useCallback(() => { if (supportHasNextPage) fetchSupportPage(supportPageIndex + 1); }, [supportHasNextPage, fetchSupportPage, supportPageIndex]);
    const handlePrevSupport = useCallback(() => { if (supportPageIndex > 0) fetchSupportPage(supportPageIndex - 1); }, [supportPageIndex, fetchSupportPage]);

    const transactionsForUserPage = useMemo(() => {
        return paginatedUsers.flatMap(user =>
            (user.transactions || []).map(tx => ({ ...tx, userEmail: user.email }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [paginatedUsers]);

    useEffect(() => {
        const loadPricing = async () => {
            try {
                const { settings, docPrices } = await getPricingSettings();
                const proSetting = settings.find((s: any) => s.key === 'pro_plan_yearly');
                if (proSetting) setProPlanPrice(proSetting.value);
                const priceMap: Record<string, number> = {};
                docPrices.forEach((dp: any) => { priceMap[dp.doc_type] = dp.price; });
                setDocPriceMap(priceMap);
                if (user?.isAdmin) {
                    const leads = await getWaitlistLeads();
                    setWaitlistLeads(leads);
                }
            } catch (error) { console.error(error); }
        };
        loadPricing();
    }, [user?.isAdmin]);

    useEffect(() => {
        if (!user?.uid) {
            setGeneratedDocuments([]); setUserFiles([]); setPolicyDrafts([]); setPaginatedUsers([]); setPaginatedDocuments([]); setPaginatedLogs([]); setAdminNotifications([]); setCoupons([]); setIsLoadingUserDocs(false); setIsLoadingUserFiles(false);
            return;
        }
        if (isAdmin) {
            if (paginatedUsers.length === 0 && !isFetchingUsers) fetchUsersPage(0);
            if (paginatedDocuments.length === 0 && !isFetchingDocs) fetchDocsPage(0);
            if (paginatedLogs.length === 0 && !isFetchingLogs) fetchLogsPage(0);
            if (paginatedSupportTickets.length === 0 && !isFetchingSupport) fetchSupportPage(0);
            getAdminNotifications().then(setAdminNotifications);
            getCoupons().then(setCoupons);
        } else {
            setIsLoadingUserDocs(true);
            getGeneratedDocuments(user.uid).then(docs => { setGeneratedDocuments(docs); setIsLoadingUserDocs(false); });
            setIsLoadingUserFiles(true);
            getUserFiles(user.uid).then(files => { setUserFiles(files); setIsLoadingUserFiles(false); });
            getPolicyDrafts(user.uid).then(setPolicyDrafts);
        }
    }, [user?.uid, isAdmin, fetchUsersPage, fetchDocsPage, fetchLogsPage, fetchSupportPage, isFetchingUsers, isFetchingDocs, isFetchingLogs, isFetchingSupport, paginatedUsers.length, paginatedDocuments.length, paginatedLogs.length, paginatedSupportTickets.length]);

    const handleUpdateProfile = useCallback(async (data: { profile: CompanyProfile; name?: string; contactNumber?: string }) => {
        if (!user) return;
        const updates = { ...data, profile: { ...user.profile, ...data.profile } };
        setUser({ ...user, ...updates });
        await updateUser(user.uid, updates as any);
        setToastMessage("Profile updated.");
    }, [user, setUser, setToastMessage]);

    const handleInitialProfileSubmit = useCallback(async (profile: CompanyProfile, name: string) => {
        if (!user) return;
        setUser({ ...user, name, profile });
        await updateUser(user.uid, { name, profile });
        setNeedsOnboarding(false);
        setShowOnboardingWalkthrough(true);
    }, [user, setUser, setNeedsOnboarding, setShowOnboardingWalkthrough]);

    const handleProfilePhotoUpload = useCallback(async (file: File) => {
        if (!user) return;
        const url = await uploadProfilePhoto(user.uid, file);
        setUser({ ...user, photoURL: url });
        setToastMessage("Photo updated.");
    }, [user, setUser, setToastMessage]);

    const handleProfilePhotoDelete = useCallback(async () => {
        if (!user) return;
        await deleteProfilePhoto(user.uid);
        const u = { ...user }; delete u.photoURL; setUser(u);
        setToastMessage("Photo deleted.");
    }, [user, setUser, setToastMessage]);

    const handleFileUpload = useCallback(async (file: File, notes: string) => {
        if (!user) return;
        await uploadUserFile(user.uid, file, notes);
        setUserFiles(await getUserFiles(user.uid));
        setToastMessage("File uploaded.");
    }, [user, setToastMessage]);

    const handleFileDownload = useCallback(async (path: string) => {
        window.open(await getDownloadUrlForFile(path), '_blank');
    }, []);

    const handleDeleteUserFile = useCallback((id: string, path: string) => {
        showConfirmationModal({
            title: "Delete File",
            message: "Permanent delete?",
            onConfirm: async () => {
                hideConfirmationModal();
                await deleteUserFile(user!.uid, id, path);
                setUserFiles(prev => prev.filter(f => f.id !== id));
                setToastMessage("Deleted.");
            }
        });
    }, [user, showConfirmationModal, hideConfirmationModal, setToastMessage]);

    const adminActions = useMemo(() => ({
        updateUser: async (tid: string, u: any) => { await updateUserByAdmin(user!.email, tid, u); fetchUsersPage(userPageIndex); setToastMessage("Updated."); },
        adjustCredit: async (tid: string, a: number, r: string) => {
            const upd = await adjustUserCreditByAdmin(user!.email, tid, a, r);
            if (upd) setPaginatedUsers(prev => prev.map(x => x.uid === tid ? upd : x));
            else fetchUsersPage(userPageIndex);
            setToastMessage("Adjusted.");
        },
        changePlan: async (tid: string, p: any) => { await changeUserPlanByAdmin(user!.email, tid, p); fetchUsersPage(userPageIndex); setToastMessage("Plan changed."); },
        grantPro: async (tid: string) => { await grantProPlanByAdmin(user!.email, tid); fetchUsersPage(userPageIndex); setToastMessage("Granted."); },
        simulateFailedPayment: async (tid: string, e: string) => { await simulateFailedPaymentForUser(user!.email, tid, e); getAdminNotifications().then(setAdminNotifications); setToastMessage("Simulated."); },
        createCoupon: async (d: any) => { await createCoupon(d); getCoupons().then(setCoupons); setToastMessage("Created."); },
        deactivateCoupon: async (id: string) => { await deactivateCoupon(id); getCoupons().then(setCoupons); setToastMessage("Deactivated."); },
        setProPrice: async (p: number) => { await updateProPrice(p); setProPlanPrice(p); setToastMessage("Price updated."); },
        setDocPrice: async (t: string, p: number, c: any) => { await updateDocumentPrice(t, p, c); setDocPriceMap(prev => ({ ...prev, [t]: p })); setToastMessage("Price updated."); }
    }), [user, fetchUsersPage, userPageIndex, setToastMessage]);

    const validateCoupon = useCallback((code: string, type: any) => validateCouponInDb(code, type), []);
    const handleMarkNotificationRead = useCallback(async (id: string) => { await markNotificationAsRead(id); getAdminNotifications().then(setAdminNotifications); }, []);
    const handleMarkAllNotificationsRead = useCallback(async () => { await markAllNotificationsAsRead(); getAdminNotifications().then(setAdminNotifications); }, []);
    const handleSubscriptionSuccess = useCallback(async () => {
        setUser(prev => prev ? ({ ...prev, plan: 'pro' }) : null); setToastMessage("Welcome to Pro!"); navigateTo('dashboard'); setShowOnboardingWalkthrough(true);
        const updated = await getUserProfile(user!.uid); if (updated) setUser(updated);
    }, [user, setUser, setToastMessage, navigateTo, setShowOnboardingWalkthrough]);

    const handleTopUpSuccess = useCallback(async (a: number) => {
        setUser(prev => prev ? ({ ...prev, creditBalance: (prev.creditBalance || 0) + a }) : null); setToastMessage("Credits added."); navigateTo('dashboard');
        const updated = await getUserProfile(user!.uid); if (updated) setUser(updated);
    }, [user, setUser, setToastMessage, navigateTo]);

    const handleDeductCredit = useCallback(async (a: number, d: string) => {
        if (!user || user.creditBalance < a) return false;
        setUser(prev => prev ? ({ ...prev, creditBalance: prev.creditBalance - a }) : null);
        await addTransactionToUser(user.uid, { description: d, amount: -a, actorId: realConsultantUser?.uid, actorEmail: realConsultantUser?.email }, true);
        const updated = await getUserProfile(user.uid); if (updated) setUser(updated);
        return true;
    }, [user, setUser, realConsultantUser]);

    const handleDocumentGenerated = useCallback(async (doc: GeneratedDocument, oid?: string, nav = true) => {
        if (!user) return;
        const saved = await saveGeneratedDocument(user.uid, { ...doc, metadata: realConsultantUser ? { actor_id: realConsultantUser.uid } : undefined } as any);
        setGeneratedDocuments(prev => oid ? prev.map(x => x.id === oid ? saved : x) : [saved, ...prev]);
        if (nav) navigateTo('dashboard');
        return saved;
    }, [user, realConsultantUser, navigateTo]);

    const handleSaveDraft = useCallback(async (d: any) => { await savePolicyDraft(user!.uid, d); setPolicyDrafts(await getPolicyDrafts(user!.uid)); setToastMessage("Draft saved."); }, [user, setToastMessage]);
    const handleDeleteDraft = useCallback(async (id: string) => { await deletePolicyDraft(id); setPolicyDrafts(prev => prev.filter(x => x.id !== id)); }, [user]);

    const lastQ = useRef<string | null>(null);
    const handleSearchUsers = useCallback(async (q: string) => {
        if (q === lastQ.current) return; lastQ.current = q; setIsFetchingUsers(true);
        try { setPaginatedUsers(await searchUsers(q)); setUserHasNextPage(false); } finally { setIsFetchingUsers(false); }
    }, []);

    const handleRunRetentionCheck = useCallback(() => supabase.functions.invoke('check-inactivity').then(r => r.data), []);
    const handleWaitlistSignup = useCallback(async (n: string, e: string) => { await saveWaitlistLead({ name: n, email: e }); await emailService.sendWaitlistWelcome(e, n); }, []);
    const handleLogMarketingEvent = useCallback((t: string, m: any) => logMarketingEvent(user?.uid, t, m), [user?.uid]);
    const getDocPrice = useCallback((i: any) => docPriceMap[i.type] || i.price, [docPriceMap]);
    const handleUpdateSupportStatus = useCallback(async (id: string, s: any) => { await updateSupportTicketStatus(id, s); setPaginatedSupportTickets(prev => prev.map(x => x.id === id ? { ...x, status: s } : x)); }, []);

    const value = useMemo(() => ({
        generatedDocuments, userFiles, policyDrafts, paginatedUsers: { data: paginatedUsers, pageInfo: { pageIndex: userPageIndex, pageSize: PAGE_SIZE, hasNextPage: userHasNextPage, dataLength: paginatedUsers.length } },
        handleNextUsers, handlePrevUsers, isFetchingUsers, paginatedDocuments: { data: paginatedDocuments, pageInfo: { pageIndex: docPageIndex, pageSize: PAGE_SIZE, hasNextPage: docHasNextPage, dataLength: paginatedDocuments.length } },
        handleNextDocs, handlePrevDocs, isFetchingDocs, transactionsForUserPage, paginatedLogs: { data: paginatedLogs, pageInfo: { pageIndex: logPageIndex, pageSize: PAGE_SIZE, hasNextPage: logHasNextPage, dataLength: paginatedLogs.length } },
        handleNextLogs, handlePrevLogs, isFetchingLogs, adminNotifications, coupons, isLoadingUserDocs, isLoadingUserFiles,
        handleUpdateProfile, handleInitialProfileSubmit, handleProfilePhotoUpload, handleProfilePhotoDelete, handleFileUpload, handleFileDownload, handleDeleteUserFile,
        adminActions, validateCoupon, handleMarkNotificationRead, handleMarkAllNotificationsRead, handleSubscriptionSuccess, handleTopUpSuccess, handleDeductCredit,
        handleDocumentGenerated, handleSaveDraft, handleDeleteDraft, handleSearchUsers, handleRunRetentionCheck, handleWaitlistSignup, logMarketingEvent: handleLogMarketingEvent,
        proPlanPrice, getDocPrice, waitlistLeads, paginatedSupportTickets: { data: paginatedSupportTickets, pageInfo: { pageIndex: supportPageIndex, pageSize: PAGE_SIZE, hasNextPage: supportHasNextPage, dataLength: paginatedSupportTickets.length } },
        handleNextSupport, handlePrevSupport, isFetchingSupport, handleUpdateSupportStatus
    }), [
        generatedDocuments, userFiles, policyDrafts, paginatedUsers, userPageIndex, userHasNextPage, isFetchingUsers, paginatedDocuments, docPageIndex, docHasNextPage, isFetchingDocs,
        transactionsForUserPage, paginatedLogs, logPageIndex, logHasNextPage, isFetchingLogs, adminNotifications, coupons, isLoadingUserDocs, isLoadingUserFiles,
        handleUpdateProfile, handleInitialProfileSubmit, handleProfilePhotoUpload, handleProfilePhotoDelete, handleFileUpload, handleFileDownload, handleDeleteUserFile,
        adminActions, validateCoupon, handleMarkNotificationRead, handleMarkAllNotificationsRead, handleSubscriptionSuccess, handleTopUpSuccess, handleDeductCredit,
        handleDocumentGenerated, handleSaveDraft, handleDeleteDraft, handleSearchUsers, handleRunRetentionCheck, handleWaitlistSignup, handleLogMarketingEvent,
        proPlanPrice, getDocPrice, waitlistLeads, paginatedSupportTickets, supportPageIndex, supportHasNextPage, isFetchingSupport, handleUpdateSupportStatus
    ]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useDataContext must be used within DataProvider');
    return context;
};
