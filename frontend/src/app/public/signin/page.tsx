'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/loginStore';
import SuccessPopup from '@/component/successPop';
import ErrorPopup from '@/component/errorpopup';
import { MultiRingSpinner } from '@/component/spinner';
import SigninForm from '@/component/signinForm';
import SigninHeader from '@/component/signinHeader';

const Signin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login, isAuthenticated, googleLogin, isLoading, error } = useAuthStore();

  // Redirect when logged in
  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      const timer = setTimeout(() => router.push('/dashboard'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      setShowError(true);
      return;
    }

    setFormError(null);
    await login({ email: email.toLowerCase(), password });

    // Show popup immediately if backend error exists
    if (useAuthStore.getState().error) {
      setShowError(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      if (isAuthenticated) router.push('/dashboard');
    } catch (err) {
      console.error('Google login failed:', err);
      setFormError('Google login failed. Please try again.');
      setShowError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white bg-gradient-feature p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-secondary hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <SigninHeader />
        <SigninForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          onForgotPassword={() => router.push('/public/forget-password')}
          onRegisterClick={() => router.push('/public/register')}
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <MultiRingSpinner />
        </div>
      )}

      {showSuccess && (
        <SuccessPopup
          message="Login successful! Redirecting to your dashboard."
          handleTimeout={() => {}}
          showContinueButton={false}
          url="/dashboard"
          tempState={null}
        />
      )}

      {showError && (
        <ErrorPopup
          message={formError || error || 'Login failed. Please try again.'}
          handleTimeout={() => setShowError(false)}
          handleSendResetLink={() => setShowError(false)}
        />
      )}
    </div>
  );
};

export default Signin;
