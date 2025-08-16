
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    projectId: "jummix-yp2lc",
    appId: "1:323209838698:web:abd5771ad9c6b71c8eca13",
    storageBucket: "jummix-yp2lc.firebasestorage.app",
    apiKey: "AIzaSyCYGt2gIFzmHhjWLs_FdIoxcrOb9C0lk0s",
    authDomain: "jummix-yp2lc.firebaseapp.com",
    messagingSenderId: "323209838698",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
