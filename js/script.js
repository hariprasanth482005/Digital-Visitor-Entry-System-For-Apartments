// Common JavaScript functions used across all pages

// Show notification function is now globally defined in utils.js


// Check session timeout
function checkSessionTimeout() {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const currentTime = new Date().getTime();
        const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        if (currentTime - parseInt(loginTime) > sessionDuration) {
            // Session expired
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('currentResident');
            showNotification('Session expired. Please login again.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
    }
    return true;
}

// Initialize page with session check
function initializePage() {
    // Check session timeout on every page except login
    if (!window.location.href.includes('index.html')) {
        if (!checkSessionTimeout()) {
            return false;
        }
    }
    return true;
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

// Validate password strength
function validatePassword(password) {
    // At least 6 characters
    return password.length >= 6;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get query parameter
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Set query parameter
function setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

// Remove query parameter
function removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy: ' + err, 'error');
    });
}

// Generate random ID
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Truncate text
function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || button.textContent;
        button.classList.remove('loading');
    }
}

// Remove loading state from button
function removeButtonLoading(button) {
    button.disabled = false;
    button.innerHTML = button.getAttribute('data-original-text') || button.textContent;
    button.classList.remove('loading');
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function (e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);

            const rect = this.getBoundingClientRect();
            tooltipEl.style.position = 'fixed';
            tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 10) + 'px';
            tooltipEl.style.left = (rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2) + 'px';
            tooltipEl.style.zIndex = '9999';

            this._tooltip = tooltipEl;
        });

        tooltip.addEventListener('mouseleave', function () {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                delete this._tooltip;
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    initTooltips();

    // Initialize page with session check
    initializePage();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            }
        });
    });

    // Add loading state to form buttons
    document.querySelectorAll('form').forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.setAttribute('data-original-text', submitButton.innerHTML);

            form.addEventListener('submit', function () {
                setButtonLoading(submitButton, true);

                // Remove loading state after form submission (for demo)
                setTimeout(() => {
                    removeButtonLoading(submitButton);
                }, 2000);
            });
        }
    });
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.showNotification = showNotification;
    window.checkSessionTimeout = checkSessionTimeout;
    window.initializePage = initializePage;
    window.validateEmail = validateEmail;
    window.validatePhone = validatePhone;
    window.validatePassword = validatePassword;
    window.formatDate = formatDate;
    window.formatTime = formatTime;
    window.copyToClipboard = copyToClipboard;
    window.generateId = generateId;
    window.formatCurrency = formatCurrency;
    window.truncateText = truncateText;
    window.smoothScrollTo = smoothScrollTo;
    window.setButtonLoading = setButtonLoading;
    window.removeButtonLoading = removeButtonLoading;
}