import React from 'react';

type Referral = {
  id: string;
  bank: string;
  referral: string;
  referralType: string;
  accountType: string;
  friendBenefit: string;
  cashbackAvailable: boolean;
  createdAt: string; // ISO string
};

type Props = {
  referral: Referral;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
};

const ReferralCard = ({ referral, onEdit, onDelete, isOwner }: Props) => {
  const isCashback = !!referral.cashbackAvailable;
  
  if (!referral) {
    console.warn('ReferralCard received undefined referral prop.'); 
    return null;
  }

  const {
    bank,
    referral: referralLink,
    referralType,
    accountType,
    friendBenefit,
    cashbackAvailable,
    createdAt,
  } = referral;

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col gap-4 transition hover:shadow-xl border border-brand-light">
      {/* Header: Bank Name */}
      <h2 className="text-xl font-serif text-brand-dark tracking-wide">
        {bank}
      </h2>

      {/* Badges */}
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
        {isCashback && cashbackAvailable && (
          <span className="bg-brand-gold text-brand-dark px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            💵 Cashback Available
          </span>
        )}
      </div>

      {/* Friend Benefit */}
      <div className="text-sm text-brand-dark">
        <span className="font-semibold text-brand-gold">You Get: </span>
        {friendBenefit}
      </div>

      {/* Referral Link */}
      {referralLink && (
        <div className="mt-2">
          <a
            href={referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm bg-brand-gold text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            👉 Use This Referral
          </a>
        </div>
      )}

      {/* Footer: Date + Actions */}
      <div className="flex justify-between items-center text-xs text-brand-dark pt-2 border-t border-brand-light mt-4">
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
    </div>
  );
};

export default ReferralCard;
