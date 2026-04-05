// Application Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    APP_NAME: 'Digital Visitor Entry System',
    VERSION: '2.0'
};

// API Endpoints
const ENDPOINTS = {
    // Auth
    ADMIN_LOGIN: '/auth/admin-login',
    SECURITY_LOGIN: '/auth/security-login',
    RESIDENT_LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SEND_REGISTRATION_OTP: '/auth/send-registration-otp',
    FIRST_TIME_REGISTER: '/auth/register-first-time',

    // Admin
    ADMIN_RESIDENTS: '/admin/residents',
    ADMIN_STATS: '/admin/stats',
    ADMIN_SECURITY_PASSWORD: '/admin/security-password',

    // Security
    SECURITY_VISITOR_CHECK: '/security/visitor',
    SECURITY_VISITORS: '/security/visitors',
    SECURITY_RECENT_VISITORS: '/security/visitors/recent',
    SECURITY_TODAY_VISITORS: '/security/visitors/today',

    // Resident
    RESIDENT_PROFILE: '/resident/profile',
    RESIDENT_NOTIFICATIONS: '/resident/notifications',
    RESIDENT_VISITORS: '/resident/visitors',
    RESIDENT_SEND_MOBILE_OTP: '/resident/send-mobile-otp',
    RESIDENT_CHANGE_MOBILE: '/resident/change-mobile',
    RESIDENT_CHANGE_PASSWORD: '/resident/change-password',
    RESIDENT_UPDATE_EMAIL: '/resident/update-email'
};

// Make globally available
window.CONFIG = CONFIG;
window.ENDPOINTS = ENDPOINTS;
