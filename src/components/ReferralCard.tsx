import React, { useState } from 'react';
import Toast from './Toast';

type Referral = {
  id: string;
  bank: string;
  referral: string;
  referralType: 'code' | 'link';
  accountType?: string;
  friendBenefit?: string;
  cashbackAvailable?: boolean;
  createdAt?: string;
};

type Props = {
  referral: Referral;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  userEmail?: string; // Optional prop for admin view
};

const ReferralCard = ({ referral, onEdit, onDelete, isOwner, userEmail }: Props) => {
  const [showToast, setShowToast] = useState(false);
  if (!referral) return null;

  const {
    bank,
    referral: referralValue,
    referralType,
    accountType,
    friendBenefit,
    cashbackAvailable,
    createdAt,
  } = referral;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralValue);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      alert('⚠️ Failed to copy');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col gap-4 transition hover:shadow-xl border border-brand-light">
      <h2 className="text-xl font-serif text-brand-dark tracking-wide flex items-center gap-2">
        {bank}
      </h2>

      <div className="flex flex-wrap gap-2">
        {accountType && (
          <span className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            🏦 {accountType}
          </span>
        )}
        {referralType === 'code' && (
          <span className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            📇 Referral Code Only
          </span>
        )}
        {cashbackAvailable && (
          <span className="bg-brand-gold text-brand-dark px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            💵 Cashback Available
          </span>
        )}
        {cashbackAvailable === false && (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            🚫 No Cashback
          </span>
        )}
      </div>

      <div className="text-sm text-brand-dark">
        <span className="font-semibold text-brand-gold">You Get: </span>
        {friendBenefit || '—'}
      </div>

      {referralType === 'link' ? (
        <div className="mt-2">
          <a
            href={referralValue}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm bg-brand-gold text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            👉 Use This Referral Link
          </a>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-brand-dark font-mono bg-brand-light px-3 py-1 rounded text-base">
            {referralValue}
          </span>
          <button
            onClick={handleCopy}
            className="bg-brand-medium text-white px-3 py-1 rounded-md text-sm hover:bg-brand-dark transition"
          >
            🗒️ Copy
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-brand-dark pt-2 border-t border-brand-light mt-4">
        {userEmail === 'ekaterina.shukh@gmail.com' && (
          <p className="text-xs text-gray-500 italic">
            Submitted by: <span className="text-gray-700">{referral?.user || 'Unknown'}</span>
          </p>
        )}
        <span>Submitted: {formattedDate}</span>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-brand-medium hover:underline font-medium"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:underline font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <Toast show={showToast} message="📋 Copied to clipboard!" type="success" />
    </div>
  );
};

export default ReferralCard;
