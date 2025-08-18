'use client';
import React, { useState,  } from 'react';
import Stories from "./stories";
import Messages from "./messages";
import Friends from "./friends";
import CreateGroupIcon from './createGroupIcon';
import { useAuthStore } from '@/store/loginStore';
import { useRouter } from 'next/navigation';
import SuccessPopup from './successPop';
import ErrorPopup from './errorpopup';
import { MultiRingSpinner } from './spinner';
import { useChatStore } from '@/store/messageStore';
import { Settings, Power } from 'lucide-react';

type LeftDashboardProps = {
  onChatSelect: (chatId: number) => void;
  handleClick: () => void;
  handleGroup?: () => void;
 
};


   
const Leftdashboard: React.FC<LeftDashboardProps> = ({ handleGroup, handleClick, onChatSelect}) => {
  const [activeTab, setActiveTab] = useState('Messages');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navItems = ['Messages', 'Friends', 'Group'];
  const router = useRouter();
  const { logout, isLoading, user, error} = useAuthStore();

 
const { chats } = useChatStore();

// Handle logout and redirect
const handleLogout = async () => {
  try {
    await logout();
    setShowSuccess(true);

    // Redirect after 2 seconds without waiting for click
    setTimeout(() => {
      router.push('/public');
    }, 2000);
  } catch  {
    setShowError(true);
  }
};



  
// Handle error dismissal
  const handleErrorDismiss = () => {
    setShowError(false);
  };

  return (
    <section className="relative w-full overflow-hidden pb-4 h-screen bg-primary-bg flex flex-col">
  <div className="sticky top-0 left-0 right-0  bottom-0 bg-primary-bg border-b border-primary z-60 ">
    {/* User info + buttons */}
    <div className="flex justify-between p-5 items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-icon text-primary flex items-center justify-center font-semibold">
        {(user?.firstname?.[0]?.toUpperCase() || "") + (user?.lastname?.[0]?.toUpperCase() || "")}
      </div>
      <div className="flex gap-2">
        <button onClick={handleClick} aria-label="Settings">
          <Settings className="text-primary w-6 h-6" />
        </button>
        <button onClick={handleLogout} aria-label="Logout">
          <Power className="text-primary w-6 h-6" />
        </button>
      </div>
    </div>

    {/* Navigation */}
    <nav className=" border-primary">
      <ul className="flex justify-between items-center ">
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
  </div>

      {/* Content Area */}
      <section className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-auto-hide">
        {activeTab === 'Messages' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 flex-shrink-0">
              <Stories />
            </div>
<div className="flex-1 border-t  border-primary overflow-y-auto scrollbar-auto-hide">
{chats.length > 0 ? (
  <Messages
    onChatSelect={onChatSelect}
    conversations={chats
      .filter(chat => !chat.isGroup)
      .map(chat => {
        const participantWithPicture = chat.participants.find(p => p.profilePicture);

        return {
          id: Number(chat.id),
          name: chat.name,
          avatar: participantWithPicture ? participantWithPicture.profilePicture : '',
          message: chat.lastMessage || '',
          time: chat.lastMessageAt || '',
          unread: 0,
        };
      })}
  />
) : (
  <div className="flex flex-col items-center justify-center mt-16 text-center text-secondary">
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      className="mb-4"
    >
      <circle cx="32" cy="32" r="32" fill="#23272F" />
      <path d="M22 28a10 10 0 0 1 20 0v4a10 10 0 0 1-20 0v-4Z" stroke="#A855F7" strokeWidth="2" />
      <circle cx="26" cy="32" r="2" fill="#58A6FF" />
      <circle cx="38" cy="32" r="2" fill="#58A6FF" />
      <rect x="28" y="38" width="8" height="2" rx="1" fill="#A855F7" />
    </svg>
    <h2 className="text-lg font-semibold text-primary mb-1">No Conversations Yet</h2>
    <p className="text-sm text-secondary max-w-xs">
      Start a chat with your friends or contacts to see your conversations here.
    </p>
  </div>
)}
</div>

          </div>
        )}

        {activeTab === 'Friends' && (
          <div className="">
            <Friends  onChatSelect={onChatSelect} />
          </div>
        )}

        {activeTab === 'Group' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-5 flex-shrink-0">
              <div className="p-2 mt-2 flex justify-center">
                <button onClick={handleGroup} className="flex justify-center items-center gap-2 bg-gradient-purple text-primary font-semibold px-5 py-3 rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out">
                  <CreateGroupIcon size={24} color="white" />
                  Create Group
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
              {chats.length > 0 ? (
                <Messages
                  onChatSelect={onChatSelect}
                  conversations={chats
                     .filter(chat => chat.isGroup)
                    .map((chat) => ({
                    id: Number(chat.id),
                    name: chat.name,
                    avatar: '', 
                    message: chat.lastMessage || '',
                    time: chat.lastMessageAt || '', 
                    unread: 0,
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
