// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqt5pYzOMm0x-kxFwNEU91pRBkmEefp74",
  authDomain: "couponfollow-6dcc7.firebaseapp.com",
  projectId: "couponfollow-6dcc7",
  storageBucket: "couponfollow-6dcc7.firebasestorage.app",
  messagingSenderId: "84046592563",
  appId: "1:84046592563:web:b8455e69f0f5564fbfc146"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

