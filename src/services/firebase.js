import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-Z2VyqcWzE2q5jC-w8CS_EZ0hJTzhm1s",
  authDomain: "web-app-2fafa.firebaseapp.com",
  projectId: "web-app-2fafa",
  storageBucket: "web-app-2fafa.firebasestorage.app",
  messagingSenderId: "648128751392",
  appId: "1:648128751392:web:625e426932204dbefa9945",
  measurementId: "G-9L3X9457RK",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase Services
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- ត្រូវមានบรรทัดនេះទើបមិន Error

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
