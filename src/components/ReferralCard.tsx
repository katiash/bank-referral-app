'use client';

import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig'; // adjust if needed
import React, { useState } from 'react';
import { Referral } from '../types/Referral';
import Toast from './Toast';

interface Props {
  ref: Referral;
  currentUser?: string;
}

export default function ReferralCard({ ref, currentUser }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this referral?')) {
      await deleteDoc(doc(db, 'referrals', id));
      // optionally: show toast or refresh parent component
    }
  };

  const displayDate = ref.createdAt?.toDate
    ? ref.createdAt.toDate().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5 transition hover:shadow-md">
      {/* 🔝 Top section: Bank name + badges + date */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{ref.bank}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {ref.accountType && (
              <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                🏦 {ref.accountType}
              </span>
            )}
            {ref.referralType === 'code' && (
              <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                📇 Code Only
              </span>
            )}
          </div>
        </div>
        {displayDate && (
          <div className="mt-2 sm:mt-0 text-xs text-gray-500 sm:text-right">
            Submitted<br />{displayDate}
          </div>
        )}
      </div>

      {/* 💵 Cashback badge, always separate line */}
      {ref.cashbackAvailable === 'Yes' && (
        <div className="mb-3">
          <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full inline-block">
            💵 Cashback Available
          </span>
        </div>
      )}

      {/* 🔗 Referral link or code */}
      <div className="mb-3">
        {ref.referral?.startsWith('http') ? (
          <a
            href={ref.referral}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline break-words"
          >
            🔗 Open Referral Link
          </a>
        ) : (
          <p className="text-sm text-gray-700">
            <strong>Referral Code:</strong> {ref.referral}
          </p>
        )}
        <button
          onClick={() => handleCopy(ref.referral)}
          className="text-xs text-green-600 underline ml-1 hover:text-green-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Toast show={copied} message="✅ Copied to clipboard!" type="success" />
      </div>

      {/* 🎁 Friend benefit */}
      {ref.friendBenefit && (
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>Friend Gets:</strong> {ref.friendBenefit}
        </p>
      )}

      {/* 👤 Attribution */}
      <div className="mt-4 text-xs text-gray-400 flex justify-between items-center">
      <span>Submitted by: {ref.user || 'Anonymous'}</span>

      {currentUser === ref.uid && (
        <button
          onClick={() => handleDelete(ref.id)}
          className="text-red-600 hover:underline"
        >
          🗑 Delete
        </button>
      )}
    </div>
    </div>
  );
}