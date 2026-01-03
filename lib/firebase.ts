import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ------------------------------------------------------------------
// ACTION REQUIRED: PASTE YOUR REAL KEYS BELOW
// 1. Go to console.firebase.google.com
// 2. Create a project -> Click the Web icon (</>)
// 3. Copy the config keys it gives you and replace the lines below.
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC09EHCzv8-WenQxVTdJ5pDCroJZYwn0lA",
  authDomain: "blayzexstorev2.firebaseapp.com",
  projectId: "blayzexstorev2",
  storageBucket: "blayzexstorev2.firebasestorage.app",
  messagingSenderId: "593588825280",
  appId: "1:593588825280:web:c54e88a910caa73768d125",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);