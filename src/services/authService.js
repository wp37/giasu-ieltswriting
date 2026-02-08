// Authentication & User Management Service for IELTS Writing Tool
// Manages admin login and user registration with payment verification

// Safe localStorage helpers
const getStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    return null;
};

const safeGetItem = (key) => {
    const storage = getStorage();
    if (!storage) return null;
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
};

const safeSetItem = (key, value) => {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(key, value);
    } catch {
        // Ignore storage errors
    }
};

const safeRemoveItem = (key) => {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(key);
    } catch {
        // Ignore storage errors
    }
};

// Bank Info for Payment
export const BANK_INFO = {
    bankName: 'Agribank',
    accountNumber: '7110215003073',
    accountHolder: 'VO NGOC TUNG',
    amount: '100.000đ',
    // VietQR URL for QR code display
    qrUrl: 'https://img.vietqr.io/image/agribank-7110215003073-compact2.png?amount=100000&addInfo=IELTS&accountName=VO%20NGOC%20TUNG',
};

const STORAGE_KEYS = {
    ADMIN_LOGGED_IN: 'ielts_admin_logged_in',
    USER_PHONE: 'ielts_user_phone',
    USER_FULL_NAME: 'ielts_user_full_name',
    PENDING_REGISTRATIONS: 'ielts_pending_registrations',
    ACTIVATED_REGISTRATIONS: 'ielts_activated_registrations',
};

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Tung123',
};

/**
 * Validate admin credentials
 */
export const validateAdminCredentials = (username, password) => {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

/**
 * Check if admin is currently logged in
 */
export const isAdmin = () => {
    return safeGetItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
};

/**
 * Log in as admin
 */
export const loginAdmin = () => {
    safeSetItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
};

/**
 * Log out admin
 */
export const logoutAdmin = () => {
    safeRemoveItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
};

/**
 * Get current user's phone number
 */
export const getCurrentUserPhone = () => {
    return safeGetItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Get current user's full name
 */
export const getCurrentUserName = () => {
    return safeGetItem(STORAGE_KEYS.USER_FULL_NAME);
};

/**
 * Set current user's info
 */
export const setCurrentUser = (phone, fullName) => {
    safeSetItem(STORAGE_KEYS.USER_PHONE, phone);
    safeSetItem(STORAGE_KEYS.USER_FULL_NAME, fullName);
};

/**
 * Get list of pending registrations
 */
export const getPendingRegistrations = () => {
    try {
        return JSON.parse(safeGetItem(STORAGE_KEYS.PENDING_REGISTRATIONS) || '[]');
    } catch {
        return [];
    }
};

/**
 * Get list of activated registrations
 */
export const getActivatedRegistrations = () => {
    try {
        return JSON.parse(safeGetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS) || '[]');
    } catch {
        return [];
    }
};

/**
 * Check if current user is activated
 */
export const isUserActivated = () => {
    const userPhone = getCurrentUserPhone();
    if (!userPhone) return false;

    const activatedRegs = getActivatedRegistrations();
    return activatedRegs.some(reg => reg.phone === userPhone);
};

/**
 * Check if user can access premium features
 */
export const canAccessPremiumFeature = () => {
    return isAdmin() || isUserActivated();
};

/**
 * Register a user with phone and full name
 */
export const registerUser = (phone, fullName) => {
    // Validate phone format (Vietnamese: 10-11 digits starting with 0)
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(phone)) {
        return { success: false, error: 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)' };
    }

    // Validate full name
    if (!fullName || fullName.trim().length < 2) {
        return { success: false, error: 'Vui lòng nhập họ và tên đầy đủ' };
    }

    // Check for duplicates
    const pendingRegs = getPendingRegistrations();
    const activatedRegs = getActivatedRegistrations();

    if (pendingRegs.some(reg => reg.phone === phone)) {
        return { success: false, error: 'Số điện thoại này đang chờ duyệt' };
    }

    if (activatedRegs.some(reg => reg.phone === phone)) {
        return { success: false, error: 'Số điện thoại này đã được kích hoạt' };
    }

    // Create registration
    const newReg = {
        phone,
        fullName: fullName.trim(),
        registeredAt: new Date().toISOString(),
    };

    // Add to pending list
    pendingRegs.push(newReg);
    safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pendingRegs));

    // Set as current user
    setCurrentUser(phone, fullName.trim());

    return { success: true };
};

/**
 * Activate a user registration
 */
export const activateUser = (phone) => {
    const pendingRegs = getPendingRegistrations();
    const regToActivate = pendingRegs.find(reg => reg.phone === phone);

    if (!regToActivate) return;

    // Remove from pending
    const newPendingRegs = pendingRegs.filter(reg => reg.phone !== phone);
    safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(newPendingRegs));

    // Add to activated
    const activatedRegs = getActivatedRegistrations();
    if (!activatedRegs.some(reg => reg.phone === phone)) {
        activatedRegs.push(regToActivate);
        safeSetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS, JSON.stringify(activatedRegs));
    }
};

/**
 * Reject a pending registration
 */
export const rejectUser = (phone) => {
    const pendingRegs = getPendingRegistrations().filter(reg => reg.phone !== phone);
    safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pendingRegs));
};

/**
 * Deactivate a user
 */
export const deactivateUser = (phone) => {
    const activatedRegs = getActivatedRegistrations().filter(reg => reg.phone !== phone);
    safeSetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS, JSON.stringify(activatedRegs));
};

/**
 * Check if phone is pending
 */
export const isPhonePending = (phone) => {
    return getPendingRegistrations().some(reg => reg.phone === phone);
};

/**
 * Check if phone is activated
 */
export const isPhoneActivated = (phone) => {
    return getActivatedRegistrations().some(reg => reg.phone === phone);
};

export default {
    BANK_INFO,
    validateAdminCredentials,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentUserPhone,
    getCurrentUserName,
    setCurrentUser,
    getPendingRegistrations,
    getActivatedRegistrations,
    isUserActivated,
    canAccessPremiumFeature,
    registerUser,
    activateUser,
    rejectUser,
    deactivateUser,
    isPhonePending,
    isPhoneActivated,
};
