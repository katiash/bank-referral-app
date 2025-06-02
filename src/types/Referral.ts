// src/types/Referral.ts
export interface Referral {
    uid: string;
    id: string;
    bank: string;
    referral: string;
    referralType: 'code' | 'link';
    referralTerms?: string;
    friendBenefit?: string;
    accountType?: string;
    cashbackAvailable?: boolean;
    earningLimit?: string;
    user?: string; // ✅ this is used to match current user's UID
    createdAt?: { toDate: () => Date };
  }