'use client';
import React, { useState,  } from 'react';
import Stories from "./stories";
import Messages from "./messages";
import Friends from "./friends";
import CreateGroupIcon from './createGroupIcon';
import type { Chat } from '@/types/user';
import { useAuthStore } from '@/store/loginStore';
import { useRouter } from 'next/navigation';
import SuccessPopup from './successPop';
import ErrorPopup from './errorpopup';
import { MultiRingSpinner } from './spinner';
import { useChatStore } from '@/store/messageStore';

type LeftDashboardProps = {
  onChatSelect: (chatId: string) => void;
  handleClick: () => void;
  chats: Chat[];
};


   
const Leftdashboard: React.FC<LeftDashboardProps> = ({ handleClick, onChatSelect}) => {
  const [activeTab, setActiveTab] = useState('Messages');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const navItems = ['Messages', 'Friends', 'Group'];
  const router = useRouter();
  const { logout, isLoading, user, error} = useAuthStore();

 
const { chats } = useChatStore();

const handleLogout = async () => {
  try {
    await logout();
    setShowSuccess(true);

    // Redirect after 2 seconds without waiting for click
    setTimeout(() => {
      router.push('/withNavpages');
    }, 2000);
  } catch  {
    setShowError(true);
  }
};

  

  const handleErrorDismiss = () => {
    setShowError(false);
  };

  return (
    <section className="h-screen bg-primary-bg flex flex-col">
      <div className="flex justify-between p-5 items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-icon text-primary flex items-center justify-center font-semibold">
 {(user?.firstname?.[0] || "") + (user?.lastname?.[0] || "")}
        </div>
        <div className="flex gap-2">
          <p onClick={handleClick} className="text-primary text-xl md:text-2xl cursor-pointer">⚙️</p>
          <p onClick={handleLogout} className="text-primary text-xl md:text-2xl cursor-pointer">📝</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-primary">
        <ul className="flex justify-between items-center w-full relative">
          {navItems.map((item) => (
            <li key={item} className="flex-1">
              <button
                onClick={() => setActiveTab(item)}
                className={`w-full p-4 text-center transition-all duration-200 relative ${
                  activeTab === item
                    ? 'text-primary font-semibold'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {item}
                {activeTab === item && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-purple rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Area */}
      <section className="flex-1 flex flex-col min-h-0">
        {activeTab === 'Messages' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 flex-shrink-0">
              <Stories />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-5">
              <Messages
                onChatSelect={onChatSelect}
                conversations={chats.map((chat) => ({
                  id: String(chat.id),
                  name: chat.name,
                  avatar: '', // Provide a default or map accordingly, or use a valid property from Chat if available
                  message: chat.lastMessage || '', // Provide a default or map accordingly
                  time: chat.lastMessageAt || '', // Provide a default or map accordingly
                  unread: 0, // Default value since unreadCount does not exist on Chat
                }))}
              />
            </div>
          </div>
        )}

        {activeTab === 'Friends' && (
          <div className="p-5">
            <Friends onChatSelect={onChatSelect} />
          </div>
        )}

        {activeTab === 'Group' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-5 flex-shrink-0">
              <div className="p-2 mt-2 flex justify-center">
                <button className="flex justify-center items-center gap-2 bg-gradient-purple text-primary font-semibold px-5 py-3 rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out">
                  <CreateGroupIcon size={24} color="white" />
                  Create Group
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-5">
              {chats.length > 0 ? (
                <Messages
                  onChatSelect={onChatSelect}
                  conversations={chats.map((chat) => ({
                    id: String(chat.id),
                    name: chat.name,
                    avatar: '', // Provide a default or map accordingly, or use a valid property from Chat if available
                    message: chat.lastMessage || '', // Provide a default or map accordingly
                    time: chat.lastMessageAt || '', // Provide a default or map accordingly
                    unread: 0, // Default value since unreadCount does not exist on Chat
                  }))}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-lg font-semibold">No Groups Available</p>
                  <p className="text-sm">Create or join a group to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <MultiRingSpinner />
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Logout successful! Redirecting to homepage in 3 seconds..."
          handleTimeout={() => {}} 
          url="/withNavpages"
          tempState={null}
        />
      )}

      {/* Error Popup */}
      {showError && (
        <ErrorPopup
          message={error || 'Logout failed. Please try again.'}
          handleTimeout={handleErrorDismiss}
        />
      )}
    </section>
  );
};

export default Leftdashboard;
