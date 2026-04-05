// Authentication helper functions
function isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token || !user || !loginTime) {
        return false;
    }

    // Check session timeout
    const currentTime = new Date().getTime();
    if (currentTime - parseInt(loginTime) > CONFIG.SESSION_TIMEOUT) {
        logout();
        return false;
    }

    return true;
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function getUserRole() {
    const user = getUser();
    return user ? user.role : null;
}

function getToken() {
    return localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userRole');
}

// Add authorization header to fetch requests
function authFetch(url, options = {}) {
    const token = getToken();
    
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    return fetch(url, authOptions).then(async response => {
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            window.location.href = 'index.html';
            throw new Error('Session expired. Please login again.');
        }
        return response;
    });
}