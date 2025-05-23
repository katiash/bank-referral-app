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
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{ref.bank}</h2>
        <span className="text-xs text-gray-500">{ref.accountType}</span>
      </div>

      <div className="mb-2">
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
        <p className="text-sm text-gray-700 mt-2">
          <strong>Friend Gets:</strong> {ref.friendBenefit}
        </p>
      )}

      {displayDate && (
        <p className="text-xs text-gray-500 mt-2">
          Submitted on: {displayDate}
        </p>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Submitted by: {ref.user || 'Anonymous'}
      </div>
    </div>
  );
}
  