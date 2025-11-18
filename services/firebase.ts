import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9yDcm6qSU-Q7UA9YrE3J3KZXEBqbQT2U",
  authDomain: "daily-affection-ugq98.firebaseapp.com",
  projectId: "daily-affection-ugq98",
  storageBucket: "daily-affection-ugq98.firebasestorage.app",
  messagingSenderId: "319019411756",
  appId: "1:319019411756:web:60dbde136cf8b57a9aa489",
  measurementId: "G-8D070Q2TZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
