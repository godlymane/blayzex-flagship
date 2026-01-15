import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// BLAYZEX DATABASE CREDENTIALS
// These connect your website to the Google Cloud Vault
const firebaseConfig = {
  apiKey: "AIzaSyC09EHCzv8-WenQxVTdJ5pDCroJZYwn0lA",
  authDomain: "blayzexstorev2.firebaseapp.com",
  projectId: "blayzexstorev2",
  storageBucket: "blayzexstorev2.firebasestorage.app",
  messagingSenderId: "593588825280",
  appId: "1:593588825280:web:c54e88a910caa73768d125",
  measurementId: "G-YRWW0KM8ZM"
};

// Initialize Firebase (Safety Check: Only initialize if not already running)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export the database and auth tools for the rest of the app to use
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };