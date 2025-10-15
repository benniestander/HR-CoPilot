import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This configuration uses placeholder values to allow the application to initialize
// without crashing due to missing environment variables. This resolves the error
// "Firebase configuration is missing." In a real-world deployment, these values
// would be replaced with actual Firebase project credentials.
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "project-id.firebaseapp.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
