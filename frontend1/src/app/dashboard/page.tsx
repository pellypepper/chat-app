'use client';

import React, { useEffect, useState } from 'react';
import Leftdashboard from "@/component/leftdashboard";
import Rightdashboard from "@/component/rightdashboard";
import ProfileDetails from '@/component/profileDetails';
import { useChatStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/loginStore';

import type { Chat } from '@/types/user';
import { MultiRingSpinner } from '@/component/spinner';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const { user, isAuthenticated, getSession } = useAuthStore();
  const { chat } = useChatStore();
  // Loading states and text stages
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'redirecting' | 'authenticating'>('redirecting');


  //fetch user session on mount
  useEffect(() => {
  
    const fetchUser = async () => {
      await getSession();
    };
    fetchUser();
  }, [getSession]);

// Handle loading stages based on authentication status
  useEffect(() => {
  
    if (isAuthenticated) {
   
      setLoadingStage('redirecting');
      const timer1 = setTimeout(() => {

        setLoadingStage('authenticating');
      }, 2500);

     
      const timer2 = setTimeout(() => {
        setLoading(false);
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {

      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);



const handleChatSelect = (chatId: number) => {
  const selected = chat.find((c: Chat) => Number(c.id) === chatId) || null;
  setSelectedChat(selected as Chat | null);
};

  const handleBack = () => setSelectedChat(null);

  // Show spinner + staged text while loading
  if (loading) {
    return (
      <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4 ">
        <MultiRingSpinner />
        <p className="text-lg font-semibold text-primary">
          {loadingStage === 'redirecting' ? 'redirecting...' : 'Authenticating...'}
        </p>
        {/* Optional: Add progress bar animation here */}
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full bg-gradient-to-r from-blue-400 to-purple-600 animate-progressBar`}
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    );
  }

  // After loading is done, show actual dashboard
  return (
    <div className="h-screen overflow-hidden ">
      {/* Mobile View */}
      <div className="md:hidden overflow-hidden ">
        {selectedChat ? (
          <Rightdashboard chat={selectedChat} onBack={handleBack} />
        ) : (
          <Leftdashboard  onChatSelect={handleChatSelect} handleClick={handleClick} />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-[45%_55%] overflow-hidden">
        <div className="overflow-hidden">
          <Leftdashboard onChatSelect={handleChatSelect} handleClick={handleClick} />
        </div>
        <div className="overflow-hidden">
          <Rightdashboard onBack={handleBack} chat={selectedChat} />
        </div>
      </div>

      {/* Profile Details Modal */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-0 z-[1000] bg-navbar-bg flex-col items-center justify-center overflow-auto`}
      >
        <button
          onClick={handleClose}
          className="text-primary text-3xl font-bold hover:text-red-500 transition-colors p-2"
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
