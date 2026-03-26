import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey : "AIzaSyBj80Pc-uftGBHdfUvAUmbNhTkcuiEQVN8" , 
  authDomain : "galaxymovie-d12ca.firebaseapp.com" , 
  projectId : "galaxymovie-d12ca" , 
  storageBucket : "galaxymovie-d12ca.firebasestorage.app" , 
  messagingSenderId : "720169555658" , 
  appId : "1:720169555658:web:f02d0aed9805f2d4034633" , 
  measurementId : "G-K71JCTRWHW"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();