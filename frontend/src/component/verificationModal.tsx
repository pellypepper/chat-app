'use client';
import React from 'react';

type VerificationModalProps = {
  tempState: string | null;
  children: React.ReactNode;
  seconds: number;
  resendAvailable: boolean;
  onResend?: () => void;
  onVerify: () => void;
  onCancel: () => void;
};

const VerificationModal: React.FC<VerificationModalProps> = ({
  tempState,
  children,
  seconds,
  resendAvailable,
  onResend,
  onVerify,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#161b22] w-[90%] max-w-md rounded-2xl p-6 shadow-lg relative">
        <button className="absolute top-4 right-4 text-white text-2xl hover:text-red-500">
          &times;
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl mb-4">
            🔐
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">Enter Verification Code</h2>
          <p className="text-sm text-gray-400">
            We've sent a 6-digit code to this email {tempState}. Please enter it below to verify your account.
          </p>
        </div>

        {children}

        <div className="text-center text-sm text-gray-400">
          {resendAvailable ? (
            <button onClick={onResend} className="text-blue-400 hover:underline transition">
              Resend Code
            </button>
          ) : (
            <>Resend code in <span className="text-white font-semibold">{seconds}</span> seconds</>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-600 text-white bg-[#0d1117] hover:bg-[#1a1f2b] transition"
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition"
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
