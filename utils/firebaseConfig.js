// utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  // apiKey: "AIzaSyAS1211jIXvw-kdRw7p-U7OwdxwfR-XHUo",
  // authDomain: "friends-referrals-ba336.firebaseapp.com",
  // projectId: "friends-referrals-ba336",
  // storageBucket: "friends-referrals-ba336.firebasestorage.app",
  // messagingSenderId: "600744693034",
  // appId: "1:600744693034:web:8abf054572f4591384a253"
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
console.log("🔥 Firebase initialized!");