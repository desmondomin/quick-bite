// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2QgF8SAg8bqSdyb2u1TaTi2jk5v5mHkE",
  authDomain: "quick-bite-6f9a2.firebaseapp.com",
  projectId: "quick-bite-6f9a2",
  storageBucket: "quick-bite-6f9a2.firebasestorage.app",
  messagingSenderId: "654720401212",
  appId: "1:654720401212:web:b8868b58a300594b60e839"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);