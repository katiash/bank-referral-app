'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { doc,getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';
import Toast from '../../components/Toast';
import { serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';

export default function SubmitPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const referralId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

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

    // 🚫 Redirect if not logged in
      if (!currentUser) {
        router.push('/');
        return;
    }

     // ✅ If user is logged in AND editing a referral
     const loadReferral = async () => {
      if (referralId) {
          const docRef = doc(db, 'referrals', referralId);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBank(data.bank || '');
            setReferralLink(data.referral || '');
            setReferralTerms(data.referralTerms || '');
            setFriendBenefit(data.friendBenefit || '');
            setAccountType(data.accountType || '');
            setCashbackAvailable(data.cashbackAvailable || '');
            setEarningLimit(data.earningLimit || '');
          }
        }
    };
      loadReferral();
    });
    return () => unsubscribe();
  },  [referralId, router]);

  const handleSubmit = async () => {
    if (!bank || !referralLink || !user) return;

    const referralType = referralLink.startsWith('http') ? 'link' : 'code';
    

    if (referralId) {
      const docRef = doc(db, 'referrals', referralId);
      const docSnap = await getDoc(docRef);

     let createdAt = serverTimestamp();
     if (docSnap.exists()) {
        const data = docSnap.data();
        createdAt = data.createdAt || serverTimestamp();
      }
      // Update the existing referral
      await updateDoc(docRef, {
        bank,
        referral: referralLink,
        referralTerms,
        friendBenefit,
        accountType,
        cashbackAvailable,
        earningLimit,
        createdAt,// ✅ preserve original timestamp
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(collection(db, 'referrals'), {
        user: user.displayName,
        uid: user.uid,
        bank,
        referral: referralLink,
        referralType: referralLink.startsWith('http') ? 'link' : 'code',
        referralTerms,
        friendBenefit,
        accountType,
        cashbackAvailable,
        earningLimit,
        createdAt: serverTimestamp()
      });
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push('/');
    }, 1500);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="bg-gray-100 min-h-screen py-10 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-green-700">Submit a Referral</h1>
          <p className="text-sm text-gray-600">
            Share a bank or card referral you’d like others to benefit from.
          </p>
        </div>

        {/* Avatar + Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <Image
            src={user?.photoURL || '/default-avatar.png'}
            alt="User Avatar"
            width={90}
            height={90}
            className="rounded-full border object-cover"
            // className="w-10 h-10 rounded-full border object-cover"
          />
          <div>
            <p className="text-sm text-gray-700">Welcome back, <strong>{user?.displayName}</strong></p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mt-8">
          <input
            type="text"
            placeholder="Bank name (e.g. Capital One)"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Referral link or code"
            value={referralLink}
            onChange={(e) => setReferralLink(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Referral terms (referrer note)"
            value={referralTerms}
            onChange={(e) => setReferralTerms(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Friend benefit (what they get)"
            value={friendBenefit}
            onChange={(e) => setFriendBenefit(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Account type (e.g. Credit, Checking)"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Cashback available? (Yes / No)"
            value={cashbackAvailable}
            onChange={(e) => setCashbackAvailable(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Referral earning limit (e.g. $500/year)"
            value={earningLimit}
            onChange={(e) => setEarningLimit(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full sm:w-auto"
          >
            Submit Referral
          </button>

          <Link
            href="/"
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition w-full sm:w-auto text-center"
          >
            ⬅️ Cancel
          </Link>
        </div>

        <Toast show={showToast} message="✅ Referral submitted!" type="success" />
      </div>
    </main>
  );
}
