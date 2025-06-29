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
const registerStore_1 = require("@/store/registerStore");
const navigation_1 = require("next/navigation");
const successPop_1 = __importDefault(require("@/component/successPop"));
const errorpopup_1 = __importDefault(require("@/component/errorpopup"));
const spinner_1 = require("@/component/spinner");
const navigation_2 = require("next/navigation");
const verificationModal_1 = __importDefault(require("@/component/verificationModal"));
const otpInputGroup_1 = __importDefault(require("@/component/otpInputGroup"));
const VerifyCode = () => {
    const inputRefs = (0, react_1.useRef)([]);
    const [otp, setOtp] = (0, react_1.useState)(Array(6).fill(''));
    const [seconds, setSeconds] = (0, react_1.useState)(60);
    const [verificationStatus, setVerificationStatus] = (0, react_1.useState)('idle');
    const [resendAvailable, setResendAvailable] = (0, react_1.useState)(false);
    const searchParams = (0, navigation_1.useSearchParams)();
    const tempState = searchParams.get('tempState');
    const router = (0, navigation_2.useRouter)();
    const { verifyEmail, isLoading, error } = (0, registerStore_1.useAuthStore)();
    (0, react_1.useEffect)(() => {
        if (seconds === 0) {
            setResendAvailable(true);
            return;
        }
        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);
    const handleChange = (value, index) => {
        if (!/^[a-zA-Z0-9]?$/.test(value))
            return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handleVerify = async () => {
        if (!tempState)
            return;
        await verifyEmail(tempState, otp.join(''));
        if (!error) {
            setVerificationStatus('success');
            const timer = setTimeout(() => router.push('/public/signin'), 3000);
            return () => clearTimeout(timer);
        }
        else {
            setVerificationStatus('error');
        }
    };
    return (<>
      <verificationModal_1.default tempState={tempState} seconds={seconds} resendAvailable={resendAvailable} onVerify={handleVerify} onCancel={() => window.history.back()}>
        <otpInputGroup_1.default otp={otp} inputRefs={inputRefs} onChange={handleChange} onKeyDown={handleKeyDown}/>
      </verificationModal_1.default>

      {verificationStatus === 'success' && (<successPop_1.default message={`Your email is verified. Redirecting...`} handleTimeout={() => { }} url="/withNavpages/signin" tempState={null}/>)}

      {verificationStatus === 'error' && (<errorpopup_1.default message={error || 'Unable to verify your email. Please try again.'} handleTimeout={() => setVerificationStatus('idle')}/>)}

      {isLoading && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <spinner_1.MultiRingSpinner />
        </div>)}
    </>);
};
exports.default = VerifyCode;
