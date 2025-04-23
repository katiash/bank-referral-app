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
    <main className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Submit a Referral</h1>
        <p className="text-sm mb-4 text-gray-600">Welcome, {user?.displayName} 👋</p>

        <input
          type="text"
          placeholder="Bank name"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Referral link"
          value={referralLink}
          onChange={(e) => setReferralLink(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </main>
  );
}
