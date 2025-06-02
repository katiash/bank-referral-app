import React from "react";

interface ReferralFormProps {
  bank: string;
  setBank: (value: string) => void;
  referralLink: string;
  setReferralLink: (value: string) => void;
  onSubmit: () => void;
}

export default function ReferralForm({
  bank,
  setBank,
  referralLink,
  setReferralLink,
  onSubmit,
}: ReferralFormProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter bank name"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        placeholder="Paste referral link"
        value={referralLink}
        onChange={(e) => setReferralLink(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={onSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Submit Referral
      </button>
    </div>
  );
}
