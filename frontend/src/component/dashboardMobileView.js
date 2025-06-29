"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leftdashboard_1 = __importDefault(require("@/component/leftdashboard"));
const rightdashboard_1 = __importDefault(require("@/component/rightdashboard"));
const DashboardMobileView = ({ selectedChat, handleUpdateOpen, handleBack, handleGroup, handleChatSelect, handleClick }) => (<div className="md:hidden overflow-hidden ">
    {selectedChat ? (<rightdashboard_1.default chat={selectedChat} handleUpdateOpen={handleUpdateOpen} onBack={handleBack}/>) : (<leftdashboard_1.default handleGroup={handleGroup} onChatSelect={handleChatSelect} handleClick={handleClick}/>)}
  </div>);
exports.default = DashboardMobileView;
