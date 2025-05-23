'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';

import ReferralCard from '../components/ReferralCard';
import Link from 'next/link';


export default function Home() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [bank, setBank] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    console.log("🔍 useEffect mounted");
  
    if (!auth) {
      console.log("⚠️ auth is undefined");
      return;
    }
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("✅ Firebase returned user:", currentUser);
      } else {
        console.log("❌ No user is signed in.");
      }
      setUser(currentUser);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchReferrals();
  }, [user]);

  const fetchReferrals = async () => {
    const snapshot = await getDocs(collection(db, 'referrals'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReferrals(data);
  };

  const addReferral = async () => {
    if (!bank) return;
    await addDoc(collection(db, 'referrals'), {
      user: user.displayName,
      bank,
      referralLink,
    });
    setBank('');
    setReferralLink('');
    fetchReferrals();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-800">
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-2">💸 Find & Share Referral Codes</h1>
      <p className="text-sm text-gray-600 mb-6">
        Looking for a referral code for a new credit card or bank bonus? See what others have shared — or share yours.
      </p>
  
      {!user ? (
        <>
          <p className="mb-4">Welcome! Sign in to get started.</p>
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <p className="text-sm mb-4">Signed in as <strong>{user.displayName}</strong></p>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-9 h-9 rounded-full border object-cover"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
              <span className="text-xs text-gray-600">{user.email}</span>
            </div>
          </div>
  
          <button
            onClick={() => signOut(auth)}
            className="text-red-500 hover:underline text-sm mb-6"
          >
            Log out
          </button>
  
          <input
            type="text"
            placeholder="Search by bank..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
  
          {referrals.filter(ref => ref.bank.toLowerCase().includes(filter.toLowerCase())).length === 0 ? (
            <p className="text-sm text-center text-gray-500">No referrals yet. Be the first to share one! 🙌</p>
          ) : (
            <ul className="space-y-3">
              {referrals
                .filter((ref) => ref.bank.toLowerCase().includes(filter.toLowerCase()))
                .map((ref) => (
                  <ReferralCard key={ref.id} ref={ref} />
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  
    {user && (
      <Link
        href="/submit"
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700"
      >
        ➕
      </Link>
    )}
  
    <footer className="mt-8 text-xs text-center text-gray-400">
      Made with 💛 by Katia
    </footer>
  </main>
  );
}
