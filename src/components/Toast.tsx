'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  type?: 'success' | 'error';
  duration?: number;
}

export default function Toast({ message, show, type = 'success', duration = 2000 }: ToastProps) {

  if (!show) return null;

  return (
    <div
    className={`
      fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50
      text-sm transition-all duration-300 ease-in-out
      ${show ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}
      ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
    `}
  >
      {message}
    </div>
  );
}