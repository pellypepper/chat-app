"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPasswordPage;
const react_1 = require("react");
const resetPasswordModal_1 = __importDefault(require("@/component/resetPasswordModal"));
const spinner_1 = require("@/component/spinner");
function ResetPasswordPage() {
    return (<react_1.Suspense fallback={<div><spinner_1.MultiRingSpinner /></div>}>
      <resetPasswordModal_1.default />
    </react_1.Suspense>);
}
