import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAfNB-idKEtfh1FjJDTcpbg-pT_aLxI3m0",
    authDomain: "api-project-940592029946.firebaseapp.com",
    projectId: "api-project-940592029946",
    storageBucket: "api-project-940592029946.firebasestorage.app",
    messagingSenderId: "940592029946",
    appId: "1:940592029946:web:bc3449b4ca6920e1e5a943",
    measurementId: "G-V2Q067FD16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
