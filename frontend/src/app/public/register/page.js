"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const passwordSecurity_1 = __importDefault(require("@/component/passwordSecurity"));
const registerStore_1 = require("@/store/registerStore");
const successPop_1 = __importDefault(require("@/component/successPop"));
const errorpopup_1 = __importDefault(require("../../../component/errorpopup"));
const spinner_1 = require("../../../component/spinner");
const navigation_1 = require("next/navigation");
const Register = ({}) => {
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const [showError, setShowError] = (0, react_1.useState)(false);
    const { register, isLoading, error, verificationSent } = (0, registerStore_1.useAuthStore)();
    const router = (0, navigation_1.useRouter)();
    // Handle navigation to Sign In page
    const handleSigninClick = () => {
        router.push('/public/signin');
    };
    // Effect to handle success or error states
    (0, react_1.useEffect)(() => {
        console.log('verificationSent:', verificationSent, 'error:', error);
        if (verificationSent) {
            setShowSuccess(true);
            setShowError(false);
        }
        else if (error) {
            setShowError(true);
            setShowSuccess(false);
        }
    }, [verificationSent, error]);
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            firstname: firstName,
            lastname: lastName,
            email,
            password,
        };
        await register(data);
    };
    return (<div style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} id="register" className=''>
      <div style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="fixed inset-0 z-50 flex items-start justify-center bg-navbar-bg bg-opacity-50 overflow-y-auto scrollbar-auto-hide scrrollbar-thin">
        <div className="relative mt-25 bg-gradient-feature bg-white p-4 rounded-lg shadow-xl max-w-md w-full mx-4 border border-primary max-h-screen overflow-y-auto">
          {/* Close button */}
          <button onClick={() => router.back()} className="absolute top-4 right-4 text-secondary hover:text-gray-700 text-2xl font-bold leading-none">
            X
          </button>

          {/* Content */}
          <div>
            <div className="text-center mb-2">
              <h2 className="text-4xl mb-2 font-extrabold bg-gradient-to-br from-[#58a6ff] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent" style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        }}>
                MyChat
              </h2>
              <p className="text-secondary">Join the conversation</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block mb-2 text-[#e6edf3] font-medium text-sm">First Name</label>
                <input type="text" placeholder="Enter your first name" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20" value={firstName} onChange={e => setFirstName(e.target.value)}/>
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Last Name</label>
                <input type="text" placeholder="Enter your last name" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20" value={lastName} onChange={e => setLastName(e.target.value)}/>
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Email</label>
                <input type="email" placeholder="Choose an email address" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>

              <div className="mb-2">
                <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Password</label>
                <input type="password" placeholder="Create a password" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20" value={password} onChange={e => setPassword(e.target.value)}/>
                {/* Password security meter and requirements */}
                <passwordSecurity_1.default password={password} className="mt-3"/>
              </div>

            <button type="submit" disabled={isLoading} className={`w-full py-4 bg-gradient-to-br from-[#58a6ff] to-[#a855f7] rounded-xl text-white text-base font-semibold cursor-pointer transition-transform duration-200 ease-in-out mb-5 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(88,166,255,0.3)]'}`}>
  {isLoading ? 'Creating Account...' : 'Create Account'}
    </button>

  {/* Display error message if exists */}
        {error && (<div className="text-red-500 text-sm mt-2 text-center">
    {error}
  </div>)}


              <div className="text-center mt-3 text-[#e6edf3] text-sm">
                Already have an account?{' '}
                <a onClick={handleSigninClick} className="text-[#58a6ff] hover:underline cursor-pointer">
                  Sign In
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popups */}
      {showSuccess && (<successPop_1.default message={`A verification code has been sent to ${email}. Click continue to input your code.`} handleTimeout={() => setShowSuccess(false)} url="/withNavpages/verify-email" showContinueButton tempState={email}/>)}

 {/*  Error Popups */}
      {showError && !showSuccess && (<errorpopup_1.default message={error || 'An error occurred while creating your account. Please try again.'} handleTimeout={() => setShowError(false)}/>)}

       {/* Spinner */}
      {isLoading && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <spinner_1.MultiRingSpinner />
  </div>)}
    </div>);
};
exports.default = Register;
