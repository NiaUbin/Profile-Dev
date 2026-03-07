import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWJ5GNDJer_rq2mHUayiYbVMLZmEfF3MM",
  authDomain: "portfolio-me-d8603.firebaseapp.com",
  projectId: "portfolio-me-d8603",
  storageBucket: "portfolio-me-d8603.firebasestorage.app",
  messagingSenderId: "395320367703",
  appId: "1:395320367703:web:ddc563cb91af2b52b2e112"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
