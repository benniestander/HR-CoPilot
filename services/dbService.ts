
import { supabase } from './supabase';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon, CompanyProfile } from '../types';

// --- Helpers for Type Mapping (Snake Case <-> Camel Case) ---

const mapProfileToUser = (profile: any, transactions: any[] = []): User => ({
    uid: profile.id,
    email: profile.email,
    name: profile.full_name || '',
    contactNumber: profile.contact_number || '',
    plan: profile.plan as 'payg' | 'pro',
    creditBalance: profile.credit_balance || 0,
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
    amount: tx.amount,
    userId: tx.user_id,
    // Discount JSONB is stored directly, assuming structure matches
    discount: tx.discount
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
       ...doc.question_answers 
    },
    questionAnswers: doc.question_answers || {},
    outputFormat: doc.output_format,
    sources: doc.sources,
    version: doc.version,
    history: doc.history
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
        .order('date', { ascending: false });

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

export const addTransactionToUser = async (uid: string, transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'userEmail'>, couponCode?: string): Promise<void> => {
    
    let discountDetails: any = null;
    let finalAmount = Number(transaction.amount);

    if (couponCode) {
        const couponRes = await validateCoupon(uid, couponCode);
        if (couponRes.valid && couponRes.coupon) {
            const coupon = couponRes.coupon;
            let discountAmount = 0;

            if (coupon.type === 'percentage') {
                discountAmount = (Math.abs(finalAmount) * coupon.value) / 100;
            } else {
                discountAmount = coupon.value;
            }
            
            if (finalAmount < 0) {
                 finalAmount += discountAmount;
            } else {
                 finalAmount += discountAmount;
            }

            discountDetails = { couponCode: coupon.code, amount: discountAmount };

            // Increment uses
            const { data: c } = await supabase.from('coupons').select('uses').eq('id', coupon.id).single();
            if (c) await supabase.from('coupons').update({ uses: c.uses + 1 }).eq('id', coupon.id);
        }
    }

    // 1. Insert Transaction
    const { error: txError } = await supabase.from('transactions').insert({
        user_id: uid,
        amount: finalAmount,
        description: transaction.description,
        discount: discountDetails,
        date: new Date().toISOString()
    });

    if (txError) throw txError;

    // 2. Update User Balance (only if not subscription)
    if (transaction.description !== 'HR CoPilot Pro Subscription (12 months)') {
        const { data: profile, error: fetchError } = await supabase.from('profiles').select('credit_balance').eq('id', uid).single();
        if (fetchError) throw fetchError;
        
        if (profile) {
            // Explicitly cast to Number to prevent string concatenation
            const currentBalance = Number(profile.credit_balance || 0);
            const newBalance = currentBalance + finalAmount;
            
            const { error: updateError } = await supabase.from('profiles').update({ credit_balance: newBalance }).eq('id', uid);
            if (updateError) throw updateError;
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

    // Add transaction (which updates balance)
    await addTransactionToUser(targetUid, {
        description: `Admin adjustment: ${reason}`,
        amount: amountInCents,
    });

    await logAdminAction({
        adminEmail,
        action: 'Adjusted User Credit',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { amountInCents, reason }
    });

    // Return the updated user profile so UI can refresh
    return await getUserProfile(targetUid);
};

export const changeUserPlanByAdmin = async (adminEmail: string, targetUid: string, newPlan: 'pro' | 'payg'): Promise<User | null> => {
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    const oldPlan = user.plan;
    await supabase.from('profiles').update({ plan: newPlan }).eq('id', targetUid);

    await logAdminAction({
        adminEmail,
        action: 'Changed User Plan',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { from: oldPlan, to: newPlan }
    });

    return { ...user, plan: newPlan };
};

export const simulateFailedPaymentForUser = async (adminEmail: string, targetUid: string, targetUserEmail: string): Promise<void> => {
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

// --- Pagination Wrappers for Admin ---

export const getAllUsers = async (pageSize: number, cursor?: any): Promise<{ data: User[], lastVisible: any }> => {
    const offset = cursor || 0;
    const { data, error, count } = await supabase
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


// --- Coupons ---

export const createCoupon = async (adminEmail: string, couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>): Promise<void> => {
    const { data, error } = await supabase.from('coupons').insert({
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        max_uses: couponData.maxUses,
        applicable_to: couponData.applicableTo,
        is_active: true
    }).select().single();

    if (error) throw error;

    await logAdminAction({
        adminEmail, action: 'Created Coupon', targetUserId: 'N/A', targetUserEmail: 'N/A',
        details: { couponId: data.id, code: couponData.code }
    });
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) return [];

    return data.map((c: any) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        uses: c.uses,
        maxUses: c.max_uses,
        applicableTo: c.applicable_to,
        isActive: c.is_active,
        expiresAt: c.expires_at,
        createdAt: c.created_at
    }));
};

export const deactivateCoupon = async (adminEmail: string, couponId: string): Promise<void> => {
    await supabase.from('coupons').update({ is_active: false }).eq('id', couponId);
    await logAdminAction({
        adminEmail, action: 'Deactivated Coupon', targetUserId: 'N/A', targetUserEmail: 'N/A',
        details: { couponId }
    });
};

export const validateCoupon = async (uid: string, code: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> => {
    const { data: coupon, error } = await supabase.from('coupons').select('*').eq('code', code.toUpperCase()).single();

    if (error || !coupon) return { valid: false, message: 'Coupon not found.' };

    if (!coupon.is_active) return { valid: false, message: 'This coupon is no longer active.' };
    
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, message: 'This coupon has expired.' };
    }
    
    if (coupon.max_uses != null && coupon.uses >= coupon.max_uses) {
        return { valid: false, message: 'This coupon has reached its usage limit.' };
    }
    
    const applicableTo = coupon.applicable_to;
    if (Array.isArray(applicableTo) && applicableTo.length > 0 && !applicableTo.includes(uid)) {
        return { valid: false, message: 'This coupon is not valid for your account.' };
    }

    const mappedCoupon: Coupon = {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        uses: coupon.uses,
        maxUses: coupon.max_uses,
        applicableTo: coupon.applicable_to,
        isActive: coupon.is_active,
        expiresAt: coupon.expires_at,
        createdAt: coupon.created_at
    };

    return { valid: true, message: 'Coupon applied successfully!', coupon: mappedCoupon };
};
