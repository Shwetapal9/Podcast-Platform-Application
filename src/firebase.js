// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCH7i9qlCnoG4q-N_SO7_SQ9OA9FEfrhQ",
  authDomain: "podcast-platform-59ea9.firebaseapp.com",
  projectId: "podcast-platform-59ea9",
  storageBucket: "podcast-platform-59ea9.appspot.com",
  messagingSenderId: "654691474440",
  appId: "1:654691474440:web:143febc8ebf384e5ec85bd",
  measurementId: "G-FRCVRBT341",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
