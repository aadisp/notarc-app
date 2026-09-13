import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdX9NdewlSheIjcZ6QEc9F5JlYYXlkxYY",
  authDomain: "notarc-4f346.firebaseapp.com",
  projectId: "notarc-4f346",
  storageBucket: "notarc-4f346.firebasestorage.app",
  messagingSenderId: "38833429595",
  appId: "1:38833429595:web:35ca5b932e878430f6b37e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage =
  getStorage(app);
  
export default app;