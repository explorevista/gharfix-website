import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCu-7TW6L_vyvWKt0AXn8VmFBq0GLy9jUQ",
  authDomain: "gharfix-pakistan.firebaseapp.com",
  projectId: "gharfix-pakistan",
  storageBucket: "gharfix-pakistan.appspot.com", // ✅ FIXED
  messagingSenderId: "317551476048",
  appId: "1:317551476048:web:c404154a010fcf4fcb4055"
};

// Initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Export functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp
};

console.log("✅ KarigarHub Firebase Connected");
