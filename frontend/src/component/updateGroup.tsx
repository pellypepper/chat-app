"use client";

import React, { useEffect, useState } from 'react';
import { useFriendsStore } from '@/store/friendStore';
import { useChatStore } from '@/store/messageStore';
import SuccessPopup from './successPop';
import ErrorPopup from './errorpopup';
import { MultiRingSpinner } from './spinner';


type UpdateGroupProps = {
  handleClickOutside: () => void;
  group: {
    id: number;
    name: string;
    participants: number[];
  };
   onGroupUpdated: (updated: { id: number; name: string; participants: number[] }) => void;
};

const UpdateGroup: React.FC<UpdateGroupProps> = ({ handleClickOutside ,onGroupUpdated, group}) => {
  const friendsStoreFriends = useFriendsStore(state => state.friends);
  const { chats, updateGroupChat } = useChatStore();

  const friendsList = friendsStoreFriends ?? [];
  const [groupName, setGroupName] = useState(group.name);
  const [selectedFriends, setSelectedFriends] = useState<number[]>(group.participants);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    console.log('Submitting group update...', group.id);
  e.preventDefault();
  if (!groupName.trim() || selectedFriends.length < 2) return;
  console.log('Submitting group update:', groupName, selectedFriends);

  const trimmedName = groupName.trim();
  const nameTaken = chats.some(chat => chat.name === trimmedName && chat.id !== group.id);

  if (nameTaken) {
    setErrorMsg('A group with this name already exists.');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    return;
  }

  setIsLoading(true);

  try {
    await new Promise(res => setTimeout(res, 2000));

    const previousParticipants = group.participants;
    const currentParticipants = selectedFriends;

    const addUserIds = currentParticipants.filter(id => !previousParticipants.includes(id));
    const removeUserIds = previousParticipants.filter(id => !currentParticipants.includes(id));

    await updateGroupChat(group.id, trimmedName, addUserIds, removeUserIds);
       onGroupUpdated({
        id: group.id,
        name: trimmedName,
        participants: currentParticipants,
      });

    setIsLoading(false);
    setShowSuccess(true);

    



    setTimeout(() => {
      setShowSuccess(false);
      handleClickOutside();
    }, 2000);
  } catch {
    setIsLoading(false);
    setErrorMsg('Failed to update group.');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
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
           {showSuccess && <SuccessPopup message="Group updated!" />}
        {showError && <ErrorPopup message={errorMsg} />}
          {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 rounded-lg">
            <MultiRingSpinner />
          </div>
        )}
      <div
        className="relative w-full bg-navbar-bg border-primary border max-w-md rounded-lg shadow-2xl backdrop-blur-sm"
        onClick={e => e.stopPropagation()}
      >
      
   

        <div className="p-6">
          <div className="mb-6">
            <h1
              className="text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--gradient-blue, #58a6ff), var(--gradient-purple, #a855f7))',
              }}
            >
              Update Group
            </h1>
            <p style={{ color: 'var(--text-secondary, #7d8590)' }} className="text-sm">
              Modify group name or members
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Group Name */}
            <div>
              <label htmlFor="groupName" className="block text-primary text-sm font-medium mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="groupName"
                required
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--tertiary-bg, #21262d)',
                  borderColor: 'var(--border, #30363d)',
                  color: 'var(--text-primary, #e6edf3)',
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

            {/* Friend Select (Same as in CreateGroup) */}
            <div>
              <label htmlFor="friendsSelect" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Group Members *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-lg border text-sm text-left flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--tertiary-bg)',
                    borderColor: selectedFriends.length > 0 ? 'var(--gradient-blue)' : 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  disabled={isLoading}
                >
                  <div className="flex-1">
                    {selectedFriends.length === 0 ? (
                      <span style={{ color: 'var(--text-secondary)' }}>Select friends to add...</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedFriendsNames.slice(0, 2).map((name, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'rgba(88, 166, 255, 0.1)',
                              color: 'var(--gradient-blue)',
                            }}
                          >
                            {name}
                          </span>
                        ))}
                        {selectedFriends.length > 2 && (
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'rgba(168, 85, 247, 0.1)',
                              color: 'var(--gradient-purple)',
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
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div
   className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-2xl z-[1000] max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--secondary-bg, #161b22)',
                      borderColor: 'var(--border, #30363d)'
                    }}
                  >
                    {friendsList.map(friend => (
                      <div
                        key={friend.id}
                        onClick={() => handleFriendToggle(friend.id)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                        style={{
                          backgroundColor: selectedFriends.includes(friend.id)
                            ? 'rgba(88, 166, 255, 0.1)'
                            : 'transparent',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{
                            backgroundColor: selectedFriends.includes(friend.id)
                              ? 'var(--gradient-blue)'
                              : 'var(--tertiary-bg)',
                            color: selectedFriends.includes(friend.id)
                              ? 'white'
                              : 'var(--text-secondary)',
                          }}
                        >
                          {friend.firstname[0] + friend.lastname[0]}
                        </div>
                        <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {friend.firstname}
                        </span>
                        {selectedFriends.includes(friend.id) && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'var(--gradient-blue)' }}>
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
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
                className="flex-1 py-3 px-4 rounded-lg border font-medium text-sm"
                style={{
                  backgroundColor: 'var(--tertiary-bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!groupName.trim() || selectedFriends.length < 2 || isLoading}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-sm relative overflow-hidden group"
                style={{
                  background: (!groupName.trim() || selectedFriends.length < 2 || isLoading)
                    ? 'var(--border)'
                    : 'linear-gradient(90deg, var(--gradient-blue), var(--gradient-purple))',
                  color: 'white',
                  border: 'none',
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                <span className="relative z-10">Update Group</span>
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                  style={{ backgroundImage: 'linear-gradient(90deg, var(--gradient-purple), var(--gradient-orange))' }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroup;
