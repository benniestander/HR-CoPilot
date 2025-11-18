import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfNB-idKEtfh1FjJDTcpbg-pT_aLxI3m0",
  authDomain: "api-project-940592029946.firebaseapp.com",
  projectId: "api-project-940592029946",
  storageBucket: "api-project-940592029946.firebasestorage.app",
  messagingSenderId: "940592029946",
  appId: "1:940592029946:web:9b783081d9735474e5a943",
  measurementId: "G-WEXND99YBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);