'use client';
import React, { useState } from 'react';
import Stories from "./stories";
import Messages from "./messages";
import Friends from "./friends";
import CreateGroupIcon from './createGroupIcon';
import type { Chat } from '@/types/user';

type LeftDashboardProps = {
  onChatSelect: (chatId: string) => void;
  handleClick: () => void;
  chats: Chat[];
};

const Leftdashboard: React.FC<LeftDashboardProps> = ({ handleClick, onChatSelect, chats }) => {
  const [activeTab, setActiveTab] = useState('Messages');
  const navItems = ['Messages', 'Friends', 'Group'];

  return (
    <section className="h-screen bg-primary-bg flex flex-col">
      <div className="flex justify-between p-5 items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-icon text-primary flex items-center justify-center font-semibold">
          JD
        </div>
        
        <div className="flex gap-2">
          <p onClick={handleClick} className="text-primary text-xl">⚙️</p>
          <p className="text-primary text-xl">📝</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="border-b border-gray-600">
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
                {/* Active indicator */}
                {activeTab === item && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-purple rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Content Area */}
      <section className='flex-1 flex flex-col min-h-0'>
        {activeTab === 'Messages' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 flex-shrink-0">
              <Stories />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-5">
              <Messages onChatSelect={onChatSelect} conversations={chats}/>
            </div>
          </div>
        )}

        {activeTab === 'Friends' && (
          <div className=" p-5">
            <Friends />
          </div>
        )}

        {activeTab === 'Group' && (
          <div className='flex-1 flex flex-col min-h-0'>
            <div className='p-5 flex-shrink-0'>
              <div className='p-2 mt-2 flex justify-center'>
                <button className="flex justify-center items-center gap-2 bg-gradient-purple text-primary font-semibold px-5 py-3 rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out">
                  <CreateGroupIcon size={24} color="white" />
                  Create Group
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-5">
              {true ? (
                <Messages onChatSelect={onChatSelect} conversations={chats} />
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
    </section>
  )
}

export default Leftdashboard