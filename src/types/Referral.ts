// src/types/Referral.ts
export interface Referral {
    id: string;
    bank: string;
    referral: string;
    referralType: 'code' | 'link';
    referralTerms?: string;
    friendBenefit?: string;
    accountType?: string;
    cashbackAvailable?: 'Yes' | 'No';
    earningLimit?: string;
    user?: string;
    createdAt?: { toDate: () => Date };
  }