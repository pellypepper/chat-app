"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PublicLayout;
const Navigation_1 = __importDefault(require("@/component/Navigation"));
const react_1 = require("react");
function PublicLayout({ children }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const handleClick = () => setIsOpen(prev => !prev);
    return (<>
      <Navigation_1.default isOpen={isOpen} handleClick={handleClick}/>
    

      <main className="pt-20">{children}</main>
    </>);
}
