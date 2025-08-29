'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/loginStore';
import { MultiRingSpinner } from '@/component/spinner';

const GoogleAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, error } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        router.push('/public?error=oauth_failed');
        return;
      }

      if (success === 'true' && accessToken && refreshToken) {
        try {
          // Decode the tokens (they were URL encoded in the backend)
          const decodedAccessToken = decodeURIComponent(accessToken);
          const decodedRefreshToken = decodeURIComponent(refreshToken);
          
          await handleGoogleCallback(decodedAccessToken, decodedRefreshToken);
          
          // Redirect to dashboard on success
          router.push('/dashboard');
        } catch (err) {
          console.error('Callback processing error:', err);
          router.push('/public?error=callback_failed');
        }
      } else {
        console.error('Missing tokens in callback');
        router.push('/public?error=missing_tokens');
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router]);

  if (error) {
    return (
      <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4">
        <div className="text-red-500 text-lg font-semibold">
          Authentication Error: {error}
        </div>
        <button 
          onClick={() => router.push('/public')} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4">
      <MultiRingSpinner />
      <p className="text-lg font-semibold text-primary">
        Completing Google Sign In...
      </p>
      <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-blue-600 animate-pulse"
        />
      </div>
    </div>
  );
};

export default GoogleAuthCallback;