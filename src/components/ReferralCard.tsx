'use client';

import React, { useState } from 'react';
import { Referral } from '../types/Referral';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import Toast from './Toast';

interface Props {
  ref: Referral;
  currentUser?: string;
  onDelete?: () => void;
}

export default function ReferralCard({ ref, currentUser, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this referral?')) {
      await deleteDoc(doc(db, 'referrals', id));
      if (onDelete) onDelete();
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
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-4 transition hover:shadow-lg">
      {/* 🧩 Top row: bank + date */}
      <div className="flex flex-wrap justify-between items-start mb-3 pr-2">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{ref.bank}</h2>
        {displayDate && (
          <div className="text-xs text-gray-500 text-right mt-1 sm:mt-0">
            Submitted<br />{displayDate}
          </div>
        )}
      </div>

      {/* 🏷️ Tags on their own lines */}
      <div className="flex flex-col gap-1 mt-1 mb-3">
        {ref.accountType && (
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full w-fit">
            🏦 {ref.accountType}
          </span>
        )}
        {ref.referralType === 'code' && (
          <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full w-fit">
            📇 Referral Code Only (no link)
          </span>
        )}
        {ref.cashbackAvailable === 'Yes' && (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
            💵 Cashback Available
          </span>
        )}
      </div>

      {/* 🔗 Referral info */}
      <div className="mb-3">
        {ref.referral?.startsWith('http') ? (
          <a
            href={ref.referral}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline break-words"
          >
            🔗 Open Referral Link
          </a>
        ) : (
          <p className="text-sm text-gray-800">
            <strong>Referral Code:</strong> {ref.referral}
          </p>
        )}
        <button
          onClick={() => handleCopy(ref.referral)}
          className="text-xs text-green-600 underline hover:text-green-800 ml-2"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Toast show={copied} message="✅ Copied to clipboard!" type="success" />
      </div>

      {/* 🎁 Friend benefit */}
      {ref.friendBenefit && (
        <p className="text-sm text-gray-800 font-medium leading-relaxed mb-2">
          🎁 <strong>Friend Gets:</strong> {ref.friendBenefit}
        </p>
      )}

      {/* 👤 Attribution + delete */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <span>Submitted by: {ref.user || 'Anonymous'}</span>
        {currentUser === ref.uid && (
          <button
            onClick={() => handleDelete(ref.id)}
            className="text-red-600 hover:underline ml-4"
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}