# 🔗 Bank Referral MVP

A fast, Firebase-powered app to collect and share bank + credit card referral links — so you and your friends don't miss out on $100+ offers.

## ✨ Features

- 🔐 Google Sign-In with Firebase Auth
- 🏦 Add the banks or cards you have
- 💸 Submit your referral link (or just say you have one)
- 🔍 Search the referral list by bank name
- ✏️ Private `/submit` page (logged-in users only)
- ⚡ Built with Next.js App Router, Tailwind, and Firestore

## 🧑‍💻 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS
- **Backend:** Firebase Firestore
- **Auth:** Firebase Authentication (Google Sign-In)
- **Deploy:** Vercel
- **Firebase Project ID:** `friends-referrals-ba336`

## 🗺️ Routes

| Route      | Description                              |
|------------|------------------------------------------|
| `/`        | Homepage. View shared referrals, search  |
| `/submit`  | Private page for submitting your referral|

## ⚙️ Setup (Local Dev)

1. Clone the repo
2. Create a `.env.local` file at the root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=friends-referrals-ba336.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=friends-referrals-ba336
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=friends-referrals-ba336.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
