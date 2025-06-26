'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/registerStore';
import { useSearchParams } from 'next/navigation';
import SuccessPopup from '@/component/successPop';
import ErrorPopup from '@/component/errorpopup';
import { MultiRingSpinner } from '@/component/spinner';
import { useRouter } from 'next/navigation';
import VerificationModal from '@/component/verificationModal';
import OtpInputGroup from '@/component/otpInputGroup';

const VerifyCode: React.FC = () => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [seconds, setSeconds] = useState(60);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendAvailable, setResendAvailable] = useState(false);

  const searchParams = useSearchParams();
  const tempState = searchParams.get('tempState');
  const router = useRouter();
  const { verifyEmail, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (seconds === 0) {
      setResendAvailable(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (value: string, index: number) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!tempState) return;

    await verifyEmail(tempState, otp.join(''));

    if (!error) {
      setVerificationStatus('success');
      const timer = setTimeout(() => router.push('/public/signin'), 3000);
      return () => clearTimeout(timer);
    } else {
      setVerificationStatus('error');
    }
  };

  return (
    <>
      <VerificationModal
        tempState={tempState}
        seconds={seconds}
        resendAvailable={resendAvailable}
        onVerify={handleVerify}
        onCancel={() => window.history.back()}
      >
        <OtpInputGroup
          otp={otp}
          inputRefs={inputRefs}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </VerificationModal>

      {verificationStatus === 'success' && (
        <SuccessPopup
          message={`Your email is verified. Redirecting...`}
          handleTimeout={() => {}}
          url="/withNavpages/signin"
          tempState={null}
        />
      )}

      {verificationStatus === 'error' && (
        <ErrorPopup
          message={error || 'Unable to verify your email. Please try again.'}
          handleTimeout={() => setVerificationStatus('idle')}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <MultiRingSpinner />
        </div>
      )}
    </>
  );
};

export default VerifyCode;
