'use client';

import { useState } from 'react';

import SuccessPopup from '@/component/successPop';
import ErrorPopup from '@/component/errorpopup';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profileStore';

export default function ForgotPassword() {
 
 const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const {forgotPassword } = useProfileStore();
  const [email, setEmail] = useState('')

// Handle sending reset link
 const handleSendResetLink = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await forgotPassword(email);

      setShowSuccess(true);
    
  } catch {
    setShowError(true);
  }
};

// Handle timeout for success/error popups
  const handleTimeout = () => {
    setShowSuccess(false);
    setShowError(false);
    window.history.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center" id="forgot-screen">
      {showSuccess && (
        <SuccessPopup
          message="Activation link sent to your email. Click the link in your email to continue. The link will expire in 1 hour."
          handleTimeout={handleTimeout}

        />
      )}
      {showError && (
        <ErrorPopup
          message="An error occurred while sending the reset link. Please try again later."
          handleTimeout={handleTimeout}
          
        />
      )}

      <div className="bg-[#161b22] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-primary w-[380px] h-[640px] transition-transform hover:-translate-y-1 overflow-hidden relative z-10">
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center text-secondary cursor-pointer" onClick={() => window.history.back()}>
            <ArrowLeft className="w-10 h-10 text-primary mr-2" />
          </div>
        </div>

        <div className="flex flex-col justify-center h-full px-10 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#58a6ff] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent">
              ChatFlow
            </h1>
            <p className="text-secondary mt-2 text-sm">Reset your password</p>
          </div>

          <form onSubmit={handleSendResetLink}>
            <div className="mb-5">
              <label className="block mb-2 text-[#e6edf3] text-sm font-medium">
                Email Address
              </label>
              <input
 onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                className="w-full p-4 bg-tertiary-bg border border-primary rounded-xl text-primary text-base focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/10"
              />
            </div>

            <button
              type="submit"
            
              className="w-full p-4 mb-5 bg-gradient-to-r from-[#58a6ff] to-[#a855f7] rounded-xl text-white text-base font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(88,166,255,0.3)] transition"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-8 text-sm">
              Remember your password?{' '}
              <a href="#" className="text-[#58a6ff] hover:underline" onClick={() => router.push('/withNavpages/signin')}>
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
