import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This placeholder configuration is used to resolve the "auth/invalid-api-key"
// error that occurs when environment variables are not defined.
// In a real-world application, these values would be replaced with actual
// Firebase project credentials.
const firebaseConfig = {
    apiKey: "AIzaSyC_placeholder_api_key",
    authDomain: "placeholder-project.firebaseapp.com",
    projectId: "placeholder-project",
    storageBucket: "placeholder-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890abcdef",
    measurementId: "G-ABCDEFGHIJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
