'use client';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

type Props = {
  email: string;
  password: string;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onRegisterClick: () => void;
};

const SigninForm: React.FC<Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onRegisterClick,
}) => (
  <form onSubmit={onSubmit}>
    <div className="mb-5">
      <label className="block mb-2 text-[#e6edf3] font-medium text-sm">
        Email or Username
      </label>
      <input
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        type="text"
        placeholder="Enter your email or username"
        className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
      />
    </div>

    <div className="mb-5">
      <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Password</label>
      <input
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        type="password"
        placeholder="Enter your password"
        className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
      />
    </div>

    <button
      type="submit"
      className="w-full py-4 bg-gradient-to-br from-[#58a6ff] to-[#a855f7] rounded-xl text-white font-semibold transition-transform hover:-translate-y-0.5 mb-5"
    >
      Sign In
    </button>

    <button
      type="button"
      onClick={onGoogleLogin}
      className="w-full px-8 py-4 flex items-center justify-center gap-2 border rounded-xl font-medium text-sm"
    >
      <FcGoogle size={24} /> Continue with Google
    </button>

    <div className="text-center mt-5">
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-[#58a6ff] text-sm hover:underline"
      >
        Forgot Password?
      </button>
    </div>

    <div className="text-center mt-7 text-[#e6edf3] text-sm">
      Don’t have an account?{' '}
      <button
        type="button"
        onClick={onRegisterClick}
        className="text-[#58a6ff] hover:underline"
      >
        Sign Up
      </button>
    </div>
  </form>
);

export default SigninForm;
