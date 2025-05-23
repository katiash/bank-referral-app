'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [bank, setBank] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralTerms, setReferralTerms] = useState('');
  const [friendBenefit, setFriendBenefit] = useState('');
  const [accountType, setAccountType] = useState('');
  const [cashbackAvailable, setCashbackAvailable] = useState('');
  const [earningLimit, setEarningLimit] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async () => {
    if (!bank || !referralLink || !user) return;

    const referralType = referralLink.startsWith('http') ? 'link' : 'code';

    await addDoc(collection(db, 'referrals'), {
      user: user.displayName,
      bank,
      referral: referralLink,
      referralType,
      referralTerms,
      friendBenefit,
      accountType,
      cashbackAvailable,
      earningLimit,
      createdAt: new Date().toISOString(),
    });

    setBank('');
    setReferralLink('');
    setReferralTerms('');
    setFriendBenefit('');
    setAccountType('');
    setCashbackAvailable('');
    setEarningLimit('');
    alert('Referral submitted!');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={user?.photoURL ?? ''}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-semibold text-gray-800">{user?.displayName}</p>
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
        <input
          type="text"
          placeholder="Referral terms (referrer note)"
          value={referralTerms}
          onChange={(e) => setReferralTerms(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <input
          type="text"
          placeholder="Friend benefit (what they get)"
          value={friendBenefit}
          onChange={(e) => setFriendBenefit(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <input
          type="text"
          placeholder="Account type (e.g. Credit, Checking)"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <input
          type="text"
          placeholder="Cashback available? (Yes / No)"
          value={cashbackAvailable}
          onChange={(e) => setCashbackAvailable(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <input
          type="text"
          placeholder="Referral earning limit (e.g. $500/year)"
          value={earningLimit}
          onChange={(e) => setEarningLimit(e.target.value)}
          className="w-full p-2 mb-5 border rounded-md"
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
