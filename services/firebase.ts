
import { initializeApp } from 'firebase/app';

// This configuration uses placeholder values to allow the application to initialize
// without crashing due to missing environment variables. In a real-world deployment, 
// these values would be replaced with actual Firebase project credentials.
// Authentication has been removed from this file as it was not functional with placeholders.
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "project-id.firebaseapp.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890abcdef"
};

initializeApp(firebaseConfig);
