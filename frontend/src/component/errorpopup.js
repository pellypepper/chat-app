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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ErrorPopup = ({ message, handleTimeout, handleSendResetLink }) => {
    const [visible, setVisible] = (0, react_1.useState)(true);
    const handleClose = () => {
        setVisible(false);
        if (handleTimeout)
            handleTimeout();
    };
    if (!visible)
        return null;
    return (<div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-[#161b22] w-[90%] max-w-md rounded-2xl p-6 shadow-lg relative">
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-white text-2xl hover:text-red-500">
          &times;
        </button>

        {/* Error Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white text-2xl mb-4">
            !
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Message Failed</h2>
          <p className="text-sm text-gray-400 mb-6">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button onClick={handleClose} className="px-6 py-2 rounded-lg border border-gray-600 text-white bg-[#0d1117] hover:bg-[#1a1f2b] transition">
            Cancel
          </button>
          <button onClick={handleSendResetLink} className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition">
            Retry
          </button>
        </div>
      </div>
    </div>);
};
exports.default = ErrorPopup;
