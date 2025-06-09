'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

type SuccessPopupProps = {
  message: string;
    showContinueButton?: boolean;
  handleTimeout?: () => void;
  tempState?: string | null;
  url?: string;
};

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, showContinueButton, handleTimeout, url, tempState }) => {
  const router = useRouter();

  const handleContinue = () => {
    if (handleTimeout) handleTimeout();

    const path = url
      ? tempState
        ? `${url}?tempState=${encodeURIComponent(tempState)}`
        : url
      : '/';

    router.push(path);
  };

  return (
    <div id="success-popup" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-primary rounded-2xl p-8 max-w-md w-full relative shadow-lg">
        <button
          onClick={handleTimeout}
          className="absolute top-3 right-4 text-2xl text-white hover:text-red-400"
        >
          &times;
        </button>

        <div className="flex flex-col items-center success-popup">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-3xl mb-4">
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Success!</h2>
          <p className="text-sm text-gray-300 text-center">{message}</p>
        </div>

        <svg className="w-16 h-16 mt-6 mx-auto text-green-500" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" />
          <path d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>

       {showContinueButton && (
  <div className="mt-6 text-center">
    <button
      className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition"
      onClick={handleContinue}
    >
      Continue
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default SuccessPopup;
