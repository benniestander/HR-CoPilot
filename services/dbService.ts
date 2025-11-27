
import { supabase } from './supabase';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, UserFile, CompanyProfile, Coupon, PolicyDraft } from '../types';

// --- Helpers for Type Mapping (Snake Case <-> Camel Case) ---

const mapProfileToUser = (profile: any, transactions: any[] = []): User => ({
    uid: profile.id,
    email: profile.email,
    name: profile.full_name || '',
    contactNumber: profile.contact_number || '',
    plan: profile.plan as 'payg' | 'pro',
    creditBalance: Number(profile.credit_balance || 0), // Ensure it's a number
    isAdmin: profile.is_admin,
    photoURL: profile.avatar_url,
    createdAt: profile.created_at,
    profile: {
        companyName: profile.company_name || '',
        industry: profile.industry || '',
        companySize: profile.company_size,
        address: profile.company_address,
        companyUrl: profile.company_url,
        summary: profile.company_summary,
    },
    transactions: transactions.map(mapTransaction)
});

const mapTransaction = (tx: any): Transaction => ({
    id: tx.id,
    date: tx.date,
    description: tx.description,
    amount: Number(tx.amount), // Ensure number
    userId: tx.user_id,
});

const mapDocument = (doc: any): GeneratedDocument => ({
    id: doc.id,
    title: doc.title,
    kind: doc.kind,
    type: doc.type,
    content: doc.content,
    createdAt: doc.created_at,
    companyProfile: {
       companyName: '', 
       industry: '',
       ...(doc.question_answers || {}) // Safe spread even if null
    },
    questionAnswers: doc.question_answers || {},
    outputFormat: doc.output_format,
    sources: doc.sources || [],
    version: doc.version,
    history: doc.history || []
});

const mapCoupon = (c: any): Coupon => ({
    id: c.id,
    code: c.code,
    discountType: c.discount_type,
    discountValue: c.discount_value,
    maxUses: c.max_uses,
    usedCount: c.used_count,
    expiryDate: c.expiry_date,
    active: c.active,
    applicableTo: c.applicable_to || 'all',
    createdAt: c.created_at
});

const mapDraft = (d: any): PolicyDraft => ({
    id: d.id,
    originalDocId: d.original_doc_id,
    originalDocTitle: d.original_doc_title,
    originalContent: d.original_content,
    updateResult: d.update_result,
    selectedIndices: d.selected_indices || [],
    manualInstructions: d.manual_instructions,
    createdAt: d.created_at,
    updatedAt: d.updated_at
});

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

    if (error || !profile) return null;

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false })
        .limit(50); // PERFORMANCE: Limit to latest 50 transactions

    return mapProfileToUser(profile, transactions || []);
};

export const createUserProfile = async (
    uid: string,
    email: string,
    plan: 'payg' | 'pro',
    name?: string,
    contactNumber?: string
): Promise<User> => {
    const { data: existing } = await supabase.from('profiles').select('*').eq('id', uid).single();
    
    if (existing) {
        return mapProfileToUser(existing);
    }

    const newProfile = {
        id: uid,
        email,
        full_name: name || '',
        contact_number: contactNumber || '',
        plan,
        credit_balance: 0,
        is_admin: false,
        created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').insert(newProfile);

    if (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }

    // Notify admin
    if (email !== 'admin@hrcopilot.co.za') {
        await createAdminNotification({
            type: 'new_user',
            message: `New ${plan.toUpperCase()} user signed up: ${email}`,
            relatedUserId: uid,
        });
    }

    return mapProfileToUser(newProfile, []);
};

export const updateUser = async (uid: string, userData: Partial<User> & { name?: string; contactNumber?: string }): Promise<void> => {
    const updates: any = {};
    
    if (userData.name !== undefined) updates.full_name = userData.name;
    if (userData.contactNumber !== undefined) updates.contact_number = userData.contactNumber;
    if (userData.plan) updates.plan = userData.plan;
    if (userData.photoURL) updates.avatar_url = userData.photoURL;
    if (userData.isAdmin !== undefined) updates.is_admin = userData.isAdmin;
    
    if (userData.profile) {
        if (userData.profile.companyName) updates.company_name = userData.profile.companyName;
        if (userData.profile.industry) updates.industry = userData.profile.industry;
        if (userData.profile.companySize) updates.company_size = userData.profile.companySize;
        if (userData.profile.address) updates.company_address = userData.profile.address;
        if (userData.profile.companyUrl) updates.company_url = userData.profile.companyUrl;
        if (userData.profile.summary) updates.company_summary = userData.profile.summary;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', uid);
    if (error) throw error;
};

/**
 * Adds a transaction and optionally updates the user's credit balance.
 * @param uid User ID
 * @param transaction Transaction details
 * @param shouldUpdateBalance If true, the amount is added to the user's credit_balance. 
 *                            Set to FALSE for subscription payments or admin grants that shouldn't affect PAYG credit.
 */
export const addTransactionToUser = async (
    uid: string, 
    transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'userEmail'>,
    shouldUpdateBalance: boolean = true
): Promise<void> => {
    
    let finalAmount = Number(transaction.amount);

    // 1. Insert Transaction
    const { error: txError } = await supabase.from('transactions').insert({
        user_id: uid,
        amount: finalAmount,
        description: transaction.description,
        date: new Date().toISOString()
    });

    if (txError) throw txError;

    // 2. Update User Balance (If flag is true) using Atomic RPC
    if (shouldUpdateBalance) {
        const { error } = await supabase.rpc('increment_balance', { 
            user_id: uid, 
            amount: finalAmount 
        });

        if (error) {
            console.error("Error updating balance via RPC:", error);
            throw new Error("Failed to update credit balance. Please contact support.");
        }
    }
};


// --- Generated Document Functions ---

export const getGeneratedDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
    const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

    if (error) return [];
    
    return data.map(d => {
        const doc = mapDocument(d);
        if (d.question_answers && d.question_answers.companyName) {
             doc.companyProfile = d.question_answers as CompanyProfile;
        }
        return doc;
    });
};

export const saveGeneratedDocument = async (uid: string, docData: GeneratedDocument): Promise<void> => {
    const combinedData = {
        ...docData.questionAnswers,
        ...docData.companyProfile
    };

    const dataToSave = {
        id: docData.id.length < 30 ? undefined : docData.id,
        user_id: uid,
        title: docData.title,
        kind: docData.kind,
        type: docData.type,
        content: docData.content,
        question_answers: combinedData,
        output_format: docData.outputFormat,
        sources: docData.sources,
        version: docData.version,
        history: docData.history,
        created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('generated_documents').upsert(dataToSave);
    if (error) throw error;
};

// --- Draft Functions ---

export const savePolicyDraft = async (uid: string, draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<void> => {
    const data = {
        id: draft.id,
        user_id: uid,
        original_doc_id: draft.originalDocId,
        original_doc_title: draft.originalDocTitle,
        original_content: draft.originalContent,
        update_result: draft.updateResult,
        selected_indices: draft.selectedIndices,
        manual_instructions: draft.manualInstructions,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('policy_drafts').upsert(data);
    if (error) throw error;
};

export const getPolicyDrafts = async (uid: string): Promise<PolicyDraft[]> => {
    const { data, error } = await supabase
        .from('policy_drafts')
        .select('*')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false });

    if (error) return [];
    return data.map(mapDraft);
};

export const deletePolicyDraft = async (id: string): Promise<void> => {
    const { error } = await supabase.from('policy_drafts').delete().eq('id', id);
    if (error) throw error;
};


// --- Admin Functions ---

const logAdminAction = async (action: Omit<AdminActionLog, 'id' | 'timestamp'>) => {
    await supabase.from('admin_action_logs').insert({
        admin_email: action.adminEmail,
        action: action.action,
        target_user_id: action.targetUserId,
        target_user_email: action.targetUserEmail,
        details: action.details,
        timestamp: new Date().toISOString()
    });
};

export const updateUserByAdmin = async (adminEmail: string, targetUid: string, updates: Partial<User>): Promise<User | null> => {
    await updateUser(targetUid, updates);
    
    const user = await getUserProfile(targetUid);
    
    await logAdminAction({
        adminEmail,
        action: 'Updated User Profile',
        targetUserId: targetUid,
        targetUserEmail: user?.email || 'Unknown',
        details: { updates }
    });

    return user;
};

export const adjustUserCreditByAdmin = async (adminEmail: string, targetUid: string, amountInCents: number, reason: string): Promise<User | null> => {
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    // Add transaction AND update balance (true)
    await addTransactionToUser(targetUid, {
        description: `Admin adjustment: ${reason}`,
        amount: amountInCents,
    }, true);

    await logAdminAction({
        adminEmail,
        action: 'Adjusted User Credit',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { amountInCents, reason }
    });

    // Return the fresh profile to update UI
    return await getUserProfile(targetUid);
};

export const changeUserPlanByAdmin = async (adminEmail: string, targetUid: string, newPlan: 'pro' | 'payg'): Promise<User | null> => {
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    const oldPlan = user.plan;
    await supabase.from('profiles').update({ plan: newPlan }).eq('id', targetUid);

    if (newPlan === 'pro') {
        // Pro Plan Grant - Log transaction but DO NOT update credit balance (false)
        await addTransactionToUser(targetUid, {
            description: 'Pro Plan (Admin Grant)',
            amount: 0
        }, false);
    }

    await logAdminAction({
        adminEmail,
        action: 'Changed User Plan',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { from: oldPlan, to: newPlan }
    });
    
    return await getUserProfile(targetUid);
};

export const grantProPlanByAdmin = async (adminEmail: string, targetUid: string): Promise<User | null> => {
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    // Ensure plan is set to pro
    await supabase.from('profiles').update({ plan: 'pro' }).eq('id', targetUid);

    // Add transaction for record keeping - DO NOT update credit balance (false)
    await addTransactionToUser(targetUid, {
        description: 'Free Pro Plan (12 Months - Admin Gift)',
        amount: 0
    }, false);

    await logAdminAction({
        adminEmail,
        action: 'Granted Free Pro Plan',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { duration: '12 months' }
    });
    
    return await getUserProfile(targetUid);
};

export const simulateFailedPaymentForUser = async (adminEmail: string, targetUid: string, targetUserEmail: string): Promise<void> => {
    if (targetUserEmail === 'admin@hrcopilot.co.za') return;
    await createAdminNotification({
        type: 'payment_failed',
        message: `A payment simulation failed for user ${targetUserEmail}.`,
        relatedUserId: targetUid,
    });
    await logAdminAction({
        adminEmail,
        action: 'Simulated Failed Payment',
        targetUserId: targetUid,
        targetUserEmail: targetUserEmail,
        details: { simulation: true }
    });
};

// --- Notifications ---

export const createAdminNotification = async (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>): Promise<void> => {
    await supabase.from('admin_notifications').insert({
        type: notification.type,
        message: notification.message,
        related_user_id: notification.relatedUserId,
        is_read: false,
        timestamp: new Date().toISOString()
    });
};

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('timestamp', { ascending: false });
    
    if (error) return [];
    
    return data.map((n: any) => ({
        id: n.id,
        type: n.type,
        message: n.message,
        isRead: n.is_read,
        relatedUserId: n.related_user_id,
        timestamp: n.timestamp
    }));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('id', notificationId);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false);
};

// --- Coupons ---

export const createCoupon = async (couponData: Partial<Coupon>): Promise<void> => {
    // Ensure admin status using secure function before writing
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) throw new Error("Permission denied: You must be an admin to create coupons.");

    const newCoupon = {
        code: couponData.code,
        discount_type: couponData.discountType,
        discount_value: couponData.discountValue,
        max_uses: couponData.maxUses || null,
        expiry_date: couponData.expiryDate || null,
        applicable_to: couponData.applicableTo === 'all' ? null : couponData.applicableTo,
        active: true
    };

    const { error } = await supabase.from('coupons').insert(newCoupon);
    if (error) throw error;
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map(mapCoupon);
};

export const deactivateCoupon = async (id: string): Promise<void> => {
    await supabase.from('coupons').update({ active: false }).eq('id', id);
};

export const validateCoupon = async (code: string, planType: 'pro' | 'payg'): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    const { data, error } = await supabase.from('coupons').select('*').eq('code', code).single();
    
    if (error || !data) return { valid: false, message: 'Invalid coupon code.' };
    
    const coupon = mapCoupon(data);

    if (!coupon.active) return { valid: false, message: 'This coupon is inactive.' };
    
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return { valid: false, message: 'This coupon has expired.' };
    }
    
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return { valid: false, message: 'This coupon has reached its usage limit.' };
    }

    if (coupon.applicableTo !== 'all' && coupon.applicableTo !== `plan:${planType}`) {
        return { valid: false, message: `This coupon is not applicable to ${planType === 'pro' ? 'Pro subscriptions' : 'credit top-ups'}.` };
    }

    return { valid: true, coupon };
};


// --- Pagination Wrappers for Admin ---

export const getAllUsers = async (pageSize: number, cursor?: any): Promise<{ data: User[], lastVisible: any }> => {
    const offset = cursor || 0;
    const { data, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(offset, offset + pageSize - 1)
        .order('created_at', { ascending: false });

    if (error) return { data: [], lastVisible: null };

    const users = data.map(p => mapProfileToUser(p));
    return { data: users, lastVisible: offset + pageSize };
};

export const getAllDocumentsForAllUsers = async (pageSize: number, cursor?: any): Promise<{ data: GeneratedDocument[], lastVisible: any }> => {
    const offset = cursor || 0;
    const { data, error } = await supabase
        .from('generated_documents')
        .select(`
            *,
            profiles ( company_name )
        `)
        .range(offset, offset + pageSize - 1)
        .order('created_at', { ascending: false });
    
    if (error) return { data: [], lastVisible: null };

    const docs = data.map(d => {
        const doc = mapDocument(d);
        if ((d as any).profiles) {
             doc.companyProfile = { companyName: (d as any).profiles.company_name, industry: '' };
        }
        return doc;
    });

    return { data: docs, lastVisible: offset + pageSize };
};

export const getAdminActionLogs = async (pageSize: number, cursor?: any): Promise<{ data: AdminActionLog[], lastVisible: any }> => {
    const offset = cursor || 0;
    const { data, error } = await supabase
        .from('admin_action_logs')
        .select('*')
        .range(offset, offset + pageSize - 1)
        .order('timestamp', { ascending: false });

    if (error) return { data: [], lastVisible: null };

    const logs = data.map((l: any) => ({
        id: l.id,
        adminEmail: l.admin_email,
        action: l.action,
        targetUserId: l.target_user_id,
        targetUserEmail: l.target_user_email,
        details: l.details,
        timestamp: l.timestamp
    }));

    return { data: logs, lastVisible: offset + pageSize };
};


// --- Files (Supabase Storage) ---

export const uploadUserFile = async (uid: string, file: File, notes: string): Promise<void> => {
    const path = `${uid}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('user-files').upload(path, file);
    if (uploadError) throw uploadError;

    await supabase.from('user_files').insert({
        user_id: uid,
        name: file.name,
        notes: notes,
        size: file.size,
        storage_path: path,
        created_at: new Date().toISOString()
    });
};

export const getUserFiles = async (uid: string): Promise<UserFile[]> => {
    const { data, error } = await supabase.from('user-files').select('*').eq('user_id', uid).order('created_at', { ascending: false });
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

export const getDownloadUrlForFile = async (storagePath: string): Promise<string> => {
    const { data } = await supabase.storage.from('user-files').createSignedUrl(storagePath, 60);
    return data?.signedUrl || '';
};

export const deleteUserFile = async (uid: string, fileId: string, storagePath: string): Promise<void> => {
    await supabase.storage.from('user-files').remove([storagePath]);
    await supabase.from('user_files').delete().eq('id', fileId);
};

export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
    const path = `${uid}/avatar.png`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', uid);
    return publicUrl;
};

export const deleteProfilePhoto = async (uid: string): Promise<void> => {
    const path = `${uid}/avatar.png`;
    await supabase.storage.from('avatars').remove([path]);
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', uid);
};
