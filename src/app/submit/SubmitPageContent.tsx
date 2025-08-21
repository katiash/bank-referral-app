// 🚧 Updated SubmitPageContent.tsx with labels, descriptions, badges, and modern structure
// 💡 Fully integrated with your working logic (edit, auth, toast, routing)

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';
import Toast from '../../components/Toast';
import Image from 'next/image';

export default function SubmitPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showHelp, setShowHelp] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hideSubmitHelp') !== 'true';
    }
    return true;
  });

  const [bank, setBank] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralTerms, setReferralTerms] = useState('');
  const [friendBenefit, setFriendBenefit] = useState('');
  const [accountType, setAccountType] = useState('');
  const [cashbackAvailable, setCashbackAvailable] = useState(false);
  const [earningLimit, setEarningLimit] = useState('');

  const toggleHelp = () => {
    const newState = !showHelp;
    setShowHelp(newState);
    localStorage.setItem('hideSubmitHelp', newState ? 'false' : 'true');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.push('/');
        return;
      }

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
            setCashbackAvailable(!!data.cashbackAvailable);
            setEarningLimit(data.earningLimit || '');
          }
        }
      };

      loadReferral();
    });

    return () => unsubscribe();
  }, [referralId, router]);

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
      await updateDoc(docRef, {
        bank,
        referral: referralLink,
        referralTerms,
        friendBenefit,
        accountType,
        cashbackAvailable,
        earningLimit,
        createdAt,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'referrals'), {
        user: user.displayName,
        uid: user.uid,
        bank,
        referral: referralLink,
        referralType,
        referralTerms,
        friendBenefit,
        accountType,
        cashbackAvailable,
        earningLimit,
        createdAt: serverTimestamp(),
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
    <main className="bg-brand-light min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto space-y-6 border border-brand-light">
        <h2 className="text-2xl font-serif text-brand-dark text-center">➕ Submit a New Referral</h2>

        <div className="flex items-center gap-4">
          <Image
            src={user?.photoURL || '/default-avatar.png'}
            alt="User Avatar"
            width={70}
            height={70}
            className="rounded-full border object-cover"
          />
          <div>
            <p className="text-sm text-brand-dark">Welcome, <strong>{user?.displayName}</strong></p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="text-right">
          <button onClick={toggleHelp} className="text-xs text-brand-medium underline hover:text-brand-dark">
            {showHelp ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showHelp && (
          <div className="mb-5 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
            <p className="mb-2 font-medium">📝 Quick Tip:</p>
            <ul className="list-disc ml-5 mb-2 text-yellow-800 space-y-1">
              <li><strong>Bank Name</strong>: Displayed publicly. Try to be consistent with platform spelling.</li>
              <li><strong>Referral Link or Code</strong>: This is what friends will use to sign up.</li>
              <li><strong>Friend Benefit</strong>: Be clear about what they get — it helps them choose!</li>
              <li><strong>Account Type</strong>: Credit card? Checking? Helps users find the right type.</li>
              <li><strong>Private Notes</strong>: Use Referral Terms and Earning Limit to track personal info (won’t be shown).</li>
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {/* PUBLIC FIELDS */}
          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Bank Name <span className="ml-1 text-brand-gold text-xs">👥 Public</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Used as the title of the referral listing.</p>
            <input
              type="text"
              placeholder="e.g. Capital One"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Referral Link or Code <span className="ml-1 text-brand-gold text-xs">👥 Public</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">This is what users will copy or click to join.</p>
            <input
              type="text"
              placeholder="Paste link or code here"
              value={referralLink}
              onChange={(e) => setReferralLink(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Friend Benefit <span className="ml-1 text-brand-gold text-xs">👥 Public</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Encourages people to use your referral (e.g. &quot;$100 bonus after signup&quot;).
              </p>
            <input
              type="text"
              placeholder="$100 after 2 deposits"
              value={friendBenefit}
              onChange={(e) => setFriendBenefit(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Account Type <span className="ml-1 text-brand-gold text-xs">👥 Public</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Like &quot;Credit Card&quot;, &quot;Checking&quot;, or &quot;Savings&quot;.</p>
            <input
              type="text"
              placeholder="e.g. Credit"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cashbackAvailable}
              onChange={(e) => setCashbackAvailable(e.target.checked)}
              className="h-4 w-4 text-brand-gold border-gray-300 rounded"
            />
            <label className="text-sm text-brand-dark">
              💵 This referral offers cashback <span className="ml-1 text-brand-gold text-xs">👥 Public</span>
            </label>
          </div>

          {/* PRIVATE FIELDS */}
          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Referral Terms (notes) <span className="ml-1 text-gray-500 text-xs">🔒 Private</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Only visible to you. Use it for notes, restrictions, or tracking.</p>
            <input
              type="text"
              placeholder="e.g. Only 10 codes per year allowed"
              value={referralTerms}
              onChange={(e) => setReferralTerms(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark">
              Referrer Earning Limit <span className="ml-1 text-gray-500 text-xs">🔒 Private</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">For your records — not shown to users.</p>
            <input
              type="text"
              placeholder="e.g. $500/year"
              value={earningLimit}
              onChange={(e) => setEarningLimit(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button onClick={handleSubmit} className="bg-brand-gold text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition w-full sm:w-auto">
              Submit Referral
            </button>
            <Link href="/" className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition w-full sm:w-auto text-center">
              ← Cancel
            </Link>
          </div>
        </div>

        <Toast show={showToast} message="✅ Referral submitted!" type="success" />
      </div>
    </main>
  );
}