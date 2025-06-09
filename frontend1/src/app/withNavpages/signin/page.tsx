'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuthStore } from '@/store/loginStore';
import SuccessPopup from '@/component/successPop';
import ErrorPopup from '@/component/errorpopup';
import { MultiRingSpinner } from '@/component/spinner';

type SigninProps = {

 
};

const Signin: React.FC<SigninProps> = ({}) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local state to track success for showing popup
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Destructure auth store
  const { login,  isAuthenticated, isLoading, error } = useAuthStore();

  // When authentication changes, handle side effects
  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);

       const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
    } else if (error) {
      setShowError(true);
    }
  }, [isAuthenticated, error, router]);

  // Handle login form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    await login({ email, password });
  };

  

  // When error popup dismissed
  const handleErrorDismiss = () => {
    setShowError(false);
  };

  const handleRegisterClick = () => {
    router.push('/withNavpages/register');
  };

  const handleForgotPassword = () => {

    router.push('/withNavpages/forget-password');
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-gradient-feature bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Close button */}
        <button
 
          className="absolute top-4 right-4 text-secondary hover:text-gray-700 text-2xl font-bold leading-none"
          aria-label="Close Signin Modal"
        >
          ×
        </button>

        <div>
          <div className="text-center mb-6">
            <h2
              className="text-4xl mb-2 font-extrabold bg-gradient-to-br from-[#58a6ff] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MyChat
            </h2>
            <p className="text-secondary">Connect with friends instantly</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-[#e6edf3] font-medium text-sm">
                Email or Username
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Enter your email or username"
                className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-br from-[#58a6ff] to-[#a855f7] rounded-xl text-white text-base font-semibold cursor-pointer transition-transform duration-200 ease-in-out mb-5 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(88,166,255,0.3)]"
            >
              Sign In
            </button>

            <div className="text-center mt-5">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#58a6ff] text-sm hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center mt-7 text-[#e6edf3] text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="text-[#58a6ff] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <MultiRingSpinner />
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Login successful! Redirecting to your dashboard."
         handleTimeout={() => {}} 
           showContinueButton={false}
          url="/dashboard"
          tempState={null}
        />
      )}

      {/* Error Popup */}
      {showError && (
        <ErrorPopup
          message={error || 'Login failed. Please try again.'}
          handleTimeout={handleErrorDismiss}
        />
      )}
    </div>
  );
};

export default Signin;
