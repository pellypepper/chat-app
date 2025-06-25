'use client';

import React, { useState } from 'react';

type ErrorPopupProps = {
  message: string;
  handleTimeout?: () => void; 
  handleSendResetLink?: () => void; 
};

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  message,
  handleTimeout,
  handleSendResetLink
}) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (handleTimeout) handleTimeout();
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-[#161b22] w-[90%] max-w-md rounded-2xl p-6 shadow-lg relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-500"
        >
          &times;
        </button>

        {/* Error Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white text-2xl mb-4">
            !
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Message Failed</h2>
          <p className="text-sm text-gray-400 mb-6">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg border border-gray-600 text-white bg-[#0d1117] hover:bg-[#1a1f2b] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSendResetLink}
            className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;