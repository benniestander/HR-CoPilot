
// This file is deprecated and replaced by services/dbService.ts
// These dummy exports prevent runtime crashes if cached code still tries to import them.
export const updateUser = async () => {};
export const getGeneratedDocuments = async () => [];
export const saveGeneratedDocument = async () => {};
export const addTransactionToUser = async () => {};
export const getAllUsers = async () => ({ data: [], lastVisible: null });
export const getAllDocumentsForAllUsers = async () => ({ data: [], lastVisible: null });
export const getAdminActionLogs = async () => ({ data: [], lastVisible: null });
export const updateUserByAdmin = async () => null;
export const adjustUserCreditByAdmin = async () => null;
export const changeUserPlanByAdmin = async () => null;
export const getAdminNotifications = async () => [];
export const markNotificationAsRead = async () => {};
export const markAllNotificationsAsRead = async () => {};
export const simulateFailedPaymentForUser = async () => {};
export const getUserFiles = async () => [];
export const uploadUserFile = async () => {};
export const getDownloadUrlForFile = async () => '';
export const deleteUserFile = async () => {};
export const uploadProfilePhoto = async () => '';
export const deleteProfilePhoto = async () => {};
export const createCoupon = async () => {};
export const getCoupons = async () => [];
export const deactivateCoupon = async () => {};
export const validateCoupon = async () => ({ valid: false, message: 'Service deprecated' });
export const getUserProfile = async () => null;
export const createUserProfile = async () => null;
