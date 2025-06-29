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
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const loginStore_1 = require("@/store/loginStore");
const successPop_1 = __importDefault(require("@/component/successPop"));
const errorpopup_1 = __importDefault(require("@/component/errorpopup"));
const spinner_1 = require("@/component/spinner");
const signinForm_1 = __importDefault(require("@/component/signinForm"));
const signinHeader_1 = __importDefault(require("@/component/signinHeader"));
const Signin = () => {
    const router = (0, navigation_1.useRouter)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const [showError, setShowError] = (0, react_1.useState)(false);
    const [formError, setFormError] = (0, react_1.useState)(null);
    const { login, isAuthenticated, googleLogin, isLoading, error } = (0, loginStore_1.useAuthStore)();
    (0, react_1.useEffect)(() => {
        if (isAuthenticated) {
            setShowSuccess(true);
            const timer = setTimeout(() => router.push('/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
        else if (error) {
            setShowError(true);
        }
    }, [isAuthenticated, error, router]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setFormError('Please enter both email and password.');
            setShowError(true);
            return;
        }
        setFormError(null);
        await login({ email, password });
    };
    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            if (isAuthenticated)
                router.push('/dashboard');
        }
        catch (err) {
            console.error('Google login failed:', err);
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white bg-gradient-feature p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <button onClick={() => router.back()} className="absolute top-4 right-4 text-secondary hover:text-gray-700 text-2xl font-bold">
          ×
        </button>

        <signinHeader_1.default />
        <signinForm_1.default email={email} password={password} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={handleSubmit} onGoogleLogin={handleGoogleLogin} onForgotPassword={() => router.push('/withNavpages/forget-password')} onRegisterClick={() => router.push('/withNavpages/register')}/>
      </div>

      {isLoading && (<div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <spinner_1.MultiRingSpinner />
        </div>)}

      {showSuccess && (<successPop_1.default message="Login successful! Redirecting to your dashboard." handleTimeout={() => { }} showContinueButton={false} url="/dashboard" tempState={null}/>)}

      {showError && (<errorpopup_1.default message={formError || error || 'Login failed. Please try again.'} handleTimeout={() => setShowError(false)}/>)}
    </div>);
};
exports.default = Signin;
