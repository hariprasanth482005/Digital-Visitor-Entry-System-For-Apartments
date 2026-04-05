// API Service
const api = {
    // Helper function for API calls
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Add token if available
        const token = localStorage.getItem('token');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, fetchOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    adminLogin: (password) =>
        api.request(ENDPOINTS.ADMIN_LOGIN, {
            method: 'POST',
            body: JSON.stringify({ password })
        }),

    securityLogin: (password) =>
        api.request(ENDPOINTS.SECURITY_LOGIN, {
            method: 'POST',
            body: JSON.stringify({ password })
        }),

    residentLogin: (mobile, password) =>
        api.request(ENDPOINTS.RESIDENT_LOGIN, {
            method: 'POST',
            body: JSON.stringify({ mobile, password, role: 'resident' })
        }),

    forgotPassword: (mobile) =>
        api.request(ENDPOINTS.FORGOT_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({ mobile })
        }),

    resetPassword: (mobile, otp, newPassword) =>
        api.request(ENDPOINTS.RESET_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({ mobile, otp, newPassword })
        }),

    checkRegistration: (mobile, flatNumber) =>
        api.request('/auth/check-registration', {
            method: 'POST',
            body: JSON.stringify({ mobile, flatNumber })
        }),

    sendRegistrationOTP: (mobile, flatNumber) =>
        api.request(ENDPOINTS.SEND_REGISTRATION_OTP, {
            method: 'POST',
            body: JSON.stringify({ mobile, flatNumber })
        }),

    firstTimeRegister: (mobile, flatNumber, otp, password) =>
        api.request(ENDPOINTS.FIRST_TIME_REGISTER, {
            method: 'POST',
            body: JSON.stringify({ mobile, flatNumber, otp, password })
        }),

    // Admin endpoints
    admin: {
        getResidents: () =>
            api.request(ENDPOINTS.ADMIN_RESIDENTS),

        addResident: (data) =>
            api.request(ENDPOINTS.ADMIN_RESIDENTS, {
                method: 'POST',
                body: JSON.stringify(data)
            }),

        updateResident: (id, data) =>
            api.request(`${ENDPOINTS.ADMIN_RESIDENTS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            }),

        deleteResident: (id) =>
            api.request(`${ENDPOINTS.ADMIN_RESIDENTS}/${id}`, {
                method: 'DELETE'
            }),

        getStats: () =>
            api.request(ENDPOINTS.ADMIN_STATS),

        updateSecurityPassword: (password) =>
            api.request(ENDPOINTS.ADMIN_SECURITY_PASSWORD, {
                method: 'PUT',
                body: JSON.stringify({ password })
            }),

        getSecurityPassword: () =>
            api.request(ENDPOINTS.ADMIN_SECURITY_PASSWORD)
    },

    // Security endpoints
    security: {
        checkVisitor: (phone) =>
            api.request(`${ENDPOINTS.SECURITY_VISITOR_CHECK}/${phone}`),

        addVisitor: (data) =>
            api.request(ENDPOINTS.SECURITY_VISITORS, {
                method: 'POST',
                body: JSON.stringify(data)
            }),

        updateVisitorStatus: (id, status) =>
            api.request(`${ENDPOINTS.SECURITY_VISITORS}/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            }),

        getRecentVisitors: () =>
            api.request(ENDPOINTS.SECURITY_RECENT_VISITORS),

        getTodayVisitors: () =>
            api.request(ENDPOINTS.SECURITY_TODAY_VISITORS),

        getVisitorsByDate: (date) =>
            api.request(`/security/visitors/date/${date}`),

        forceNotify: (visitorId, flatNumber) =>
            api.request('/security/force-notify', {
                method: 'POST',
                body: JSON.stringify({ visitorId, flatNumber })
            })
    },

    // Resident endpoints
    resident: {
        getProfile: () =>
            api.request(ENDPOINTS.RESIDENT_PROFILE),

        getNotifications: () =>
            api.request(ENDPOINTS.RESIDENT_NOTIFICATIONS),

        markNotificationRead: (id) =>
            api.request(`${ENDPOINTS.RESIDENT_NOTIFICATIONS}/${id}/read`, {
                method: 'PUT'
            }),

        markAllNotificationsRead: () =>
            api.request(`${ENDPOINTS.RESIDENT_NOTIFICATIONS}/read-all`, {
                method: 'PUT'
            }),

        getVisitorHistory: () =>
            api.request(ENDPOINTS.RESIDENT_VISITORS),

        sendMobileOTP: (newMobile) =>
            api.request(ENDPOINTS.RESIDENT_SEND_MOBILE_OTP, {
                method: 'POST',
                body: JSON.stringify({ newMobile })
            }),

        changeMobile: (newMobile, otp) =>
            api.request(ENDPOINTS.RESIDENT_CHANGE_MOBILE, {
                method: 'PUT',
                body: JSON.stringify({ newMobile, otp })
            }),

        changePassword: (currentPassword, newPassword) =>
            api.request(ENDPOINTS.RESIDENT_CHANGE_PASSWORD, {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword })
            }),

        updateEmail: (email) =>
            api.request(ENDPOINTS.RESIDENT_UPDATE_EMAIL, {
                method: 'PUT',
                body: JSON.stringify({ email })
            })
    }
};