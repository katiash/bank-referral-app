export default function ReferralCard({ bank, user, referralLink }) {
    return (
      <li className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition">
        <div className="font-semibold text-gray-800">{bank}</div>
        <div className="text-sm text-gray-500">Shared by: {user}</div>
        {referralLink && (
          <a
            href={referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-blue-600 hover:underline text-sm"
          >
            Use Referral
          </a>
        )}
      </li>
    );
  }
  