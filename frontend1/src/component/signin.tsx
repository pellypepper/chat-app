
// Signin.tsx - Fixed version with debugging
'use client';

import { useRouter } from 'next/navigation'; 

type SigninProps = {
  isOpen: boolean;
  onClose: () => void;
    openRegister: () => void; // Optional prop for register functionality
};

const Signin: React.FC<SigninProps> = ({ isOpen, onClose,  openRegister }) => {
    const router = useRouter();
  
  const handleClose = () => {

    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

   const handleRegisterClick = () => {
 
   openRegister();
       onClose();
  };

    const handleForgotPassword = () => {
    onClose(); // Close modal first
    router.push('/withNavpages/forget-password'); // Navigate to reset screen
  };

  // Don't render anything if not open
  if (!isOpen) {
 
    return null;
  }



  return (
   <div className="login">
     <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-gradient-feature  bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-secondary hover:text-gray-700 text-2xl font-bold leading-none"
        >
         X
        </button>
        
        {/* Content */}
        <div>
         <div className="text-center mb-6">
               <h2  className="text-4xl mb-2 font-extrabold bg-gradient-to-br from-[#58a6ff] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>MyChat</h2>
          <p className="text-secondary">Connect with friends instantly</p>
            </div>
          
          {/* Sample form */}
         <form>
      <div className="mb-5">
        <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Email or Username</label>
        <input
          type="text"
          placeholder="Enter your email or username"
          className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base transition focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
        />
      </div>

      <button
        type="button"
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
        <a  onClick={handleRegisterClick}  className="text-[#58a6ff] hover:underline cursor-pointer">
          Sign Up
        </a>
      </div>
    </form>
          
       
        </div>
      </div>
    </div>
   </div>
  );
};


export default Signin;

