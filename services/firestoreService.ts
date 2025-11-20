import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, UserFile, Coupon } from '../types';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    deleteDoc,
    writeBatch,
    arrayUnion,
    increment,
    where,
    collectionGroup,
    limit,
    startAfter,
    QueryDocumentSnapshot,
    getCountFromServer,
    QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from './firebase';


// --- Notification Functions ---

export const createAdminNotification = async (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>): Promise<void> => {
    await addDoc(collection(firestore, 'adminNotifications'), {
        ...notification,
        timestamp: serverTimestamp(),
        isRead: false,
    });
};

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    const q = query(collection(firestore, 'adminNotifications'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as AdminNotification));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await updateDoc(doc(firestore, 'adminNotifications', notificationId), { isRead: true });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    const q = query(collection(firestore, 'adminNotifications'), where('isRead', '==', false));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    querySnapshot.docs.forEach(document => {
        batch.update(document.ref, { isRead: true });
    });
    await batch.commit();
};

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const userDocRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data();
        // Convert Timestamps to ISO strings
        return {
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            transactions: (data.transactions || []).map((tx: any) => ({
                ...tx,
                date: (tx.date as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            })),
        } as User;
    }
    return null;
};

export const createUserProfile = async (
    uid: string,
    email: string,
    plan: 'payg' | 'pro',
    name?: string,
    contactNumber?: string
): Promise<User> => {
    const existingUser = await getUserProfile(uid);
    if (existingUser) {
        return existingUser;
    }

    const clientTimestamp = new Date().toISOString();
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
        createdAt: clientTimestamp, // Use client time for the immediate return
    };

    await setDoc(doc(firestore, 'users', uid), {
        ...newUser,
        createdAt: serverTimestamp(), // Write server time to Firestore
    });

    if (email !== 'admin@hrcopilot.co.za') {
        await createAdminNotification({
            type: 'new_user',
            message: `New ${plan.toUpperCase()} user signed up: ${email}`,
            relatedUserId: uid,
        });
    }

    return newUser;
};

export const updateUser = async (uid: string, userData: Partial<User>): Promise<void> => {
    await updateDoc(doc(firestore, 'users', uid), userData);
}

export const addTransactionToUser = async (uid: string, transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'userEmail'>, couponCode?: string): Promise<void> => {
    const userDocRef = doc(firestore, 'users', uid);
    const user = await getUserProfile(uid);
    if (!user) return;

    let discountDetails: Transaction['discount'] | undefined = undefined;
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

            await updateDoc(doc(firestore, 'coupons', coupon.id), {
                uses: increment(1)
            });
        }
    }

    const newTransaction: Omit<Transaction, 'id'> = {
        ...transaction,
        amount: finalAmount,
        date: new Date().toISOString(),
        userId: uid,
        userEmail: user.email,
        discount: discountDetails,
    };

    const updates: any = {
        transactions: arrayUnion({ ...newTransaction, date: serverTimestamp() }),
    };

    if (transaction.description !== 'HR CoPilot Pro Subscription (12 months)') {
        updates.creditBalance = increment(finalAmount);
    }

    await updateDoc(userDocRef, updates);
};


// --- Generated Document Functions ---

export const getGeneratedDocuments = async (uid: string): Promise<GeneratedDocument[]> => {
    const docsCollectionRef = collection(firestore, 'users', uid, 'generatedDocuments');
    const q = query(docsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as GeneratedDocument));
};

export const saveGeneratedDocument = async (uid: string, docData: GeneratedDocument): Promise<void> => {
    const { id, ...dataToSave } = docData;
    const docRef = doc(firestore, 'users', uid, 'generatedDocuments', id);
    await setDoc(docRef, {
        ...dataToSave,
        createdAt: serverTimestamp(),
    }, { merge: true });
};


// --- Admin Functions ---

const logAdminAction = async (action: Omit<AdminActionLog, 'id' | 'timestamp'>) => {
    await addDoc(collection(firestore, 'adminActionLogs'), {
        ...action,
        timestamp: serverTimestamp(),
    });
};

export const updateUserByAdmin = async (adminEmail: string, targetUid: string, updates: Partial<User>): Promise<User | null> => {
    const userDocRef = doc(firestore, 'users', targetUid);
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    await updateDoc(userDocRef, updates);

    await logAdminAction({
        adminEmail,
        action: 'Updated User Profile',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { updates }
    });

    return { ...user, ...updates };
}

export const adjustUserCreditByAdmin = async (adminEmail: string, targetUid: string, amountInCents: number, reason: string): Promise<User | null> => {
    const userDocRef = doc(firestore, 'users', targetUid);
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    const newTransaction: Omit<Transaction, 'id'> = {
        date: new Date().toISOString(),
        description: `Admin adjustment: ${reason}`,
        amount: amountInCents,
        userId: targetUid,
        userEmail: user.email,
    };

    await updateDoc(userDocRef, {
        transactions: arrayUnion({ ...newTransaction, date: serverTimestamp() }),
        creditBalance: increment(amountInCents)
    });

    await logAdminAction({
        adminEmail,
        action: 'Adjusted User Credit',
        targetUserId: targetUid,
        targetUserEmail: user.email,
        details: { amountInCents, reason }
    });

    return await getUserProfile(targetUid);
};

export const changeUserPlanByAdmin = async (adminEmail: string, targetUid: string, newPlan: 'pro' | 'payg'): Promise<User | null> => {
    const userDocRef = doc(firestore, 'users', targetUid);
    const user = await getUserProfile(targetUid);
    if (!user) return null;

    const oldPlan = user.plan;
    await updateDoc(userDocRef, { plan: newPlan });

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

export const getAllUsers = async (pageSize: number, startAfterDoc?: QueryDocumentSnapshot): Promise<{ data: User[], lastVisible: QueryDocumentSnapshot | null }> => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
    }
    const q = query(collection(firestore, 'users'), ...constraints);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
            ...docData,
            createdAt: (docData.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as User;
    });
    return { data, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null };
};

export const getAllDocumentsForAllUsers = async (pageSize: number, startAfterDoc?: QueryDocumentSnapshot): Promise<{ data: GeneratedDocument[], lastVisible: QueryDocumentSnapshot | null }> => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
    }
    const q = query(collectionGroup(firestore, 'generatedDocuments'), ...constraints);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as GeneratedDocument));
    return { data, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null };
};

export const getAdminActionLogs = async (pageSize: number, startAfterDoc?: QueryDocumentSnapshot): Promise<{ data: AdminActionLog[], lastVisible: QueryDocumentSnapshot | null }> => {
    const constraints: QueryConstraint[] = [orderBy('timestamp', 'desc'), limit(pageSize)];
    if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
    }
    const q = query(collection(firestore, 'adminActionLogs'), ...constraints);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as AdminActionLog));
    return { data, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null };
};

// --- User File Storage Functions (Already using Firebase, no major changes needed) ---

export const uploadUserFile = async (uid: string, file: File, notes: string): Promise<void> => {
    if (!uid || !file) throw new Error("User ID and file are required.");
    const storagePath = `users/${uid}/files/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    await addDoc(collection(firestore, 'users', uid, 'files'), {
        name: file.name,
        notes: notes,
        size: file.size,
        storagePath: storagePath,
        createdAt: serverTimestamp(),
    });
};

export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
    if (!uid || !file) throw new Error("User ID and file are required.");
    const storagePath = `users/${uid}/profile/photo`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    await updateDoc(doc(firestore, 'users', uid), { photoURL });
    return photoURL;
};

export const deleteProfilePhoto = async (uid: string): Promise<void> => {
    if (!uid) throw new Error("User ID is required.");
    const storagePath = `users/${uid}/profile/photo`;
    const storageRef = ref(storage, storagePath);
    try {
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') throw error;
    }
    await updateDoc(doc(firestore, 'users', uid), { photoURL: null });
};

export const getUserFiles = async (uid: string): Promise<UserFile[]> => {
    if (!uid) return [];
    try {
        const q = query(collection(firestore, 'users', uid, 'files'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as UserFile));
    } catch (error) {
        console.error("Error fetching user files:", error);
        return [];
    }
};

export const getDownloadUrlForFile = async (storagePath: string): Promise<string> => {
    if (!storagePath) throw new Error("Storage path is required.");
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
};

export const deleteUserFile = async (uid: string, fileId: string, storagePath: string): Promise<void> => {
    if (!uid || !fileId || !storagePath) throw new Error("User ID, File ID, and Storage Path are required.");
    const storageRef = ref(storage, storagePath);
    try {
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') throw error;
    }
    await deleteDoc(doc(firestore, 'users', uid, 'files', fileId));
};


// --- Coupon Functions ---

export const createCoupon = async (adminEmail: string, couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>): Promise<void> => {
    const docRef = await addDoc(collection(firestore, 'coupons'), {
        ...couponData,
        createdAt: serverTimestamp(),
        uses: 0,
        isActive: true,
    });
    await logAdminAction({
        adminEmail, action: 'Created Coupon', targetUserId: 'N/A', targetUserEmail: 'N/A',
        details: { couponId: docRef.id, code: couponData.code }
    });
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const q = query(collection(firestore, 'coupons'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Coupon));
};

export const deactivateCoupon = async (adminEmail: string, couponId: string): Promise<void> => {
    const couponDocRef = doc(firestore, 'coupons', couponId);
    await updateDoc(couponDocRef, { isActive: false });
    const couponDoc = await getDoc(couponDocRef);
    await logAdminAction({
        adminEmail, action: 'Deactivated Coupon', targetUserId: 'N/A', targetUserEmail: 'N/A',
        details: { couponId, code: couponDoc.exists() ? couponDoc.data().code : 'UNKNOWN' }
    });
};

export const validateCoupon = async (uid: string, code: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> => {
    const q = query(collection(firestore, 'coupons'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return { valid: false, message: 'Coupon not found.' };

    const couponDoc = querySnapshot.docs[0];
    const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;

    if (!coupon.isActive) return { valid: false, message: 'This coupon is no longer active.' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        await updateDoc(couponDoc.ref, { isActive: false });
        return { valid: false, message: 'This coupon has expired.' };
    }
    if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) {
        await updateDoc(couponDoc.ref, { isActive: false });
        return { valid: false, message: 'This coupon has reached its usage limit.' };
    }
    if (Array.isArray(coupon.applicableTo) && coupon.applicableTo.length > 0 && !coupon.applicableTo.includes(uid)) {
        return { valid: false, message: 'This coupon is not valid for your account.' };
    }

    return { valid: true, message: 'Coupon applied successfully!', coupon };
};