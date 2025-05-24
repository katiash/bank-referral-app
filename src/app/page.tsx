'use client';

import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import ReferralCard from '../components/ReferralCard';
import Link from 'next/link';
import { Referral } from '../types/Referral';
import Image from 'next/image';

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
    <main className="bg-gray-100 min-h-screen py-10 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title and Intro */}
        <div>
          <h1 className="text-3xl font-bold mb-1">💸 Find & Share Referral Codes</h1>
          <p className="text-sm text-gray-600">
            Looking for a referral code for a new credit card or bank bonus? See what others have shared — or share yours.
          </p>
        </div>

        {/* Auth / User Info */}
        {!user ? (
          <>
            <p className="text-sm">Welcome! Sign in to get started.</p>
            <button
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Sign in with Google
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={user?.photoURL || '/default-avatar.png'}
                alt="User Avatar"
                width={90}
                height={90}
                className="rounded-full border object-cover"
                // className="w-10 h-10 rounded-full border object-cover"
              />
              <div>
                <p className="text-sm text-gray-700">Signed in as <strong>{user.displayName}</strong></p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="ml-auto text-red-500 hover:underline text-sm"
              >
                Log out
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/submit"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition mr-1 mt-2"
              >
                ➕ Submit a Referral
              </Link>
            </div>

            {/* Search Filter */}
            <input
              type="text"
              placeholder="Search by bank..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            {/* Referrals List */}
            <div className="space-y-4">
              {referrals.filter(ref => ref.bank.toLowerCase().includes(filter.toLowerCase())).length === 0 ? (
                <p className="text-sm text-center text-gray-500">No referrals yet. Be the first to share one! 🙌</p>
              ) : (
                referrals
                  .filter(ref => ref.bank.toLowerCase().includes(filter.toLowerCase()))
                  .map(ref => (
                    <ReferralCard
                      key={ref.id}
                      ref={ref}
                      currentUser={user?.uid}
                      onDelete={fetchReferrals}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {/* Footer and Contact Info */}
        <div className="text-sm text-center text-gray-500 pt-10">
          Spot an error or need help removing a referral?  
          <br />
          Email me at <a href="mailto:ekaterina.shukh@gmail.com" className="text-blue-600 underline">ekaterina.shukh@gmail.com</a>
          <br />
          or message me on Instagram <a href="https://instagram.com/katiash" className="text-blue-600 underline">@katiash</a>.
        </div>

        <footer className="text-xs text-center text-gray-400">
          Made with 💛 by Katia
        </footer>
      </div>
    </main>
  );
}
