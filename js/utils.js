// Initialize utils object if it doesn't exist
window.utils = window.utils || {};

// Simple notification function at the very top
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.id = 'notificationContainer';
        document.body.appendChild(container);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Set icon
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="notification-content">
            <p>${message}</p>
        </div>
    `;

    container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
        if (container.children && container.children.length === 0) {
            container.remove();
        }
    }, 3000);
}

// Make it globally available
window.showNotification = showNotification;

// Add email validation to utils
utils.validateEmail = function (email) {
    if (!email) return true; // Email is optional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Add phone validation to utils
utils.validatePhone = function (phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
};

// Add password validation to utils
utils.validatePassword = function (password) {
    // At least 6 characters
    return password.length >= 6;
};
