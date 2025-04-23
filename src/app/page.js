'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';

import ReferralCard from '../components/ReferralCard';
import ReferralForm from '../components/ReferralForm';

export default function Home() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [bank, setBank] = useState('');
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
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
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">💸 Bank Referral MVP</h1>

        {!user ? (
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Sign in with Google
          </button>
        ) : (
          <>
            <p className="text-sm mb-4">Signed in as <strong>{user.displayName}</strong></p>
            <button
              onClick={() => signOut(auth)}
              className="text-red-500 hover:underline text-sm mb-4"
            >
              Log out
            </button>

            <ReferralForm
              bank={bank}
              setBank={setBank}
              referralLink={referralLink}
              setReferralLink={setReferralLink}
              onSubmit={addReferral}
            />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">All Referrals</h3>
              <ul className="space-y-3">
                {referrals.map((ref) => (
                  <ReferralCard
                    key={ref.id}
                    bank={ref.bank}
                    user={ref.user}
                    referralLink={ref.referralLink}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
