'use client';

import React, { Suspense } from 'react';
import SubmitPageContent from './SubmitPageContent';

export default function SubmitPageWrapper() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading form...</div>}>
      <SubmitPageContent />
    </Suspense>
  );
}