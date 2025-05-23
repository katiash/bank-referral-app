import { useState } from 'react';

export default function ReferralCard({ ref }) {
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

  const displayDate = ref.createdAt?.toDate
    ? ref.createdAt.toDate().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-gray-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          {ref.accountType && (
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              🏦 {ref.accountType}
            </span>
          )}
          {ref.cashbackAvailable === 'Yes' && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              💵 Cashback
            </span>
          )}
          {ref.referralType === 'code' && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              📇 Code Only
            </span>
          )}
        </div>
        {displayDate && (
          <span className="text-xs text-gray-500">
            Submitted: {displayDate}
          </span>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-1">{ref.bank}</h2>

      <div className="mb-3">
        {ref.referral?.startsWith('http') ? (
          <a
            href={ref.referral}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline break-all"
          >
            🔗 Open Referral Link
          </a>
        ) : (
          <p className="text-sm text-gray-700 mb-1">
            <strong>Referral Code:</strong> {ref.referral}
          </p>
        )}

        <button
          onClick={() => handleCopy(ref.referral)}
          className="text-xs text-green-600 underline ml-1 hover:text-green-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {ref.friendBenefit && (
        <p className="text-sm text-gray-700 mt-1 leading-snug">
          <strong>Friend Gets:</strong> {ref.friendBenefit}
        </p>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Submitted by: {ref.user || 'Anonymous'}
      </div>
    </div>
  );
}