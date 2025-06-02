'use client';

import React, { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import ReferralCard from '../components/ReferralCard';
import Link from 'next/link';
import { Referral } from '../types/Referral';
import Image from 'next/image';
import TestBox from '../components/TestBox';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchReferrals();
  }, [user]);

  const fetchReferrals = async () => {
    const snapshot = await getDocs(collection(db, 'referrals'));
    const data: Referral[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Referral[];

    const sortedData = data.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() ?? new Date(0);
      const dateB = b.createdAt?.toDate?.() ?? new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    setReferrals(sortedData);
  };

  return (

  <main className="bg-brand-light font-sans bg-watermark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
  
      {/* 🔍 TEST BLOCK START */}
      {/* <div className="bg-brand-gold text-brand-dark p-6 rounded shadow text-center">
        ✅ Tailwind *is working* with brand colors!
      </div> */}
      {/* 🔍 TEST BLOCK END */}
      <div className="max-w-4xl mx-auto space-y-10">
    
        {/* Title and Description */}
        <div className="text-center">
          <h1 className="text-4xl font-serif text-brand-dark mb-2">💸 Bank Referral Finder</h1>
          <p className="text-brand-dark text-sm max-w-lg mx-auto">
            Search and share bank or credit card referral links — with transparent rewards and terms. Help friends. Earn perks.
          </p>
        </div>

        {/* Auth Section */}
        {!user ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-brand-dark">Sign in to submit your own referral.</p>
            <button
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
              className="bg-brand-dark text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={user?.photoURL || '/default-avatar.png'}
                  alt="User Avatar"
                  width={70}
                  height={70}
                  className="rounded-full border object-cover"
                />
                <div>
                  <p className="text-sm text-brand-dark">Welcome, <strong>{user.displayName}</strong></p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="bg-brand-dark text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition"
              >
                🔓 Log Out
              </button>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by bank name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 p-2 border rounded-md text-sm"
              />
              <Link
                href="/submit"
                className="bg-brand-dark text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition"
              >
                ➕ Submit Referral
              </Link>
            </div>

            <div className="space-y-4">
              {referrals.filter(ref => ref.bank.toLowerCase().includes(filter.toLowerCase())).length === 0 ? (
                <p className="text-sm text-center text-gray-500">No referrals found. Be the first to add one! 🙌</p>
              ) : (
                referrals
                  .filter(ref => ref.bank.toLowerCase().includes(filter.toLowerCase()))
                  .map(ref => (
                    <ReferralCard
                      key={ref.id}
                      referral={{ ...ref, accountType: ref.accountType || 'Unknown', friendBenefit: ref.friendBenefit || 'None', cashbackAvailable: ref.cashbackAvailable ?? false, createdAt: ref.createdAt?.toDate?.().toISOString() || '' }}
                      isOwner={ref.user === user?.uid}
                      onDelete={fetchReferrals}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-sm text-center text-gray-500 pt-10 space-y-1">
          <p>Spot an error or want a referral removed?</p>
          <p>
            Email: <a href="mailto:ekaterina.shukh@gmail.com" className="text-brand-medium underline">ekaterina.shukh@gmail.com</a>
          </p>
          <p>
            IG: <a href="https://instagram.com/katiash" className="text-brand-medium underline">@katiash</a>
          </p>
        </div>

        <footer className="text-xs text-center text-gray-400">
          Made with 💛 by Katia
        </footer>
      </div>
    </main>
  );
}
