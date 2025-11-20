
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ------------------------------------------------------------------
// IMPORTANT: REPLACE THE VALUES BELOW WITH YOUR FIREBASE PROJECT CONFIG
// ------------------------------------------------------------------
// You can find these in the Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyC9yDcm6qSU-Q7UA9YrE3J3KZXEBqbQT2U", // Replace with your API Key
  authDomain: "daily-affection-ugq98.firebaseapp.com", // Replace with your Auth Domain
  projectId: "daily-affection-ugq98", // Replace with your Project ID
  storageBucket: "daily-affection-ugq98.firebasestorage.app", // Replace with your Storage Bucket
  messagingSenderId: "319019411756", // Replace with your Messaging Sender ID
  appId: "1:319019411756:web:1b96091517addcb99aa489", // Replace with your App ID
  measurementId: "G-HZPGDSWYPQ" // Optional
};

// Check if config is still default/placeholder
if (firebaseConfig.projectId === "daily-affection-ugq98") {
    console.warn("⚠️ WARNING: You are using the demo Firebase configuration. Data will not be saved to your own database. Please update services/firebase.ts with your own config.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services used by the application
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
