'use client';
import { Suspense } from 'react';
import ResetPasswordModal from '@/component/resetPasswordModal';
import { MultiRingSpinner } from '@/component/spinner';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div><MultiRingSpinner /></div>}>
      <ResetPasswordModal  />
    </Suspense>
  );
}