"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leftdashboard_1 = __importDefault(require("@/component/leftdashboard"));
const rightdashboard_1 = __importDefault(require("@/component/rightdashboard"));
const DashboardDesktopView = ({ selectedChat, handleUpdateOpen, handleBack, handleGroup, handleChatSelect, handleClick }) => (<div className="hidden md:grid md:grid-cols-[30%_70%] overflow-hidden">
    <div className="overflow-hidden">
      <leftdashboard_1.default handleGroup={handleGroup} onChatSelect={handleChatSelect} handleClick={handleClick}/>
    </div>
    <div className="overflow-hidden">
      <rightdashboard_1.default onBack={handleBack} handleUpdateOpen={handleUpdateOpen} chat={selectedChat}/>
    </div>
  </div>);
exports.default = DashboardDesktopView;
