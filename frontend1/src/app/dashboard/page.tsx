'use client';

import React, { useEffect, useState } from 'react';
import Leftdashboard from "@/component/leftdashboard";
import Rightdashboard from "@/component/rightdashboard";
import ProfileDetails from '@/component/profileDetails';
import { useChatStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/loginStore';
import CreateGroup from '@/component/createGroup';
import type { Chat } from '@/types/user';
import { MultiRingSpinner } from '@/component/spinner';
import { useFriendsStore } from '@/store/friendStore';
import UpdateGroup from '@/component/updateGroup';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showUpdateGroup, setShowUpdateGroup] = useState(false);
  const {  isAuthenticated, getSession } = useAuthStore();
  const { chats ,  fetchChatsSummary} = useChatStore();
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'redirecting' | 'authenticating'>('redirecting');
 const {

    fetchFriends,
    fetchOnlineFriends,
    fetchAllUsers,

  } = useFriendsStore();

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

    useEffect(() => {
      
      fetchAllUsers();
      fetchFriends();
      fetchChatsSummary(); 
      fetchOnlineFriends();


    }, [fetchAllUsers,  fetchFriends, fetchOnlineFriends, fetchChatsSummary]);
  

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);


// Handle chat selection
const handleChatSelect = async(chatId: number, optionalChat?: Chat) => {

  if (optionalChat) {
    setSelectedChat(optionalChat);
    return;
  }

  const selected = chats.find(c => Number(c.id) === chatId) || null;

  if (!selected) {
   
    setSelectedChat(null);
    return;
  }

  if (!Array.isArray(selected.participants)) {
  
    setSelectedChat(null);
    return;
  }

const normalizedSelected = {
  ...selected,
  participants: selected.participants.map((p: any) => ({
    id: p.id,
    name: p.name ?? '',
  })),
  lastMessage: selected.lastMessage ?? undefined,
  lastMessageAt: selected.lastMessageAt ?? undefined,
};

setSelectedChat(normalizedSelected);
};

// Handle group creation toggle
const handleGroup = () => {
  setShowCreateGroup(!showCreateGroup);
}

const handleUpdateOpen = () => {
  setShowUpdateGroup(!showUpdateGroup);
}
// Handle click outside to close create group modal
const handleClickOutside = () => {
  setShowCreateGroup(false);
   setShowUpdateGroup(false);
}
  const handleGroupUpdated = (updated: { id: number; name: string; participants: number[] }) => {
    setSelectedChat(prev => prev && prev.id === updated.id
      ? { ...prev, name: updated.name, participants: updated.participants.map(id => {
          // Try to keep other participant info if possible (like name)
          const found = prev.participants.find(p => p.id === id);
          return found ? found : { id, name: "" };
        }) }
      : prev
    );
  };

  const handleBack = () => setSelectedChat(null);

  // Show spinner 
  if (loading) {
    return (
      <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4 ">
        <MultiRingSpinner />
        <p className="text-lg font-semibold text-primary">
          {loadingStage === 'redirecting' ? 'redirecting...' : 'Authenticating...'}
        </p>
      
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full bg-gradient-to-r from-blue-400 to-purple-600 animate-progressBar`}
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="h-screen overflow-hidden ">
      {/* Mobile View */}
      <div className="md:hidden overflow-hidden ">
        {selectedChat ? (
          <Rightdashboard chat={selectedChat} handleUpdateOpen={handleUpdateOpen} onBack={handleBack} />
        ) : (
          <Leftdashboard handleGroup={handleGroup}  onChatSelect={handleChatSelect} handleClick={handleClick} />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-[45%_55%] overflow-hidden">
        <div className="overflow-hidden">
          <Leftdashboard handleGroup={handleGroup} onChatSelect={handleChatSelect} handleClick={handleClick} />
        </div>
        <div className="overflow-hidden">
          <Rightdashboard  onBack={handleBack} handleUpdateOpen={handleUpdateOpen} chat={selectedChat} />
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


   <div className={`${showCreateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
    <CreateGroup handleClickOutside={handleClickOutside}  />
</div>

   <div className={`${showUpdateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
  {selectedChat && (
          <UpdateGroup handleClickOutside={handleClickOutside}  onGroupUpdated={handleGroupUpdated}  group={{
    id: selectedChat.id,
    name: selectedChat.name,
    participants: selectedChat.participants.map(p => p.id),
  }} />
        )}
</div>
  

    </div>
  );
};

export default Dashboard;
