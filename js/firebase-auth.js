import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration (provided by user)
const firebaseConfig = {
    apiKey: "AIzaSyA-KhB-b0KNAUfungviZQCyO6mdUnP1-ms",
    authDomain: "digital-visitor-entry-system.firebaseapp.com",
    projectId: "digital-visitor-entry-system",
    storageBucket: "digital-visitor-entry-system.firebasestorage.app",
    messagingSenderId: "682833947038",
    appId: "1:682833947038:web:ce2a3695dcd7b57796ce8f",
    measurementId: "G-353VQEEWZG"
};

let auth;

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Global variable to store confirmationResult
    let confirmationResult = null;

    const setupRecaptcha = (containerId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': (response) => {
                    console.log("Recaptcha solved");
                }
            });
        }
    };

    const sendOTP = async (phoneNumber) => {
        if (!window.recaptchaVerifier) {
            throw new Error("Recaptcha not initialized");
        }
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        return confirmationResult;
    };

    const verifyOTP = async (otpCode) => {
        if (!confirmationResult) throw new Error("No pending OTP request");
        const result = await confirmationResult.confirm(otpCode);
        return await result.user.getIdToken();
    };

    window.firebaseAuthHelper = { setupRecaptcha, sendOTP, verifyOTP };
    console.log("Firebase Auth Helper Initialized");

} catch (error) {
    console.error("Firebase Auth Init Failed:", error);
    // Create a dummy helper to show the error directly to the user
    window.firebaseAuthHelper = {
        setupRecaptcha: () => { alert("Firebase Init Error: " + error.message); },
        sendOTP: async () => { alert("Firebase Init Error: " + error.message); throw error; },
        verifyOTP: async () => { alert("Firebase Init Error: " + error.message); throw error; }
    };
}
