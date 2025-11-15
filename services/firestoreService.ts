import type { User, CompanyProfile, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, UserFile } from '../types';
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
}

// In-memory store for the application session. Resets on page reload.
let inMemoryDB: MockDB = {
  users: {},
  adminActionLogs: {},
  adminNotifications: {},
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

export const addTransactionToUser = async (uid: string, transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'userEmail'>): Promise<void> => {
    const db = getDB();
    if (db.users[uid]) {
        const user = db.users[uid].profile;
        const newTransaction: Transaction = {
            ...transaction,
            id: `txn_${Date.now()}`,
            date: new Date().toISOString(),
            userId: uid,
            userEmail: user.email,
        };
        // Add to beginning of array for chronological display
        user.transactions = [newTransaction, ...(user.transactions || [])]; 
        user.creditBalance += transaction.amount;
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