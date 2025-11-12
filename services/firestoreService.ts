import type { User, CompanyProfile, GeneratedDocument, Transaction, AdminActionLog } from '../types';

// This service simulates a Firestore database using the browser's local storage.
const DB_KEY = 'firestore_mock_db';

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
}

const getDB = (): MockDB => {
  try {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : { users: {}, adminActionLogs: {} };
  } catch (e) {
    console.error("Failed to parse mock DB from localStorage", e);
    return { users: {}, adminActionLogs: {} };
  }
};

const saveDB = (db: MockDB) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save mock DB to localStorage", e);
  }
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
  if (db.users[uid]) {
    return db.users[uid].profile;
  }
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
  return newUser;
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
