'use client';
import { Suspense } from 'react';
import VerifyCode from '@/component/verifyEmail';
import { MultiRingSpinner } from '@/component/spinner';

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div><MultiRingSpinner /></div>}>
      <VerifyCode />
    </Suspense>
  );
}