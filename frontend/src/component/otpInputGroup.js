"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const OtpInputGroup = ({ otp, inputRefs, onChange, onKeyDown }) => {
    return (<div className="flex gap-3 justify-center mt-6 mb-4">
      {otp.map((digit, i) => (<input key={i} ref={el => {
                if (inputRefs.current)
                    inputRefs.current[i] = el;
            }} type="text" maxLength={1} value={digit} onChange={e => onChange(e.target.value, i)} onKeyDown={e => onKeyDown(e, i)} className="w-12 h-12 text-center rounded-lg border border-gray-700 bg-[#0d1117] text-white text-lg font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"/>))}
    </div>);
};
exports.default = OtpInputGroup;
