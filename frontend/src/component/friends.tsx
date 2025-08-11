
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import FriendCard from './friendCard';
import TabNavigation from './friendTabNav';
import SearchInput from './searchInput';
import { getFilteredUsers } from '../utils/friendHelper';
import { useFriendsStore } from '@/store/friendStore';
import { useChatStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/loginStore';
import type { Chat, User } from '@/types/user';
import { useSocketContext } from '@/hooks/useSocket';



type FriendProps = {
    onChatSelect: (chatId: number, chat?: Chat) => void;
};

const Friends: React.FC<FriendProps> = ({ onChatSelect }) => {
  const {
    allUsers,
    friends,
    loading,
  
    error,
    fetchFriends,
    fetchOnlineFriends,
    addFriend,
    removeFriend,
    searchFriends,
    clearSearch,

  } = useFriendsStore();

  const { fetchChatsSummary, createChat } = useChatStore();
  
  // State to store user statuses
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({});
  
  // Ensure participants have both id and name fields
  const chats: Chat[] = useChatStore.getState().chats.map(chat => ({
    ...chat,
    participants: chat.participants.map(p => ({
      id: p.id,
      name: (p as any).name ?? '',
    })),
    lastMessage: chat.lastMessage === null ? undefined : chat.lastMessage,
    lastMessageAt: chat.lastMessageAt === null ? undefined : chat.lastMessageAt,
  }));
  
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { socket} = useSocketContext();
  // Function to fetch online friends
const fetchUserStatuses = useCallback(() => {
  const onlineIds = useFriendsStore.getState().onlineFriends;
   let filteredUsers: User[] = [];
  if (searchQuery.trim()) {

    // Use backend results 
    filteredUsers = useFriendsStore.getState().searchResults;
  } else {

    // Use local filtering for tabs when not searching
    filteredUsers = getFilteredUsers(activeTab, "");
  }

  // Set status based on whether user is in onlineFriends array
  const statusMap: Record<number, string> = {};
  filteredUsers.forEach(user => {
    statusMap[user.id] = onlineIds.includes(user.id) ? 'online' : 'offline';
  });
  setUserStatuses(statusMap);
}, [activeTab, searchQuery]);

  // Socket connection logic (unchanged)
 useEffect(() => {
    if (!user?.id || !socket) return;

    const handleStatusChange = () => {
      fetchOnlineFriends();
      fetchUserStatuses();
    };

    socket.on('user_online', handleStatusChange);
    socket.on('user_offline', handleStatusChange);

    fetchOnlineFriends();

    return () => {
      socket.off('user_online', handleStatusChange);
      socket.off('user_offline', handleStatusChange);
    };
  }, [user?.id, fetchOnlineFriends, fetchUserStatuses, socket]);


  // Fetch user statuses when filtered users change
  useEffect(() => {
    fetchUserStatuses();
  }, [fetchUserStatuses]);

  // Search logic 
  useEffect(() => {
    if (!searchQuery.trim()) {
      clearSearch();
    } else {
      searchFriends(searchQuery);
    }
  }, [searchQuery, searchFriends, clearSearch]);

  // Get filtered users
  const usersToFilter = searchQuery.trim() ? useFriendsStore.getState().searchResults : allUsers;
  const filteredUsers = getFilteredUsers(activeTab, searchQuery).filter(user =>
    usersToFilter.some(u => u.id === user.id)
  );

  // Handler functions
  const handleAddFriend = async (userId: number) => {
    await addFriend(userId);
    await fetchFriends();
    await fetchOnlineFriends();
  };

  const handleRemoveFriend = async (userId: number) => {
    await removeFriend(userId);
    await fetchFriends();
    await fetchOnlineFriends();
    await fetchChatsSummary();
  };

  const handleMessage = async (userId: number) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const existingChat = chats.find(chat => {
        if (!Array.isArray(chat.participants) || chat.participants.length !== 2) return false;
        const participantIds = chat.participants.map(p => p.id).sort();
        const targetIds = [user.id, userId].sort();
        return !chat.isGroup && participantIds[0] === targetIds[0] && participantIds[1] === targetIds[1];
      });
      
      if (existingChat) {
        onChatSelect(existingChat.id, existingChat);
        return;
      }

      const newChat = await createChat([userId], undefined, false);
      if (newChat) {
        const normalizedChat = {
          ...newChat,
          participants: (newChat.participants || []).map((p: any) => ({
            id: p.id,
            name: p.name ?? p.firstname ?? p.lastname ?? '',
          })),
          lastMessage: newChat.lastMessage ?? undefined,
          lastMessageAt: newChat.lastMessageAt ?? undefined,
        };
        onChatSelect(Number(normalizedChat.id), normalizedChat);
        return;
      }
      
      await fetchChatsSummary();
      setTimeout(() => {
        const updatedChats = useChatStore.getState().chats || [];
        const createdChat = updatedChats.find(chat =>
          Array.isArray(chat.participants) && chat.participants.some(p => p?.id === userId)
        );
        if (createdChat) {
          const normalizedCreatedChat = {
            ...createdChat,
            participants: createdChat.participants.map((p: any) => ({
              id: p.id,
              name: p.name ?? p.firstname ?? p.lastname ?? '',
            })),
            lastMessage: createdChat.lastMessage ?? undefined,
            lastMessageAt: createdChat.lastMessageAt ?? undefined,
          };
          onChatSelect(normalizedCreatedChat.id, normalizedCreatedChat);
        }
      }, 100);

    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  };

  return (
    <div className="flex p-3 relative flex-col h-full min-h-0 max-h-screen">
   <div className='sticky left-0 right-0 top-0 bg-primary-bg  z-80  '>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab}  />
   </div>

      <div className="flex-1 overflow-y-auto scrollbar-auto-hide py-4 space-y-3">
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
                const userStatus = userStatuses[user.id] || 'offline'; 
            
                return (
                  <FriendCard
                    isFriend={isFriend}
                    key={user.id}
                    user={user}
                    status={userStatus} 
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