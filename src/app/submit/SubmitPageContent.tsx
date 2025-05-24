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
  const [cashbackAvailable, setCashbackAvailable] = useState('');
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
        <div className="text-right mb-2">
            <button
                onClick={toggleHelp}
                className="text-xs text-blue-600 underline hover:text-blue-800"
            >
                {showHelp ? 'Hide Tips' : 'Show Tips'}
            </button>
        </div>
        {showHelp && (
            <div className="mb-5 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
                <p className="mb-2 font-medium">📝 Quick Tip:</p>
                <p className="mb-2 leading-relaxed">
                For now, most fields are optional — but you can always update or delete your referral later if needed.
                </p>
                <p className="mb-2 leading-relaxed">
                Try to include helpful info for others. The <strong>Friend Benefit</strong> is especially useful — without it, your referral might not get used.
                </p>
                <ul className="list-disc ml-5 mb-2 text-yellow-800">
                <li><strong>Bank Name</strong></li>
                <li><strong>Referral Link or Code</strong></li>
                <li><strong>Account Type</strong> (e.g. Credit, Checking)</li>
                </ul>
                <p className="mb-2 leading-relaxed">
                Not sure if your card offers cashback? You can leave that blank or say “I don’t know.”  
                A quick way to check is by logging into your bank portal — if you see options like “Convert to Cash” or “Pay Back with Rewards,” it probably does.
                </p>
                <p className="leading-relaxed">
                The <strong>Referral Earning Limit</strong> is for your reference — most banks cap how many rewards you can receive per year from others using your code.
                And if anything goes wrong, feel free to contact me using the links at the bottom of the page.
                </p>
            </div>
            )}
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
            placeholder="Referrer earning limit only (e.g. $500/year) Typically, this should not matter to friends/family who use the link/code, ie will still work on their end."
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

       {/* Footer and Contact Info */}
       <div className="mt-12 text-sm text-center text-gray-500">
            Spot an error or want help removing or updating a referral?  
            <br />
            Email me at <a href="mailto:ekaterina.shukh@gmail.com" className="text-blue-600 underline">ekaterina.shukh@gmail.com</a>  
            or message me on Instagram <a href="https://instagram.com/katiash" className="text-blue-600 underline">@katiash</a>.
        </div>
        <footer className="text-xs text-center text-gray-400">
          Made with 💛 by Katia
        </footer>
    </main>
  );
}
