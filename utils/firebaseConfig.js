// utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAS1211jIXvw-kdRw7p-U7OwdxwfR-XHUo",
  authDomain: "friends-referrals-ba336.firebaseapp.com",
  projectId: "friends-referrals-ba336",
  storageBucket: "friends-referrals-ba336.firebasestorage.app",
  messagingSenderId: "600744693034",
  appId: "1:600744693034:web:8abf054572f4591384a253"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
console.log("🔥 Firebase initialized!");