import { supabase } from './supabase';
import type { 
    User, 
    GeneratedDocument, 
    Transaction, 
    AdminActionLog, 
    AdminNotification, 
    UserFile, 
    Coupon, 
    CompanyProfile, 
    PolicyDraft
} from '../types';

// --- User & Profile ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    // Fetch recent transactions (Limit 50 for performance)
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false })
        .limit(50);

    return {
        uid: profile.id,
        email: profile.email,
        name: profile.full_name,
        contactNumber: profile.contact_number,
        photoURL: profile.avatar_url,
        plan: profile.plan || 'payg',
        creditBalance: profile.credit_balance || 0,
        createdAt: profile.created_at,
        isAdmin: profile.is_admin,
        profile: {
            companyName: profile.company_name,
            industry: profile.industry,
            address: profile.address,
            companyUrl: profile.website,
            summary: profile.summary,
            companySize: profile.company_size,
        },
        transactions: transactions || [],
    };
};

export const createUserProfile = async (uid: string, email: string, plan: 'pro' | 'payg', name?: string, contactNumber?: string): Promise<User> => {
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: uid,
            email,
            plan,
            full_name: name,
            contact_number: contactNumber,
            credit_balance: 0,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;

    return {
        uid: data.id,
        email: data.email,
        name: data.full_name,
        contactNumber: data.contact_number,
        plan: data.plan,
        creditBalance: 0,
        createdAt: data.created_at,
        isAdmin: false,
        profile: { companyName: '', industry: '' },
        transactions: [],
    };
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.full_name = updates.name;
    if (updates.contactNumber !== undefined) dbUpdates.contact_number = updates.contactNumber;
    
    if (updates.profile) {
        if (updates.profile.companyName !== undefined) dbUpdates.company_name = updates.profile.companyName;
        if (updates.profile.industry !== undefined) dbUpdates.industry = updates.profile.industry;
        if (updates.profile.address !== undefined) dbUpdates.address = updates.profile.address;
        if (updates.profile.companyUrl !== undefined) dbUpdates.website = updates.profile.companyUrl;
        if (updates.profile.summary !== undefined) dbUpdates.summary = updates.profile.summary;
        if (updates.profile.companySize !== undefined) dbUpdates.company_size = updates.profile.companySize;
    }

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', uid);
    if (error) throw error;
};

// --- Documents ---

export const getGeneratedDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
    const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        kind: doc.kind,
        type: doc.type,
        content: doc.content,
        createdAt: doc.created_at,
        companyProfile: doc.company_profile,
        questionAnswers: doc.question_answers,
        outputFormat: doc.output_format,
        sources: doc.sources,
        version: doc.version,
        history: doc.history,
    }));
};

// Helper to check for valid UUID format
const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export const saveGeneratedDocument = async (uid: string, doc: GeneratedDocument): Promise<GeneratedDocument> => {
    const dbDoc: any = {
        user_id: uid,
        title: doc.title,
        kind: doc.kind,
        type: doc.type,
        content: doc.content,
        created_at: doc.createdAt,
        company_profile: doc.companyProfile,
        question_answers: doc.questionAnswers,
        output_format: doc.outputFormat,
        sources: doc.sources,
        version: doc.version,
        history: doc.history,
    };

    // If ID is a valid UUID, use it (update existing).
    // If it's a temp ID (e.g., 'policy-123'), exclude it to let DB generate a new UUID.
    if (doc.id && isValidUUID(doc.id)) {
        dbDoc.id = doc.id;
    }

    const { data, error } = await supabase
        .from('generated_documents')
        .upsert(dbDoc)
        .select()
        .single();

    if (error) throw error;

    // Return the saved document with the real DB ID
    return {
        ...doc,
        id: data.id,
        createdAt: data.created_at
    };
};

// --- Transactions & Credit ---

export const addTransactionToUser = async (uid: string, transaction: Partial<Transaction>, updateBalance: boolean = false) => {
    // 1. Insert Transaction
    const { error: txError } = await supabase.from('transactions').insert({
        user_id: uid,
        amount: transaction.amount,
        description: transaction.description,
        date: new Date().toISOString(),
    });
    
    if (txError) throw txError;

    // 2. Update Balance if requested (using RPC for safety)
    if (updateBalance && transaction.amount) {
        const { error: balanceError } = await supabase.rpc('increment_balance', {
            user_id: uid,
            amount: transaction.amount
        });
        if (balanceError) throw balanceError;
    }
};

// --- Admin Features (Pagination) ---

export const getAllUsers = async (pageSize: number, lastVisible?: number): Promise<{ data: User[], lastVisible: number | null }> => {
    let query = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(pageSize);
    
    // Note: Since we are using offset/limit in UI logic via pageIndex, we can also use range.
    // However, the context uses cursor logic. For Supabase simple pagination:
    if (lastVisible) {
        // This is a simplification. Ideally, use cursor based on created_at or id.
        // If the context passes a page offset as cursor, we can use range.
        // Assuming lastVisible passed here acts as an offset
        query = query.range(lastVisible, lastVisible + pageSize - 1);
    } else {
        query = query.range(0, pageSize - 1);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    const users = data.map((profile: any) => ({
        uid: profile.id,
        email: profile.email,
        name: profile.full_name,
        contactNumber: profile.contact_number,
        plan: profile.plan,
        creditBalance: profile.credit_balance,
        createdAt: profile.created_at,
        isAdmin: profile.is_admin,
        profile: { companyName: profile.company_name, industry: profile.industry }, // minimal for list
        transactions: [] // Don't fetch all tx for list view
    }));

    return { data: users, lastVisible: (lastVisible || 0) + pageSize };
};

export const getAllDocumentsForAllUsers = async (pageSize: number, lastVisible?: number): Promise<{ data: GeneratedDocument[], lastVisible: number | null }> => {
    let query = supabase.from('generated_documents').select('*').order('created_at', { ascending: false });
    
    const offset = lastVisible || 0;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error } = await query;
    if (error) throw error;

    const docs = data.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        kind: doc.kind,
        type: doc.type,
        content: doc.content,
        createdAt: doc.created_at,
        companyProfile: doc.company_profile,
        questionAnswers: doc.question_answers,
        version: doc.version,
    }));

    return { data: docs, lastVisible: offset + pageSize };
};

export const getAdminActionLogs = async (pageSize: number, lastVisible?: number): Promise<{ data: AdminActionLog[], lastVisible: number | null }> => {
    let query = supabase.from('admin_action_logs').select('*').order('created_at', { ascending: false });
    
    const offset = lastVisible || 0;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error } = await query;
    if (error) throw error;

    const logs = data.map((log: any) => ({
        id: log.id,
        timestamp: log.created_at,
        adminEmail: log.admin_email,
        action: log.action,
        targetUserId: log.target_user_id,
        targetUserEmail: log.target_user_email,
        details: log.details
    }));

    return { data: logs, lastVisible: offset + pageSize };
};

// --- Admin Actions ---

const logAdminAction = async (action: string, targetUid: string, details?: any) => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return;

    // Get target email for log clarity
    const { data: target } = await supabase.from('profiles').select('email').eq('id', targetUid).single();

    await supabase.from('admin_action_logs').insert({
        admin_email: user.email,
        action,
        target_user_id: targetUid,
        target_user_email: target?.email || 'Unknown',
        details
    });
};

export const updateUserByAdmin = async (adminEmail: string, targetUid: string, updates: Partial<User>) => {
    await updateUser(targetUid, updates);
    await logAdminAction('Updated User Profile', targetUid, updates);
};

export const adjustUserCreditByAdmin = async (adminEmail: string, targetUid: string, amountInCents: number, reason: string) => {
    await addTransactionToUser(targetUid, { description: `Admin Adjustment: ${reason}`, amount: amountInCents }, true);
    await logAdminAction('Adjusted Credit', targetUid, { amount: amountInCents, reason });
    return getUserProfile(targetUid);
};

export const changeUserPlanByAdmin = async (adminEmail: string, targetUid: string, newPlan: 'pro' | 'payg') => {
    await supabase.from('profiles').update({ plan: newPlan }).eq('id', targetUid);
    await logAdminAction('Changed Plan', targetUid, { to: newPlan });
};

export const grantProPlanByAdmin = async (adminEmail: string, targetUid: string) => {
    await supabase.from('profiles').update({ plan: 'pro' }).eq('id', targetUid);
    await addTransactionToUser(targetUid, { description: 'Pro Plan (Admin Grant)', amount: 0 }); // record 0 value tx
    await logAdminAction('Granted Pro Plan', targetUid);
};

export const simulateFailedPaymentForUser = async (adminEmail: string, targetUid: string, targetUserEmail: string) => {
    await supabase.from('admin_notifications').insert({
        type: 'payment_failed',
        message: `Payment failed for ${targetUserEmail}`,
        is_read: false,
        related_user_id: targetUid
    });
    await logAdminAction('Simulated Failed Payment', targetUid);
};

// --- Admin Notifications ---

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
    if (error) return [];
    
    return data.map((n: any) => ({
        id: n.id,
        timestamp: n.created_at,
        type: n.type,
        message: n.message,
        isRead: n.is_read,
        relatedUserId: n.related_user_id
    }));
};

export const markNotificationAsRead = async (id: string) => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id);
};

export const markAllNotificationsAsRead = async () => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false);
};

// --- User Files ---

export const getUserFiles = async (uid: string): Promise<UserFile[]> => {
    const { data, error } = await supabase.from('user_files').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (error) return [];
    
    return data.map((f: any) => ({
        id: f.id,
        name: f.name,
        notes: f.notes,
        size: f.size,
        storagePath: f.storage_path,
        createdAt: f.created_at
    }));
};

export const uploadUserFile = async (uid: string, file: File, notes: string) => {
    const path = `${uid}/${Date.now()}_${file.name}`;
    
    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage.from('user_docs').upload(path, file);
    if (uploadError) throw uploadError;

    // 2. Record in DB
    const { error: dbError } = await supabase.from('user_files').insert({
        user_id: uid,
        name: file.name,
        notes,
        size: file.size,
        storage_path: path
    });
    if (dbError) throw dbError;
};

export const getDownloadUrlForFile = async (path: string) => {
    const { data } = await supabase.storage.from('user_docs').createSignedUrl(path, 60); // 60 seconds link
    if (!data?.signedUrl) throw new Error("Could not generate link");
    return data.signedUrl;
};

export const deleteUserFile = async (uid: string, fileId: string, path: string) => {
    await supabase.storage.from('user_docs').remove([path]);
    await supabase.from('user_files').delete().eq('id', fileId);
};

// --- Profile Photo ---

export const uploadProfilePhoto = async (uid: string, file: File) => {
    const path = `${uid}/profile_photo`;
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', uid);
    return publicUrl;
};

export const deleteProfilePhoto = async (uid: string) => {
    const path = `${uid}/profile_photo`;
    await supabase.storage.from('avatars').remove([path]);
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', uid);
};

// --- Coupons ---

export const createCoupon = async (coupon: Partial<Coupon>) => {
    // Transform camelCase to snake_case for DB
    // IMPORTANT: Treat 'all' as null for DB storage to match schema pattern if desired, 
    // OR enforce string type in DB. Current schema allows text.
    const { error } = await supabase.from('coupons').insert({
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        max_uses: coupon.maxUses,
        applicable_to: coupon.applicableTo === 'all' ? null : coupon.applicableTo
    });
    if (error) throw error;
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) return [];
    
    return data.map((c: any) => ({
        id: c.id,
        code: c.code,
        discountType: c.discount_type,
        discountValue: c.discount_value,
        maxUses: c.max_uses,
        usedCount: c.used_count,
        expiryDate: c.expiry_date,
        active: c.active,
        applicableTo: c.applicable_to || 'all', // Map null back to 'all' for UI
        createdAt: c.created_at
    }));
};

export const deactivateCoupon = async (id: string) => {
    await supabase.from('coupons').update({ active: false }).eq('id', id);
};

export const validateCoupon = async (code: string, planType: 'pro' | 'payg'): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .single();

    if (error || !data) return { valid: false, message: 'Invalid or expired coupon.' };

    if (data.max_uses && data.used_count >= data.max_uses) {
        return { valid: false, message: 'Coupon usage limit reached.' };
    }

    // Check target audience. Null means "all".
    if (data.applicable_to && data.applicable_to !== `plan:${planType}`) {
        return { valid: false, message: 'Coupon not applicable for this plan.' };
    }

    const coupon: Coupon = {
        id: data.id,
        code: data.code,
        discountType: data.discount_type,
        discountValue: data.discount_value,
        maxUses: data.max_uses,
        usedCount: data.used_count,
        expiryDate: data.expiry_date,
        active: data.active,
        applicableTo: data.applicable_to || 'all',
        createdAt: data.created_at
    };

    return { valid: true, coupon };
};

// --- Drafts ---

export const savePolicyDraft = async (uid: string, draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<void> => {
    const data = {
        id: draft.id, // optional, upsert will generate if missing
        user_id: uid,
        original_doc_id: draft.originalDocId,
        original_doc_title: draft.originalDocTitle,
        original_content: draft.originalContent,
        update_result: draft.updateResult, // CRITICAL FIX: Was missing in previous version
        selected_indices: draft.selectedIndices,
        manual_instructions: draft.manualInstructions,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('policy_drafts').upsert(data);
    if (error) throw error;
};

export const getPolicyDrafts = async (uid: string): Promise<PolicyDraft[]> => {
    const { data, error } = await supabase.from('policy_drafts').select('*').eq('user_id', uid).order('updated_at', { ascending: false });
    if (error) return [];

    return data.map((d: any) => ({
        id: d.id,
        originalDocId: d.original_doc_id,
        originalDocTitle: d.original_doc_title,
        originalContent: d.original_content,
        updateResult: d.update_result,
        selectedIndices: d.selected_indices,
        manual_instructions: d.manual_instructions,
        updatedAt: d.updated_at,
        createdAt: d.created_at
    }));
};

export const deletePolicyDraft = async (id: string) => {
    const { error } = await supabase.from('policy_drafts').delete().eq('id', id);
    if (error) throw error;
};```tsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedDocument, CompanyProfile, User, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon, PolicyDraft } from '../types';
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
    deletePolicyDraft
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
    
    // Paginated Admin Data
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

    // Non-paginated admin data
    adminNotifications: AdminNotification[];
    coupons: Coupon[];
    
    // User Loading States
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
    };
    validateCoupon: (code: string, planType: 'pro' | 'payg') => Promise<{ valid: boolean; coupon?: Coupon; message?: string }>;
    handleMarkNotificationRead: (notificationId: string) => Promise<void>;
    handleMarkAllNotificationsRead: () => Promise<void>;
    handleSubscriptionSuccess: () => Promise<void>;
    handleTopUpSuccess: (amountInCents: number) => Promise<void>;
    handleDeductCredit: (amountInCents: number, description: string) => Promise<boolean>;
    handleDocumentGenerated: (doc: GeneratedDocument, originalId?: string) => Promise<void>;
    handleSaveDraft: (draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
    handleDeleteDraft: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, setUser, isAdmin, setNeedsOnboarding } = useAuthContext();
    const { setToastMessage, navigateTo, setShowOnboardingWalkthrough } = useUIContext();
    const { showConfirmationModal, hideConfirmationModal } = useModalContext();

    // User data
    const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
    const [userFiles, setUserFiles] = useState<UserFile[]>([]);
    const [policyDrafts, setPolicyDrafts] = useState<PolicyDraft[]>([]);
    const [isLoadingUserDocs, setIsLoadingUserDocs] = useState(true);
    const [isLoadingUserFiles, setIsLoadingUserFiles] = useState(true);

    // Admin data (paginated)
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
    
    // Admin data (non-paginated)
    const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

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
        if (pageIndex >= cursors.length) {
            console.warn(`Attempted to fetch page ${pageIndex} but cursor not found.`);
            return;
        }
        
        const cursor = cursors[pageIndex];
        if (cursor === undefined || cursor === null) {
             console.error("Cursor is invalid (undefined/null) for page", pageIndex);
             return;
        }

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
            console.error(`Pagination error (Page ${pageIndex}):`, err.message || err);
            if (pageIndex > 0) {
                setToastMessage("Failed to load next page.");
            } else {
                console.warn("Initial admin data fetch failed.");
            }
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
            (user.transactions || []).map(tx => ({
                ...tx,
                userEmail: user.email
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [paginatedUsers]);


    useEffect(() => {
        // Use user.uid for stability. The full 'user' object might change ref if updated (e.g. credit change)
        // causing unnecessary fetches. We only want to refetch if the USER IDENTITY changes or LOGIN happens.
        if (user && user.uid) {
            if (isAdmin) {
                if (userCursors.length > 0) fetchUsersPage(0).catch(e => console.error("Initial User Fetch Error", e));
                if (docCursors.length > 0) fetchDocsPage(0).catch(e => console.error("Initial Doc Fetch Error", e));
                if (logCursors.length > 0) fetchLogsPage(0).catch(e => console.error("Initial Log Fetch Error", e));
                
                getAdminNotifications().then(setAdminNotifications);
                getCoupons().then(setCoupons);
            } else {
                setIsLoadingUserDocs(true);
                getGeneratedDocuments(user.uid)
                    .then(docs => {
                        console.log(`Fetched ${docs.length} documents for user ${user.uid}`);
                        setGeneratedDocuments(docs);
                    })
                    .catch(err => {
                        console.error("Error fetching user documents:", err);
                        setToastMessage("Failed to load documents. Please check your connection.");
                    })
                    .finally(() => setIsLoadingUserDocs(false));
                
                setIsLoadingUserFiles(true);
                getUserFiles(user.uid)
                    .then(files => {
                        setUserFiles(files);
                    })
                    .catch(err => console.error("Error fetching user files:", err))
                    .finally(() => setIsLoadingUserFiles(false));

                getPolicyDrafts(user.uid)
                    .then(setPolicyDrafts)
                    .catch(err => console.error("Error fetching drafts:", err));
            }
        } else {
            // Logout / No User
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
    }, [user?.uid, isAdmin]); // Only re-run if UID or Admin status changes

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
        if(updatedUser) {
            setUser(updatedUser);
        } else {
            console.warn("Background profile sync failed");
        }
    };
    
    const handleTopUpSuccess = async (amountInCents: number) => {
        if (!user) return;
        setUser(prev => prev ? ({ ...prev, creditBalance: (prev.creditBalance || 0) + amountInCents }) : null);
        setToastMessage(`Success! R${(amountInCents / 100).toFixed(2)} has been added.`);
        navigateTo('dashboard');

        const updatedUser = await getUserProfile(user.uid);
        if(updatedUser) {
            setUser(updatedUser);
        } else {
            console.warn("Background profile sync failed");
        }
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
            setToastMessage("Document saved successfully!");
        }

        try {
            // Save to DB and get real ID back
            const savedDoc = await saveGeneratedDocument(user.uid, docToSave);
            
            // OPTIMISTIC UPDATE with correct ID from DB
            setGeneratedDocuments(prevDocs => {
                if (originalId) {
                    return prevDocs.map(d => d.id === originalId ? savedDoc : d);
                } else {
                    return [savedDoc, ...prevDocs];
                }
            });
        } catch (error) {
            console.error("Failed to save document:", error);
            setToastMessage("Error saving document to database.");
        }
        
        navigateTo('dashboard');
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