'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PasswordSecurity, { passwordRequirements } from '@/component/passwordSecurity';
import { useProfileStore } from '@/store/profileStore';
import SuccessPopup from '@/component/successPop';
import ErrorPopup from '@/component/errorpopup';


interface ResetPasswordProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({ onClose, onSuccess }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const { resetPassword } = useProfileStore();

  // Validate password requirements
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const metRequirements = passwordRequirements.filter(req => req.test(newPassword)).length;

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (metRequirements < 4) {
      newErrors.newPassword = 'Password does not meet requirements';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle modal close
  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setIsLoading(false);
    setProgress(0);
    setIsSuccess(false);
    setShowError(false);
    onClose();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);

    try {

      await resetPassword({ token, newPassword, email });
      setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => {
              setIsLoading(false);
              onSuccess?.();
              setIsSuccess(true);
       
                 
        
              router.push('/public/signin');
                     handleClose();
                     
            }, 3000);
     

    } catch (error) {
      console.error('Password reset error:', error);
      setIsLoading(false);
      setProgress(0);
      setShowError(true);
      setErrors({ newPassword: 'Failed to reset password. Try again.' });
    }
  };

  // Validate confirm password on change
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [newPassword, confirmPassword]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full relative animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="text-center p-8 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              🔑
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-400 text-sm">
              Create a new secure password for your account
            </p>
          </div>

          {isLoading ? (
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                <h3 className="text-xl font-medium text-white mb-2">Updating Password...</h3>
                <p className="text-gray-400 text-sm">Please wait while we update your password</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-8 pb-8">
              {/* New Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>
                )}
                <PasswordSecurity password={newPassword} />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : confirmPassword && newPassword === confirmPassword
                        ? 'border-green-500'
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Success Popup */}
      {isSuccess && (
        <SuccessPopup
           showContinueButton
          message={`Your password has been rest successuly, redirecting to Signin page.`}
          handleTimeout={() => setIsSuccess(false)}
          url="/withNavpages/signin"
        />
      )}

      {/* Error Popup */}
      {showError && (
        <ErrorPopup
   
    
            handleTimeout={() => setShowError(false)}
          message="unable to reset your password ."
        />
      )}
    </>
  );
}