import React, { useEffect, useState } from 'react';
import FriendCard from './friendCard';
import TabNavigation from './friendTabNav';
import SearchInput from './searchInput';
import { getFilteredUsers } from '../utils/friendHelper';
import { useFriendsStore } from '@/store/friendStore';
import { useChatStore } from '@/store/messageStore';

type FriendProps = {
    onChatSelect: (chatId: string) => void;
};

const Friends : React.FC<FriendProps> = ({ onChatSelect }) => {
  const {
    allUsers,
    friends,
    onlineFriends,
    loading,
    error,
    fetchFriends,
    fetchOnlineFriends,
    fetchAllUsers,
    addFriend,
    removeFriend,
    searchFriends,
    clearSearch,
  } = useFriendsStore();

  const { chats, fetchChatsSummary, fetchMessages, createChat } = useChatStore();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchAllUsers();
    fetchFriends();
    fetchChatsSummary(); // Add this to load existing chats
    fetchOnlineFriends();
  }, [fetchAllUsers, fetchFriends, fetchOnlineFriends, fetchChatsSummary]);

  // Update search - if query is empty, clear results, else fetch search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      clearSearch();
    } else {
      searchFriends(searchQuery);
    }
  }, [searchQuery, searchFriends, clearSearch]);

  // Choose which users to show
  const usersToFilter = searchQuery.trim() ? useFriendsStore.getState().searchResults : allUsers;

  const filteredUsers = getFilteredUsers(activeTab, searchQuery).filter(user =>
    usersToFilter.some(u => u.id === user.id)
  );

  const handleAddFriend = async (userId: number) => {
    await addFriend(userId);
    await fetchFriends();
    await fetchOnlineFriends();
  };

  const handleRemoveFriend = async (userId: number) => {
    await removeFriend(userId);
    await fetchFriends();
    await fetchOnlineFriends();
  };

  const handleMessage = async (userId: number) => {
    try {
      console.log('Attempting to message user:', userId);
      console.log('Current chats:', chats);
      
      // 1. Try to find an existing 1:1 chat with the user
      const existingChat = chats.find(
        (chat) =>
          Array.isArray(chat.participants) &&
          chat.participants.length === 2 &&
          chat.participants.some((participant) => participant.id === userId)
      );

      if (existingChat) {
        console.log('Found existing chat:', existingChat);
        // 2. If found, just select the chat
        onChatSelect(existingChat.id.toString());
      } else {
        console.log('Creating new chat with user:', userId);
        // 3. Create a new chat and get the returned chat directly
        const newChat = await createChat([userId], undefined, false);

        if (newChat) {
          console.log('Created new chat directly:', newChat);
          onChatSelect(Number(newChat.id).toString());
        } else {
          console.log('Failed to create chat, trying alternative approach...');
          // Fallback: Fetch updated chat list and find the created one
          await fetchChatsSummary();
          
          // Add a small delay to ensure state is updated
          setTimeout(() => {
            const updatedChats = useChatStore.getState().chats;
            console.log('Updated chats after creation:', updatedChats);

            const createdChat = updatedChats.find(
              (chat) =>
                Array.isArray(chat.participants) &&
                chat.participants.length === 2 &&
                chat.participants.some((participant) => participant.id === userId)
            );

            if (createdChat) {
              console.log('Found created chat after refetch:', createdChat);
              onChatSelect(createdChat.id.toString());
            } else {
              console.error('Still failed to find created chat');
              console.log('Available chats:', updatedChats);
              console.log('Looking for participant with ID:', userId);
              
              // Debug: Log the structure of each chat
              updatedChats.forEach((chat, index) => {
                console.log(`Chat ${index}:`, {
                  id: chat.id,
                  participants: chat.participants,
                  participantIds: chat.participants?.map(p => p.id),
                  isGroup: chat.isGroup
                });
              });
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 max-h-screen">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} myFriendsCount={friends.length} />

      <div className="flex-1 overflow-y-auto scrollbar-auto-hide p-4 space-y-3">
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">
                {activeTab === 'all'
                  ? 'All Users (A–Z)'
                  : activeTab === 'online'
                  ? 'Online Friends'
                  : 'My Friends'}
              </h3>
              <span className="text-sm text-gray-400">{filteredUsers.length} users</span>
            </div>

            {filteredUsers.length ? (
              filteredUsers.map(user => {
                const isFriend = friends.some(f => f.id === user.id);
                return (
                  <FriendCard
                    isFriend={isFriend}
                    key={user.id}
                    user={user}
                    onMessage={isFriend ? () => handleMessage(user.id) : undefined}
                    onAdd={!isFriend ? () => handleAddFriend(user.id) : undefined}
                    onRemove={isFriend ? () => handleRemoveFriend(user.id) : undefined}
                  />
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No results found</div>
                <div className="text-sm text-gray-500">Try adjusting your search or browse different categories</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Friends;