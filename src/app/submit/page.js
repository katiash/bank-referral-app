'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState('');
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push('/'); // redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async () => {
    if (!bank || !referralLink) return;
    await addDoc(collection(db, 'referrals'), {
      user: user.displayName,
      bank,
      referralLink,
    });
    setBank('');
    setReferralLink('');
    alert('Referral submitted!');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 text-gray-800">
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
        <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border object-cover"
        />
        <div className="leading-tight">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-semibold text-gray-800">{user.displayName}</p>
        </div>
        </div>

        <h1 className="text-2xl font-bold text-green-700 mb-4">Submit a Referral</h1>
        <p className="text-sm mb-6 text-gray-500">
        Share a bank or card referral you&apos;d like others to benefit from.
        </p>

        <input
        type="text"
        placeholder="Bank name (e.g. Capital One)"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
        type="text"
        placeholder="Referral link"
        value={referralLink}
        onChange={(e) => setReferralLink(e.target.value)}
        className="w-full p-2 mb-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
        Submit Referral
        </button>
    </div>
    </main>
  );
}
