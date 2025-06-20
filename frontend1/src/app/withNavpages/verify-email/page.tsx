'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/registerStore';
import { useSearchParams } from 'next/navigation';
import SuccessPopup from '@/component/successPop';
import  ErrorPopup  from '@/component/errorpopup';
import { MultiRingSpinner } from '@/component/spinner';
import { useRouter } from 'next/navigation';
type VerifyCodeProps = object;

const VerifyCode: React.FC<VerifyCodeProps> = ({  }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [seconds, setSeconds] = useState(60);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');  
  const [resendAvailable, setResendAvailable] = useState(false);
const searchParams = useSearchParams();
  const tempState = searchParams.get('tempState');
  const router = useRouter();
  const {verifyEmail , isLoading, error} =  useAuthStore();



  // Countdown timer
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



  // Handle input changes
  const handleChange = (value: string, index: number) => {
  if (!/^[a-zA-Z0-9]?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle verification
const handleVerify = async () => {
  if (!tempState) return;

  await verifyEmail(tempState, otp.join(''));

  if (!error) {
    setVerificationStatus('success');

    const timer = setTimeout(() => {
      router.push('/withNavpages/signin');
    }, 3000);
    return () => clearTimeout(timer);
  } else {
    setVerificationStatus('error');
  }
};




  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#161b22] w-[90%] max-w-md rounded-2xl p-6 shadow-lg relative">
        {/* Close Button */}
        <button
        
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-500"
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl mb-4">
            🔐
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">Enter Verification Code</h2>
          <p className="text-sm text-gray-400">
            We've sent a 6-digit code to this email {tempState}. Please enter it below to verify your account.
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center mt-6 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el!; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-12 text-center rounded-lg border border-gray-700 bg-[#0d1117] text-white text-lg font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          ))}
        </div>

        {/* Timer or Resend Button */}
        <div className="text-center text-sm text-gray-400">
          {resendAvailable ? (
            <button
        
              className="text-blue-400 hover:underline transition"
            >
              Resend Code
            </button>
          ) : (
            <>Resend code in <span className="text-white font-semibold">{seconds}</span> seconds</>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
          onClick={() => window.history.back()}
            className="px-5 py-2 rounded-lg border border-gray-600 text-white bg-[#0d1117] hover:bg-[#1a1f2b] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition"
          >
            Verify Code
          </button>
        </div>
      </div>
{verificationStatus === 'success' && (
  <SuccessPopup
    message={`Your email is verified. redirecting.. to signin page.`}
    handleTimeout={()=>{} }
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
      
    </div>
  );
};

export default VerifyCode;
