"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fc_1 = require("react-icons/fc");
const SigninForm = ({ email, password, onEmailChange, onPasswordChange, onSubmit, onGoogleLogin, onForgotPassword, onRegisterClick, }) => (<form onSubmit={onSubmit}>
    <div className="mb-5">
      <label className="block mb-2 text-[#e6edf3] font-medium text-sm">
        Email or Username
      </label>
      <input value={email} onChange={(e) => onEmailChange(e.target.value)} type="text" placeholder="Enter your email or username" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"/>
    </div>

    <div className="mb-5">
      <label className="block mb-2 text-[#e6edf3] font-medium text-sm">Password</label>
      <input value={password} onChange={(e) => onPasswordChange(e.target.value)} type="password" placeholder="Enter your password" className="w-full px-4 py-4 bg-[#21262d] border border-[#30363d] rounded-xl text-[#e6edf3] text-base focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"/>
    </div>

    <button type="submit" className="w-full py-4 bg-gradient-to-br from-[#58a6ff] to-[#a855f7] rounded-xl text-white font-semibold transition-transform hover:-translate-y-0.5 mb-5">
      Sign In
    </button>

    <button type="button" onClick={onGoogleLogin} className="w-full px-8 py-4 flex items-center justify-center gap-2 border rounded-xl font-medium text-sm">
{(0, fc_1.FcGoogle)({ style: { fontSize: 24 } })} Continue with Google
    </button>

    <div className="text-center mt-5">
      <button type="button" onClick={onForgotPassword} className="text-[#58a6ff] text-sm hover:underline">
        Forgot Password?
      </button>
    </div>

    <div className="text-center mt-7 text-[#e6edf3] text-sm">
      Don’t have an account?{' '}
      <button type="button" onClick={onRegisterClick} className="text-[#58a6ff] hover:underline">
        Sign Up
      </button>
    </div>
  </form>);
exports.default = SigninForm;
