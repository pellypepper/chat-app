"use client"

import React, { useState } from 'react';
import { useFriendsStore } from '@/store/friendStore';
import { useChatStore } from '@/store/messageStore';
import SuccessPopup from './successPop';
import ErrorPopup from './errorpopup';
import { MultiRingSpinner } from './spinner';

type Friend = {
  id: number; 
  firstname: string;
  lastname: string;
  email?: string;
};

type CreateGroupProps = {
  handleClickOutside: () => void;
};

const CreateGroup: React.FC<CreateGroupProps> = ({
  handleClickOutside,
}) => {
  const friendsStoreFriends = useFriendsStore(state => state.friends);
  const { createChat, chats } = useChatStore();

  const friendsList = friendsStoreFriends && friendsStoreFriends.length > 0 ? friendsStoreFriends : [];
  
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Spinner and popup states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFriendToggle = (friendId: number) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedFriends.length > 0) {
      const name = groupName.trim();
      const isGroup = selectedFriends.length >= 2;
      const participants = selectedFriends;

      // Prevent duplicate group names
      const existingGroup = chats.map(chat => chat.name).includes(name);
      if (existingGroup) {
        setErrorMsg('A group with this name already exists. Please choose a different name.');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      setIsLoading(true);

      try {
        // Wait 3 seconds to show spinner
        await new Promise(res => setTimeout(res, 3000));
        const chat = await createChat(participants, name, isGroup);

        setIsLoading(false);
        if (chat) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            handleClickOutside();
          }, 2000);
        } else {
          setErrorMsg('Error creating group.');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      } catch {
        setIsLoading(false);
        setErrorMsg('Error creating group.');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  const selectedFriendsNames = friendsList
    .filter(friend => selectedFriends.includes(friend.id))
    .map(friend => `${friend.firstname} ${friend.lastname}`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.8)' }}
      onClick={handleClickOutside}
    >
      <div
        className="relative w-full bg-navbar-bg border-primary border max-w-md rounded-lg shadow-2xl backdrop-blur-sm"
      
        onClick={e => e.stopPropagation()}
      >
        {/* Popups */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 rounded-lg">
            <MultiRingSpinner />
          </div>
        )}
        {showSuccess && (
          <SuccessPopup message="Group created!" />
        )}
        {showError && (
          <ErrorPopup message={errorMsg || "Error creating group."} />
        )}

        <div className="p-6">
          {/* Header with Gradient */}
          <div className="mb-6">
            <h1
              className="text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--gradient-blue, #58a6ff), var(--gradient-purple, #a855f7))'
              }}
            >
              Create Group
            </h1>
            <p style={{ color: 'var(--text-secondary, #7d8590)' }} className="text-sm">
              Start a new conversation with your team
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Group Name Field */}
            <div>
              <label
                htmlFor="groupName"
                className="block text-primary text-sm font-medium mb-2"
            
              >
                Group Name *
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                required
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                style={{
                  backgroundColor: 'var(--tertiary-bg, #21262d)',
                  borderColor: 'var(--border, #30363d)',
                  color: 'var(--text-primary, #e6edf3)',
                  focusRingColor: 'var(--gradient-blue, #58a6ff)'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gradient-blue, #58a6ff)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(88, 166, 255, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border, #30363d)';
                  e.target.style.boxShadow = 'none';
                }}
                disabled={isLoading}
              />
            </div>

            {/* Friends Selection */}
            <div>
              <label
                htmlFor="friendsSelect"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary, #e6edf3)' }}
              >
                Add Friends *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none text-sm text-left flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--tertiary-bg, #21262d)',
                    borderColor: selectedFriends.length > 0 ? 'var(--gradient-blue, #58a6ff)' : 'var(--border, #30363d)',
                    color: 'var(--text-primary, #e6edf3)'
                  }}
                  disabled={isLoading}
                >
                  <div className="flex-1">
                    {selectedFriends.length === 0 ? (
                      <span style={{ color: 'var(--text-secondary, #7d8590)' }}>
                        Select friends to add...
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedFriendsNames.slice(0, 2).map((name, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--overlay-light, rgba(88, 166, 255, 0.1))',
                              color: 'var(--gradient-blue, #58a6ff)'
                            }}
                          >
                            {name}
                          </span>
                        ))}
                        {selectedFriends.length > 2 && (
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--overlay-purple, rgba(168, 85, 247, 0.1))',
                              color: 'var(--gradient-purple, #a855f7)'
                            }}
                          >
                            +{selectedFriends.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-secondary, #7d8590)' }}
                  >
                    <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-2xl z-10 max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--secondary-bg, #161b22)',
                      borderColor: 'var(--border, #30363d)'
                    }}
                  >
                    {friendsList.map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => handleFriendToggle(friend.id)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 first:rounded-t-lg last:rounded-b-lg"
                        style={{
                          backgroundColor: selectedFriends.includes(friend.id)
                            ? 'var(--overlay-light, rgba(88, 166, 255, 0.1))'
                            : 'transparent'
                        }}
                        onMouseEnter={e => {
                          if (!selectedFriends.includes(friend.id)) {
                            (e.target as HTMLDivElement).style.backgroundColor = 'var(--active-bg, #1c2128)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!selectedFriends.includes(friend.id)) {
                            (e.target as HTMLDivElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {/* Avatar placeholder */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{
                            backgroundColor: selectedFriends.includes(friend.id)
                              ? 'var(--gradient-blue, #58a6ff)'
                              : 'var(--tertiary-bg, #21262d)',
                            color: selectedFriends.includes(friend.id)
                              ? 'white'
                              : 'var(--text-secondary, #7d8590)'
                          }}
                        >
                          {friend.firstname[0] + friend.lastname[0]}
                        </div>
                        <span
                          className="flex-1 text-sm"
                          style={{ color: 'var(--text-primary, #e6edf3)' }}
                        >
                          {friend.firstname}
                        </span>
                        {/* Checkmark */}
                        {selectedFriends.includes(friend.id) && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            style={{ color: 'var(--gradient-blue, #58a6ff)' }}
                          >
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClickOutside}
                className="flex-1 py-3 px-4 rounded-lg border font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--tertiary-bg, #21262d)',
                  borderColor: 'var(--border, #30363d)',
                  color: 'var(--text-secondary, #7d8590)'
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'var(--active-bg, #1c2128)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'var(--tertiary-bg, #21262d)';
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!groupName.trim() || selectedFriends.length === 0 || isLoading}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: (!groupName.trim() || selectedFriends.length === 0 || isLoading)
                    ? 'var(--border, #30363d)'
                    : 'linear-gradient(90deg, var(--gradient-blue, #58a6ff), var(--gradient-purple, #a855f7))',
                  color: 'var(--text-white, white)',
                  border: 'none'
                }}
              >
                <span className="relative z-10">Create Group</span>
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--gradient-purple, #a855f7), var(--gradient-orange, #f97316))'
                  }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;