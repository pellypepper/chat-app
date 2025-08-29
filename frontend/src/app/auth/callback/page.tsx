'use client';

import React, { Suspense } from 'react';
import GoogleAuthCallbackInner from '@/component/GoogleAuthCallbackInner';

// Wrap the inner component in Suspense at the page level
export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col justify-center items-center">
        <span>Loading Google Auth Callback...</span>
      </div>
    }>
      <GoogleAuthCallbackInner />
    </Suspense>
  );
}