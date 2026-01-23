import { supabase } from './supabase';
import { emailService } from './emailService';
import type {
    User,
    GeneratedDocument,
    Transaction,
    AdminActionLog,
    AdminNotification,
    UserFile,
    Coupon,
    CompanyProfile,
    PolicyDraft,
    Policy,
    Form,
    InvoiceRequest,
    SupportTicket
} from '../types';



export const createSupportTicket = async (ticket: Partial<SupportTicket>) => {
    const { error } = await supabase.from('support_tickets').insert({
        user_id: ticket.userId || null,
        name: ticket.name,
        email: ticket.email,
        message: ticket.message,
        attachments: ticket.attachments || [],
        metadata: {
            ...ticket.metadata,
            user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
            url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
        }
    });
    if (error) throw error;
};

export const getSupportTickets = async (pageSize: number = 20, lastVisible?: number): Promise<{ data: SupportTicket[], lastVisible: number | null }> => {
    let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false }).limit(pageSize);
    const offset = lastVisible || 0;
    query = query.range(offset, offset + pageSize - 1);
    const { data, error } = await query;
    if (error) throw error;

    const tickets = data.map((t: any) => ({
        id: t.id,
        userId: t.user_id,
        name: t.name,
        email: t.email,
        message: t.message,
        attachments: t.attachments || [],
        status: t.status,
        priority: t.priority,
        createdAt: t.created_at,
        metadata: t.metadata
    }));

    return { data: tickets, lastVisible: offset + pageSize };
};

export const updateSupportTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    const { error } = await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
    if (error) throw error;
};


export const getUserProfile = async (uid: string): Promise<User | null> => {
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (error) { if (error.code !== 'PGRST116') console.error('Error fetching profile:', error); return null; }
    const { data: transactions } = await supabase.from('transactions').select('*').eq('user_id', uid).order('date', { ascending: false }).limit(50);
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
        isConsultant: profile.is_consultant || false,
        consultantPlatformFeePaidUntil: profile.consultant_platform_fee_paid_until,
        consultantClientLimit: profile.consultant_client_limit || 10,
        branding: profile.branding || {},
        hasSeenConsultantWelcome: profile.has_seen_consultant_welcome || false,
        clients: profile.clients || [],
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
    const { data, error } = await supabase.from('profiles').insert({
        id: uid, email, plan, full_name: name, contact_number: contactNumber, credit_balance: 0, created_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return {
        uid: data.id, email: data.email, name: data.full_name, contactNumber: data.contact_number, plan: data.plan, creditBalance: 0, createdAt: data.created_at, isAdmin: false, profile: { companyName: '', industry: '' }, transactions: [], isConsultant: false, clients: []
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

export const updateConsultantClients = async (uid: string, clients: any[], amount?: number, reason?: string) => {
    if (amount) {
        await addTransactionToUser(uid, { amount: -amount, description: reason || 'Client Access Fee' }, true);
    }
    const { error } = await supabase.from('profiles').update({ clients: clients }).eq('id', uid);
    if (error) throw error;
};

export const updateConsultantPlatformFee = async (uid: string, newExpiry: string, amount: number) => {
    await addTransactionToUser(uid, { amount: -amount, description: 'Consultant Monthly Platform Fee' }, true);
    const { error } = await supabase.from('profiles').update({
        consultant_platform_fee_paid_until: newExpiry
    }).eq('id', uid);
    if (error) throw error;
};

// ... (Documents, Transactions, etc. unchanged)
export const getGeneratedDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
    const { data, error } = await supabase.from('generated_documents').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((doc: any) => ({
        id: doc.id, title: doc.title, kind: doc.kind, type: doc.type, content: doc.content, createdAt: doc.created_at, companyProfile: doc.company_profile, questionAnswers: doc.question_answers, outputFormat: doc.output_format, sources: doc.sources, version: doc.version, history: doc.history,
    }));
};

export const saveGeneratedDocument = async (uid: string, doc: GeneratedDocument): Promise<GeneratedDocument> => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUpdate = doc.id && uuidRegex.test(doc.id);
    const dbDoc: any = {
        user_id: uid, title: doc.title, kind: doc.kind, type: doc.type, content: doc.content || "", created_at: doc.createdAt, company_profile: doc.companyProfile || {}, question_answers: doc.questionAnswers || {}, output_format: doc.outputFormat || 'word', sources: doc.sources || [], version: doc.version, history: doc.history || [],
    };
    let data, error;
    if (isUpdate) {
        const result = await supabase.from('generated_documents').update(dbDoc).eq('id', doc.id).select().single();
        data = result.data; error = result.error;
    } else {
        const result = await supabase.from('generated_documents').insert(dbDoc).select().single();
        data = result.data; error = result.error;
    }
    if (error) { console.error("Supabase Save Error:", error); throw error; }
    return { ...doc, id: data.id, createdAt: data.created_at };
};

export const addTransactionToUser = async (uid: string, transaction: Partial<Transaction>, updateBalance: boolean = false) => {
    const { error: txError } = await supabase.from('transactions').insert({
        user_id: uid,
        amount: transaction.amount,
        description: transaction.description,
        date: new Date().toISOString(),
        actor_id: transaction.actorId,
        actor_email: transaction.actorEmail,
        metadata: transaction.metadata || {},
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
        ip_address: transaction.ipAddress
    });
    if (txError) throw txError;
    if (updateBalance && transaction.amount) {
        const { error: balanceError } = await supabase.rpc('increment_balance', { user_id: uid, amount: transaction.amount });
        if (balanceError) throw balanceError;
    }
};

// --- INVOICE REQUESTS ---

export const submitInvoiceRequest = async (
    userId: string,
    userEmail: string,
    requestType: 'pro' | 'payg',
    amountInCents: number,
    description: string
) => {
    const reference = `HR-${userId.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const amountRands = (amountInCents / 100).toFixed(2);

    const { error } = await supabase.from('admin_notifications').insert({
        type: 'important_update',
        message: `INVOICE REQUEST: ${userEmail} requests ${description}. Amount: R${amountRands}. Ref: ${reference}`,
        is_read: false,
        related_user_id: userId
    });

    if (error) throw error;
    return reference;
};

export const getOpenInvoiceRequests = async (): Promise<InvoiceRequest[]> => {
    // FIX: Using 'created_at' consistently. If your DB has 'timestamp', run the migration script in services/supabase.ts
    const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false)
        .ilike('message', 'INVOICE REQUEST%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching invoice requests:", error);
        throw error;
    }

    return data.map((n: any) => {
        const msg = n.message;
        const emailMatch = msg.match(/INVOICE REQUEST: (\S+)/);
        const amountMatch = msg.match(/Amount: R([\d\.]+)/);
        const refMatch = msg.match(/Ref: (\S+)/);

        const isPro = msg.toLowerCase().includes('pro subscription') || msg.toLowerCase().includes('pro plan');

        return {
            id: n.id,
            date: n.created_at || n.timestamp, // Fallback for safety
            userId: n.related_user_id,
            userEmail: emailMatch ? emailMatch[1] : 'Unknown',
            type: isPro ? 'pro' : 'payg',
            amount: amountMatch ? Math.round(parseFloat(amountMatch[1]) * 100) : 0,
            reference: refMatch ? refMatch[1] : 'N/A',
            description: msg.split('Ref:')[0]
        };
    });
};

export const processManualOrder = async (adminEmail: string, request: InvoiceRequest) => {
    if (request.type === 'pro') {
        await supabase.from('profiles').update({ plan: 'pro' }).eq('id', request.userId);
        await addTransactionToUser(request.userId, { description: `Manual Activation: ${request.description}`, amount: 0 });
    } else {
        await addTransactionToUser(request.userId, { description: `Manual Top-Up: ${request.description}`, amount: request.amount }, true);
    }
    await supabase.from('admin_notifications').update({ is_read: true }).eq('id', request.id);
    await logAdminAction('Processed Manual Order', request.userId, { amount: request.amount, type: request.type, reference: request.reference });

    const { data: userProfile } = await supabase.from('profiles').select('full_name').eq('id', request.userId).single();
    const userName = userProfile?.full_name || 'Customer';
    await emailService.sendActivationConfirmation(request.userEmail, userName, request.type, request.amount);
};

// --- Admin Features ---

const logAdminAction = async (action: string, targetUid: string, details?: any) => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return;
    const { data: target } = await supabase.from('profiles').select('email').eq('id', targetUid).single();
    await supabase.from('admin_action_logs').insert({
        admin_email: user.email,
        action,
        target_user_id: targetUid,
        target_user_email: target?.email || 'Unknown',
        details,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'Server'
    });
};

export const getAllUsers = async (pageSize: number, lastVisible?: number): Promise<{ data: User[], lastVisible: number | null }> => {
    let query = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(pageSize);
    if (lastVisible) query = query.range(lastVisible, lastVisible + pageSize - 1);
    else query = query.range(0, pageSize - 1);
    const { data, error } = await query;
    if (error) throw error;
    const users = data.map((profile: any) => ({
        uid: profile.id, email: profile.email, name: profile.full_name, contactNumber: profile.contact_number, plan: profile.plan, creditBalance: profile.credit_balance, createdAt: profile.created_at, isAdmin: profile.is_admin, profile: { companyName: profile.company_name, industry: profile.industry }, transactions: []
    }));
    return { data: users, lastVisible: (lastVisible || 0) + pageSize };
};

export const searchUsers = async (queryStr: string): Promise<User[]> => {
    if (!queryStr) return (await getAllUsers(20)).data;

    // Search by email, full_name, or company_name
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.%${queryStr}%,full_name.ilike.%${queryStr}%,company_name.ilike.%${queryStr}%`)
        .limit(50);

    if (error) throw error;

    return data.map((profile: any) => ({
        uid: profile.id,
        email: profile.email,
        name: profile.full_name,
        contactNumber: profile.contact_number,
        plan: profile.plan,
        creditBalance: profile.credit_balance,
        createdAt: profile.created_at,
        isAdmin: profile.is_admin,
        profile: {
            companyName: profile.company_name,
            industry: profile.industry
        },
        transactions: []
    }));
};

export const getAllDocumentsForAllUsers = async (pageSize: number, lastVisible?: number): Promise<{ data: GeneratedDocument[], lastVisible: number | null }> => {
    let query = supabase.from('generated_documents').select('*, profiles(company_name)').order('created_at', { ascending: false });
    const offset = lastVisible || 0;
    query = query.range(offset, offset + pageSize - 1);
    const { data, error } = await query;
    if (error) throw error;
    const docs = data.map((doc: any) => ({
        id: doc.id, title: doc.title, kind: doc.kind, type: doc.type, content: doc.content, createdAt: doc.created_at, companyProfile: doc.company_profile || { companyName: doc.profiles?.company_name || 'N/A', industry: 'Unknown' }, questionAnswers: doc.question_answers, version: doc.version,
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
        id: log.id, timestamp: log.created_at, adminEmail: log.admin_email, action: log.action, targetUserId: log.target_user_id, targetUserEmail: log.target_user_email, details: log.details
    }));
    return { data: logs, lastVisible: offset + pageSize };
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
    await addTransactionToUser(targetUid, { description: 'Pro Plan (Admin Grant)', amount: 0 });
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

export const getPricingSettings = async () => {
    const { data: settings } = await supabase.from('app_settings').select('*');
    const { data: docPrices } = await supabase.from('document_prices').select('*');
    return { settings: settings || [], docPrices: docPrices || [] };
};

export const getAppSetting = async (key: string): Promise<any> => {
    const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error(`Error fetching setting '${key}':`, error);
    }
    return data?.value ?? null;
};

export const setAppSetting = async (key: string, value: any, description?: string): Promise<void> => {
    const { error } = await supabase
        .from('app_settings')
        .upsert({ key, value, description: description || `Setting: ${key}` }, { onConflict: 'key' });

    if (error) {
        throw new Error(`Failed to set setting '${key}': ${error.message}`);
    }
    await logAdminAction(`Updated App Setting: ${key}`, 'system', { key, value });
};

export const updateProPrice = async (priceInCents: number) => {
    await supabase.from('app_settings').upsert({ key: 'pro_plan_yearly', value: priceInCents, description: 'Yearly Pro Plan Price in Cents' });
    await logAdminAction('Updated Pro Plan Price', 'system', { price: priceInCents });
};

export const updateDocumentPrice = async (docType: string, priceInCents: number, category: 'policy' | 'form') => {
    await supabase.from('document_prices').upsert({ doc_type: docType, price: priceInCents, category });
    await logAdminAction('Updated Document Price', 'system', { docType, price: priceInCents });
};

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    const { data, error } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) return [];
    return data.map((n: any) => ({
        id: n.id, timestamp: n.created_at, type: n.type, message: n.message, isRead: n.is_read, relatedUserId: n.related_user_id
    }));
};

export const markNotificationAsRead = async (id: string) => { await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id); };
export const markAllNotificationsAsRead = async () => { await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false); };

export const createAdminNotification = async (type: AdminNotification['type'], message: string, relatedUserId?: string) => {
    const { error } = await supabase.from('admin_notifications').insert({
        type,
        message,
        related_user_id: relatedUserId,
        is_read: false
    });
    if (error) console.error("Error creating admin notification:", error);
};

export const getUserFiles = async (uid: string): Promise<UserFile[]> => {
    const { data, error } = await supabase.from('user_files').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (error) return [];
    return data.map((f: any) => ({ id: f.id, name: f.name, notes: f.notes, size: f.size, storagePath: f.storage_path, createdAt: f.created_at }));
};

export const uploadUserFile = async (uid: string, file: File, notes: string) => {
    const path = `${uid}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('user_docs').upload(path, file);
    if (uploadError) throw uploadError;
    const { error: dbError } = await supabase.from('user_files').insert({ user_id: uid, name: file.name, notes, size: file.size, storage_path: path });
    if (dbError) throw dbError;
};

export const getDownloadUrlForFile = async (path: string) => {
    const { data } = await supabase.storage.from('user_docs').createSignedUrl(path, 60);
    if (!data?.signedUrl) throw new Error("Could not generate link");
    return data.signedUrl;
};

export const deleteUserFile = async (uid: string, fileId: string, path: string) => {
    await supabase.storage.from('user_docs').remove([path]);
    await supabase.from('user_files').delete().eq('id', fileId);
};

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

export const createCoupon = async (coupon: Partial<Coupon>) => {
    const { error } = await supabase.from('coupons').insert({
        code: coupon.code, discount_type: coupon.discountType, discount_value: coupon.discountValue, max_uses: coupon.maxUses, applicable_to: coupon.applicableTo === 'all' ? null : coupon.applicableTo
    });
    if (error) throw error;
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((c: any) => ({
        id: c.id, code: c.code, discountType: c.discount_type, discountValue: c.discount_value, maxUses: c.max_uses, usedCount: c.used_count, expiryDate: c.expiry_date, active: c.active, applicableTo: c.applicable_to || 'all', createdAt: c.created_at
    }));
};

export const deactivateCoupon = async (id: string) => { await supabase.from('coupons').update({ active: false }).eq('id', id); };

export const validateCoupon = async (code: string, planType: 'pro' | 'payg'): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    const { data, error } = await supabase.from('coupons').select('*').eq('code', code).eq('active', true).single();
    if (error || !data) return { valid: false, message: 'Invalid or expired coupon.' };
    if (data.max_uses && data.used_count >= data.max_uses) return { valid: false, message: 'Coupon usage limit reached.' };
    if (data.applicable_to && data.applicable_to !== `plan:${planType}`) return { valid: false, message: 'Coupon not applicable for this plan.' };
    const coupon: Coupon = {
        id: data.id, code: data.code, discountType: data.discount_type, discountValue: data.discount_value, maxUses: data.max_uses, usedCount: data.used_count, expiryDate: data.expiry_date, active: data.active, applicableTo: data.applicable_to || 'all', createdAt: data.created_at
    };
    return { valid: true, coupon };
};

export const savePolicyDraft = async (uid: string, draft: Omit<PolicyDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<void> => {
    const data = {
        id: draft.id, user_id: uid, original_doc_id: draft.originalDocId, original_doc_title: draft.originalDocTitle, original_content: draft.originalContent, update_result: draft.updateResult, selected_indices: draft.selectedIndices, manual_instructions: draft.manualInstructions, updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('policy_drafts').upsert(data);
    if (error) throw error;
};

export const getPolicyDrafts = async (uid: string): Promise<PolicyDraft[]> => {
    const { data, error } = await supabase.from('policy_drafts').select('*').eq('user_id', uid).order('updated_at', { ascending: false });
    if (error) return [];
    return data.map((d: any) => ({
        id: d.id, originalDocId: d.original_doc_id, originalDocTitle: d.original_doc_title, originalContent: d.original_content, updateResult: d.update_result, selectedIndices: d.selected_indices, manualInstructions: d.manual_instructions, updatedAt: d.updated_at, createdAt: d.created_at
    }));
};

export const deletePolicyDraft = async (id: string) => {
    const { error } = await supabase.from('policy_drafts').delete().eq('id', id);
    if (error) throw error;
};

// --- MARKETING & CONVERSION FLOWS ---

/**
 * Logs a marketing event to Supabase for analysis in the admin dashboard.
 */
export const logMarketingEvent = async (userId: string | undefined, eventType: string, metadata: any = {}) => {
    try {
        const { error } = await supabase.from('marketing_events').insert({
            user_id: userId || null,
            event_type: eventType,
            metadata: metadata,
            timestamp: new Date().toISOString()
        });
        if (error) console.error("Error logging marketing event:", error);
    } catch (err) {
        console.error("Marketing log exception:", err);
    }
};

/**
 * Retrieves marketing events for the admin dashboard.
 */
export const getMarketingEvents = async (limit: number = 100) => {
    const { data, error } = await supabase
        .from('marketing_events')
        .select('*, profiles(email, full_name)')
        .order('timestamp', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
};

/**
 * Saves a lead to the Waitlist (assessment_leads).
 */
export const saveWaitlistLead = async (leadData: { name: string, email: string, source?: string }) => {
    const { error } = await supabase.from('assessment_leads').insert({
        full_name: leadData.name,
        email: leadData.email,
        source: leadData.source || 'website_waitlist',
        created_at: new Date().toISOString()
    });
    if (error) throw error;
};

/**
 * Retrieves waitlist leads for the admin.
 */
export const getWaitlistLeads = async () => {
    const { data, error } = await supabase
        .from('assessment_leads')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};