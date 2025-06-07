'use client';

import React from "react";

export interface PasswordRequirement {
  id: string;
  text: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  { id: 'length', text: 'At least 8 characters long', test: (p) => p.length >= 8 },
  { id: 'uppercase', text: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', text: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', text: 'One number', test: (p) => /\d/.test(p) },
  { id: 'special', text: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

export function getPasswordStrength(password: string) {
  const metRequirements = passwordRequirements.filter(req => req.test(password)).length;
  if (password.length === 0) return { level: 'none', text: 'Enter a password to see strength', color: 'bg-gray-600' };
  if (metRequirements <= 2) return { level: 'weak', text: 'Weak password', color: 'bg-red-500' };
  if (metRequirements === 3) return { level: 'fair', text: 'Fair password', color: 'bg-orange-500' };
  if (metRequirements === 4) return { level: 'good', text: 'Good password', color: 'bg-green-500' };
  return { level: 'strong', text: 'Strong password', color: 'bg-gradient-to-r from-blue-500 to-purple-500' };
}

export function getStrengthWidth(password: string) {
  const metRequirements = passwordRequirements.filter(req => req.test(password)).length;
  return `${(metRequirements / passwordRequirements.length) * 100}%`;
}

type PasswordSecurityProps = {
  password: string;
  className?: string;
};

const PasswordSecurity: React.FC<PasswordSecurityProps> = ({ password, className }) => {
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className={`mb-6 ${className || ''}`}>
      {/* Strength bar */}
      {password && (
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
              style={{ width: getStrengthWidth(password) }}
            ></div>
          </div>
          <p className={`text-xs mt-2 ${
            passwordStrength.level === 'weak' ? 'text-red-400' :
            passwordStrength.level === 'fair' ? 'text-orange-400' :
            passwordStrength.level === 'good' ? 'text-green-400' :
            passwordStrength.level === 'strong' ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {passwordStrength.text}
          </p>
        </div>
      )}

      {/* Requirements */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-4">
        <h4 className="text-sm font-medium text-white mb-3">Password Requirements:</h4>
        <div className="space-y-2">
          {passwordRequirements.map((req) => {
            const isMet = req.test(password);
            return (
              <div key={req.id} className={`flex items-center gap-3 text-xs ${isMet ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                  isMet ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
                }`}>
                  ✓
                </div>
                <span>{req.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordSecurity;