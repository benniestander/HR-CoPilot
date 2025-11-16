
import type { User, CompanyProfile, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon } from '../types';
// --- REAL FIREBASE FILE FUNCTIONS ---
// These functions use the actual Firebase SDK for file storage and metadata.
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from './firebase';

// This service simulates a Firestore database using an in-memory object for the duration of the session.
// Persistence to localStorage is disabled as per user request.

interface MockDB {
  users: {
    [uid: string]: {
      profile: User;
      generatedDocuments: {
        [docId: string]: GeneratedDocument;
      };
    };
  };
  adminActionLogs: {
    [logId: string]: AdminActionLog;
  };
  adminNotifications: {
    [notificationId: string]: AdminNotification;
  };
  // FIX: Added coupons to the mock database interface.
  coupons: {
    [couponId: string]: Coupon;
  };
}

// In-memory store for the application session. Resets on page reload.
let inMemoryDB: MockDB = {
  users: {},
  adminActionLogs: {},
  adminNotifications: {},
  // FIX: Initialized coupons in the in-memory database.
  coupons: {},
};


const getDB = (): MockDB => {
  // Returns a direct reference to the in-memory database object.
  return inMemoryDB;
};

const saveDB = (db: MockDB) => {
  // Since getDB returns a direct reference, mutations happen on the object directly.
  // This function is now a no-op but is kept for structural consistency
  // in case persistence is re-enabled later.
};


// --- Notification Functions ---

export const createAdminNotification = async (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>): Promise<void> => {
    const db = getDB();
    const newNotification: AdminNotification = {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    db.adminNotifications[newNotification.id] = newNotification;
    saveDB(db);
};

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    const db = getDB();
    return Object.values(db.adminNotifications).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const db = getDB();
    if (db.adminNotifications[notificationId]) {
        db.adminNotifications[notificationId].isRead = true;
        saveDB(db);
    }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    const db = getDB();
    Object.values(db.adminNotifications).forEach(n => n.isRead = true);
    saveDB(db);
};

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const db = getDB();
  return db.users[uid]?.profile || null;
};

export const createUserProfile = async (
  uid: string,
  email: string,
  plan: 'payg' | 'pro',
  name?: string,
  contactNumber?: string
): Promise<User> => {
  const db = getDB();
  let isNewUser = false;
  if (!db.users[uid]) {
    isNewUser = true;
    const newUser: User = {
      uid,
      email,
      name: name || '',
      contactNumber: contactNumber || '',
      plan,
      creditBalance: 0,
      transactions: [],
      profile: {
        companyName: '',
        industry: '',
      },
      createdAt: new Date().toISOString(),
    };
    db.users[uid] = { profile: newUser, generatedDocuments: {} };
    saveDB(db);
  }

  if (isNewUser && email !== 'admin@hrcopilot.co.za') {
    await createAdminNotification({
        type: 'new_user',
        message: `New ${plan.toUpperCase()} user signed up: ${email}`,
        relatedUserId: uid,
    });
  }

  return db.users[uid].profile;
};

export const updateUser = async (uid: string, userData: Partial<User>): Promise<void> => {
    const db = getDB();
    if (db.users[uid]) {
        db.users[uid].profile = { ...db.users[uid].profile, ...userData };
        saveDB(db);
    }
}

// FIX: Updated function to accept an optional couponCode and handle discount logic.
export const addTransactionToUser = async (uid: string, transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'userEmail'>, couponCode?: string): Promise<void> => {
    const db = getDB();
    if (db.users[uid]) {
        const user = db.users[uid].profile;
        let discountDetails: Transaction['discount'] | undefined = undefined;
        let creditAdjustment = transaction.amount;

        if (couponCode) {
            const coupon = Object.values(db.coupons || {}).find(c => c.code.toUpperCase() === couponCode.toUpperCase());
            if (coupon) { // Assume it's valid
                let discountAmount = 0;
                if (coupon.type === 'percentage') {
                    // For top-ups (positive amount), discount is on top. For purchases (negative), it's on the absolute value.
                    discountAmount = (Math.abs(transaction.amount) * coupon.value) / 100;
                } else { // fixed
                    discountAmount = coupon.value;
                }
                
                // A discount always benefits the user, so we add it. If tx.amount is negative, this reduces the deduction. If positive, it increases the addition.
                creditAdjustment += discountAmount;
                
                discountDetails = {
                    couponCode: coupon.code,
                    amount: discountAmount,
                };
                
                coupon.uses += 1;
                if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) {
                    coupon.isActive = false;
                }
            }
        }
        
        const newTransaction: Transaction = {
            ...transaction,
            id: `txn_${Date.now()}`,
            date: new Date().toISOString(),
            userId: uid,
            userEmail: user.email,
            discount: discountDetails,
        };
        
        user.transactions = [newTransaction, ...(user.transactions || [])];
        // Only adjust credit if it's not a subscription log. Subscription doesn't use credit.
        if (transaction.description !== 'Ingcweti Pro Subscription (12 months)') {
            user.creditBalance += creditAdjustment;
        }
        db.users[uid].profile = user;
        saveDB(db);
    }
};


// --- Generated Document Functions ---

export const getGeneratedDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
    const db = getDB();
    const docs = db.users[uid]?.generatedDocuments || {};
    return Object.values(docs).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const saveGeneratedDocument = async (uid: string, doc: GeneratedDocument): Promise<void> => {
    const db = getDB();
    if (!db.users[uid]) {
        console.error("Cannot save document for non-existent user:", uid);
        return;
    }
    db.users[uid].generatedDocuments[doc.id] = doc;
    saveDB(db);
};


// --- Admin Functions ---

const logAdminAction = (action: Omit<AdminActionLog, 'id' | 'timestamp'>) => {
    const db = getDB();
    const logId = `log_${Date.now()}`;
    const newLog: AdminActionLog = {
        ...action,
        id: logId,
        timestamp: new Date().toISOString(),
    };
    db.adminActionLogs[logId] = newLog;
    saveDB(db); // saveDB is called within the function that calls this
};

export const updateUserByAdmin = async (adminEmail: string, targetUid: string, updates: Partial<User>): Promise<User | null> => {
    const db = getDB();
    const userContainer = db.users[targetUid];
    if (userContainer) {
        const originalUser = { ...userContainer.profile };
        const updatedUser = { ...originalUser, ...updates };
        userContainer.profile = updatedUser;

        logAdminAction({
            adminEmail,
            action: 'Updated User Profile',
            targetUserId: targetUid,
            targetUserEmail: originalUser.email,
            details: { updates }
        });
        
        saveDB(db);
        return updatedUser;
    }
    return null;
}

export const adjustUserCreditByAdmin = async (adminEmail: string, targetUid: string, amountInCents: number, reason: string): Promise<User | null> => {
    const db = getDB();
    const userContainer = db.users[targetUid];
    if (userContainer) {
        const user = userContainer.profile;
        const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            date: new Date().toISOString(),
            description: `Admin adjustment: ${reason}`,
            amount: amountInCents,
            userId: targetUid,
            userEmail: user.email,
        };
        user.transactions = [newTransaction, ...(user.transactions || [])];
        user.creditBalance += amountInCents;

        logAdminAction({
            adminEmail,
            action: 'Adjusted User Credit',
            targetUserId: targetUid,
            targetUserEmail: user.email,
            details: { amountInCents, reason }
        });
        
        saveDB(db);
        return user;
    }
    return null;
};

export const changeUserPlanByAdmin = async (adminEmail: string, targetUid: string, newPlan: 'pro' | 'payg'): Promise<User | null> => {
     const db = getDB();
    const userContainer = db.users[targetUid];
    if (userContainer) {
        const user = userContainer.profile;
        const oldPlan = user.plan;
        user.plan = newPlan;

        logAdminAction({
            adminEmail,
            action: 'Changed User Plan',
            targetUserId: targetUid,
            targetUserEmail: user.email,
            details: { from: oldPlan, to: newPlan }
        });

        saveDB(db);
        return user;
    }
    return null;
};

export const simulateFailedPaymentForUser = async (adminEmail: string, targetUid: string, targetUserEmail: string): Promise<void> => {
    await createAdminNotification({
        type: 'payment_failed',
        message: `A payment of R100.00 failed for user ${targetUserEmail}.`,
        relatedUserId: targetUid,
    });
    logAdminAction({
        adminEmail,
        action: 'Simulated Failed Payment',
        targetUserId: targetUid,
        targetUserEmail: targetUserEmail,
        details: { simulation: true }
    });
};

export const getAllUsers = async (): Promise<User[]> => {
    const db = getDB();
    return Object.values(db.users).map(userContainer => userContainer.profile).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getAllDocumentsForAllUsers = async (): Promise<GeneratedDocument[]> => {
    const db = getDB();
    let allDocs: GeneratedDocument[] = [];
    for (const uid in db.users) {
        const userDocs = Object.values(db.users[uid].generatedDocuments);
        allDocs = [...allDocs, ...userDocs];
    }
    return allDocs.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getAdminActionLogs = async (): Promise<AdminActionLog[]> => {
    const db = getDB();
    return Object.values(db.adminActionLogs).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
    const db = getDB();
    const allTransactions: Transaction[] = [];
    Object.values(db.users).forEach(userContainer => {
        if(userContainer.profile.transactions) {
            allTransactions.push(...userContainer.profile.transactions);
        }
    });
    return allTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export const uploadUserFile = async (uid: string, file: File, notes: string): Promise<void> => {
    if (!uid || !file) throw new Error("User ID and file are required.");

    const storagePath = `users/${uid}/files/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);

    const fileMetadata = {
        name: file.name,
        notes: notes,
        size: file.size,
        storagePath: storagePath,
        createdAt: serverTimestamp(),
    };

    const filesCollectionRef = collection(firestore, 'users', uid, 'files');
    await addDoc(filesCollectionRef, fileMetadata);
};

export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
    if (!uid || !file) throw new Error("User ID and file are required.");

    const storagePath = `users/${uid}/profile/photo`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    
    // Update the user's profile in the mock DB
    const db = getDB();
    if (db.users[uid]) {
        db.users[uid].profile.photoURL = photoURL;
        saveDB(db);
    }

    return photoURL;
};

export const deleteProfilePhoto = async (uid: string): Promise<void> => {
    if (!uid) throw new Error("User ID is required.");

    const storagePath = `users/${uid}/profile/photo`;
    const storageRef = ref(storage, storagePath);

    try {
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting profile photo from Storage:", error);
            throw error;
        }
    }

    // Update the user's profile in mock DB
    const db = getDB();
    if (db.users[uid]) {
        delete db.users[uid].profile.photoURL;
        saveDB(db);
    }
};

export const getUserFiles = async (uid: string): Promise<UserFile[]> => {
    if (!uid) return [];
    
    try {
        const filesCollectionRef = collection(firestore, 'users', uid, 'files');
        const q = query(filesCollectionRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                notes: data.notes,
                size: data.size,
                storagePath: data.storagePath,
                createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            } as UserFile;
        });
    } catch (error) {
        console.error("Error fetching user files:", error);
        // This might happen if Firestore rules deny access or the collection doesn't exist.
        // Return an empty array to prevent the app from crashing.
        return [];
    }
};

export const getDownloadUrlForFile = async (storagePath: string): Promise<string> => {
    if (!storagePath) throw new Error("Storage path is required.");
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
};

// FIX: Implement and export missing coupon management functions.
export const createCoupon = async (adminEmail: string, couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>): Promise<void> => {
    const db = getDB();
    const newCoupon: Coupon = {
        ...couponData,
        id: `coupon_${Date.now()}`,
        createdAt: new Date().toISOString(),
        uses: 0,
        isActive: true,
    };
    if (!db.coupons) {
        db.coupons = {};
    }
    db.coupons[newCoupon.id] = newCoupon;
    logAdminAction({
        adminEmail,
        action: 'Created Coupon',
        targetUserId: 'N/A',
        targetUserEmail: 'N/A',
        details: { code: newCoupon.code, value: newCoupon.value }
    });
    saveDB(db);
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const db = getDB();
    return Object.values(db.coupons || {}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const deactivateCoupon = async (adminEmail: string, couponId: string): Promise<void> => {
    const db = getDB();
    if (db.coupons && db.coupons[couponId]) {
        const code = db.coupons[couponId].code;
        db.coupons[couponId].isActive = false;
        logAdminAction({
            adminEmail,
            action: 'Deactivated Coupon',
            targetUserId: 'N/A',
            targetUserEmail: 'N/A',
            details: { couponId, code }
        });
        saveDB(db);
    }
};

export const validateCoupon = async (uid: string, code: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> => {
    const db = getDB();
    const coupon = Object.values(db.coupons || {}).find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
        return { valid: false, message: 'Coupon not found.' };
    }
    if (!coupon.isActive) {
        return { valid: false, message: 'This coupon is no longer active.' };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        coupon.isActive = false; // Deactivate expired coupon
        saveDB(db);
        return { valid: false, message: 'This coupon has expired.' };
    }
    if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) {
        coupon.isActive = false; // Deactivate used up coupon
        saveDB(db);
        return { valid: false, message: 'This coupon has reached its usage limit.' };
    }
    if (Array.isArray(coupon.applicableTo) && !coupon.applicableTo.includes(uid)) {
        return { valid: false, message: 'This coupon is not valid for your account.' };
    }
    
    return { valid: true, message: 'Coupon applied successfully!', coupon };
};
