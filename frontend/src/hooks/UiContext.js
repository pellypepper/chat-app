"use strict";
// context/UIContext.tsx
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
exports.useUI = exports.UIProvider = void 0;
const react_1 = __importStar(require("react"));
const UIContext = (0, react_1.createContext)(undefined);
const UIProvider = ({ children }) => {
    const [isSigninOpen, setSigninOpen] = (0, react_1.useState)(false);
    const [isRegisterOpen, setRegisterOpen] = (0, react_1.useState)(false);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const toggleSignin = () => setSigninOpen((prev) => !prev);
    const toggleRegister = () => setRegisterOpen((prev) => !prev);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };
    return (<UIContext.Provider value={{ isSigninOpen, isRegisterOpen, toggleSignin, toggleRegister, handleClick, isOpen }}>
      {children}
    </UIContext.Provider>);
};
exports.UIProvider = UIProvider;
const useUI = () => {
    const context = (0, react_1.useContext)(UIContext);
    if (!context)
        throw new Error('useUI must be used within UIProvider');
    return context;
};
exports.useUI = useUI;
