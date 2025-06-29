"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPasswordModal;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const outline_1 = require("@heroicons/react/24/outline");
const passwordSecurity_1 = __importStar(require("@/component/passwordSecurity"));
const profileStore_1 = require("@/store/profileStore");
const successPop_1 = __importDefault(require("@/component/successPop"));
const errorpopup_1 = __importDefault(require("@/component/errorpopup"));
function ResetPasswordModal() {
    const [newPassword, setNewPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [showNewPassword, setShowNewPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [isSuccess, setIsSuccess] = (0, react_1.useState)(false);
    const [showError, setShowError] = (0, react_1.useState)(false);
    const searchParams = (0, navigation_1.useSearchParams)();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    const router = (0, navigation_1.useRouter)();
    const { resetPassword } = (0, profileStore_1.useProfileStore)();
    // Validate password requirements
    const validateForm = () => {
        const newErrors = {};
        const metRequirements = passwordSecurity_1.passwordRequirements.filter(req => req.test(newPassword)).length;
        if (!newPassword) {
            newErrors.newPassword = 'Password is required';
        }
        else if (metRequirements < 4) {
            newErrors.newPassword = 'Password does not meet requirements';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }
        else if (newPassword !== confirmPassword) {
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
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setIsLoading(true);
        setProgress(0);
        try {
            await resetPassword({ token, newPassword, email });
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                router.push('/public/signin');
                handleClose();
            }, 3000);
        }
        catch (error) {
            console.error('Password reset error:', error);
            setIsLoading(false);
            setProgress(0);
            setShowError(true);
            setErrors({ newPassword: 'Failed to reset password. Try again.' });
        }
    };
    // Validate confirm password on change
    (0, react_1.useEffect)(() => {
        if (confirmPassword && newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        }
        else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.confirmPassword;
                return newErrors;
            });
        }
    }, [newPassword, confirmPassword]);
    return (<>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full relative animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Close Button */}
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800">
            <outline_1.XMarkIcon className="h-6 w-6"/>
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

          {isLoading ? (<div className="px-8 pb-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                <h3 className="text-xl font-medium text-white mb-2">Updating Password...</h3>
                <p className="text-gray-400 text-sm">Please wait while we update your password</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>) : (<form onSubmit={handleSubmit} className="px-8 pb-8">
              {/* New Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.newPassword ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'}`} placeholder="Enter new password"/>
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showNewPassword ? <outline_1.EyeSlashIcon className="h-5 w-5"/> : <outline_1.EyeIcon className="h-5 w-5"/>}
                  </button>
                </div>
                {errors.newPassword && (<p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>)}
                <passwordSecurity_1.default password={newPassword}/>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.confirmPassword
                ? 'border-red-500'
                : confirmPassword && newPassword === confirmPassword
                    ? 'border-green-500'
                    : 'border-gray-600 focus:border-blue-500'}`} placeholder="Confirm new password"/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showConfirmPassword ? <outline_1.EyeSlashIcon className="h-5 w-5"/> : <outline_1.EyeIcon className="h-5 w-5"/>}
                  </button>
                </div>
                {errors.confirmPassword && (<p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>)}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25">
                  Reset Password
                </button>
              </div>
            </form>)}
        </div>
      </div>

      {/* Success Popup */}
      {isSuccess && (<successPop_1.default showContinueButton message={`Your password has been rest successuly, redirecting to Signin page.`} handleTimeout={() => setIsSuccess(false)} url="/withNavpages/signin"/>)}

      {/* Error Popup */}
      {showError && (<errorpopup_1.default handleTimeout={() => setShowError(false)} message="unable to reset your password ."/>)}
    </>);
}
