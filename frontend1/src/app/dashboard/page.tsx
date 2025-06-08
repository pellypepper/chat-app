'use client';

import React, { useState } from 'react';
import Leftdashboard from "@/component/leftdashboard";
import Rightdashboard from "@/component/rightdashboard";
import ProfileDetails from '@/component/profileDetails';
import { conversations } from '@/data/user';

import type { Chat } from '@/types/user';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const chats = conversations;

 const handleChatSelect = (chatId: string) => {
    const chat = chats.find((c: Chat) => c.id === chatId) || null;
    setSelectedChat(chat);
  };

  const handleBack = () => setSelectedChat(null);

  return (
    <div className="h-screen overflow-hidden ">
      {/* Mobile View: show Rightdashboard only if a chat is selected */}
      <div className="md:hidden  overflow-hidden ">
        {selectedChat ? (
          <Rightdashboard  chat={selectedChat} onBack={handleBack} />
        ) : (
          <Leftdashboard chats={chats} onChatSelect={handleChatSelect} handleClick={handleClick} />
        )}
      </div>

      {/* Desktop View: two-column layout */}
      <div className="hidden md:grid md:grid-cols-[45%_55%]   overflow-hidden">
        <div className=" overflow-hidden">
          <Leftdashboard chats={chats} onChatSelect={handleChatSelect} handleClick={handleClick} />
        </div>
        <div className=" overflow-hidden">
          <Rightdashboard onBack={handleBack} chat={selectedChat} />
        </div>
      </div>

      {/* Profile Details Modal */}
      <div className={`${isOpen ? "flex" : "hidden"} fixed inset-0 z-[1000] bg-navbar-bg flex-col items-center justify-center overflow-auto`}>
        <button
          onClick={handleClose}
          className="text-primary text-3xl font-bold hover:text-red-500 transition-colors  p-2"
          aria-label="Close"
        >
          &times;
        </button>
        <ProfileDetails />
      </div>
    </div>
  );
};

export default Dashboard;
