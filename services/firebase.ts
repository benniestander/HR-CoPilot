import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9yDcm6qSU-Q7UA9YrE3J3KZXEBqbQT2U",
  authDomain: "daily-affection-ugq98.firebaseapp.com",
  projectId: "daily-affection-ugq98",
  storageBucket: "daily-affection-ugq98.appspot.com",
  messagingSenderId: "319019411756",
  appId: "1:319019411756:web:60dbde136cf8b57a9aa489"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
