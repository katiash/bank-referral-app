'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  type?: 'success' | 'error';
  duration?: number;
}

export default function Toast({ message, show, type = 'success', duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(() => {}, duration);
    return () => clearTimeout(timeout);
  }, [show, duration]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-sm z-50 animate-fade-in ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {message}
    </div>
  );
}