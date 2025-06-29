"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const friendCard_1 = __importDefault(require("./friendCard"));
const friendTabNav_1 = __importDefault(require("./friendTabNav"));
const searchInput_1 = __importDefault(require("./searchInput"));
const friendHelper_1 = require("../utils/friendHelper");
const friendStore_1 = require("@/store/friendStore");
const messageStore_1 = require("@/store/messageStore");
const loginStore_1 = require("@/store/loginStore");
const useSocket_1 = require("@/hooks/useSocket");
const Friends = ({ onChatSelect }) => {
    const { allUsers, friends, loading, error, fetchFriends, fetchOnlineFriends, addFriend, removeFriend, searchFriends, clearSearch, } = (0, friendStore_1.useFriendsStore)();
    const { fetchChatsSummary, createChat } = (0, messageStore_1.useChatStore)();
    // State to store user statuses
    const [userStatuses, setUserStatuses] = (0, react_1.useState)({});
    // Ensure participants have both id and name fields
    const chats = messageStore_1.useChatStore.getState().chats.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => ({
            id: p.id,
            name: p.name ?? '',
        })),
        lastMessage: chat.lastMessage === null ? undefined : chat.lastMessage,
        lastMessageAt: chat.lastMessageAt === null ? undefined : chat.lastMessageAt,
    }));
    const user = (0, loginStore_1.useAuthStore)(state => state.user);
    const [activeTab, setActiveTab] = (0, react_1.useState)('all');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const { socket } = (0, useSocket_1.useSocketContext)();
    // Function to fetch online friends
    const fetchUserStatuses = (0, react_1.useCallback)(() => {
        const onlineIds = friendStore_1.useFriendsStore.getState().onlineFriends;
        let filteredUsers = [];
        if (searchQuery.trim()) {
            // Use backend results 
            filteredUsers = friendStore_1.useFriendsStore.getState().searchResults;
        }
        else {
            // Use local filtering for tabs when not searching
            filteredUsers = (0, friendHelper_1.getFilteredUsers)(activeTab, "");
        }
        // Set status based on whether user is in onlineFriends array
        const statusMap = {};
        filteredUsers.forEach(user => {
            statusMap[user.id] = onlineIds.includes(user.id) ? 'online' : 'offline';
        });
        setUserStatuses(statusMap);
    }, [activeTab, searchQuery]);
    // Socket connection logic (unchanged)
    (0, react_1.useEffect)(() => {
        if (!user?.id || !socket)
            return;
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
    (0, react_1.useEffect)(() => {
        fetchUserStatuses();
    }, [fetchUserStatuses]);
    // Search logic 
    (0, react_1.useEffect)(() => {
        if (!searchQuery.trim()) {
            clearSearch();
        }
        else {
            searchFriends(searchQuery);
        }
    }, [searchQuery, searchFriends, clearSearch]);
    // Get filtered users
    const usersToFilter = searchQuery.trim() ? friendStore_1.useFriendsStore.getState().searchResults : allUsers;
    const filteredUsers = (0, friendHelper_1.getFilteredUsers)(activeTab, searchQuery).filter(user => usersToFilter.some(u => u.id === user.id));
    // Handler functions
    const handleAddFriend = async (userId) => {
        await addFriend(userId);
        await fetchFriends();
        await fetchOnlineFriends();
    };
    const handleRemoveFriend = async (userId) => {
        await removeFriend(userId);
        await fetchFriends();
        await fetchOnlineFriends();
        await fetchChatsSummary();
    };
    const handleMessage = async (userId) => {
        try {
            if (!user?.id)
                throw new Error('User not authenticated');
            const existingChat = chats.find(chat => {
                if (!Array.isArray(chat.participants) || chat.participants.length !== 2)
                    return false;
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
                    participants: (newChat.participants || []).map((p) => ({
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
                const updatedChats = messageStore_1.useChatStore.getState().chats || [];
                const createdChat = updatedChats.find(chat => Array.isArray(chat.participants) && chat.participants.some(p => p?.id === userId));
                if (createdChat) {
                    const normalizedCreatedChat = {
                        ...createdChat,
                        participants: createdChat.participants.map((p) => ({
                            id: p.id,
                            name: p.name ?? p.firstname ?? p.lastname ?? '',
                        })),
                        lastMessage: createdChat.lastMessage ?? undefined,
                        lastMessageAt: createdChat.lastMessageAt ?? undefined,
                    };
                    onChatSelect(normalizedCreatedChat.id, normalizedCreatedChat);
                }
            }, 100);
        }
        catch (error) {
            console.error('Error in handleMessage:', error);
        }
    };
    return (<div className="flex flex-col h-full min-h-0 max-h-screen">
      <searchInput_1.default value={searchQuery} onChange={setSearchQuery}/>
      <friendTabNav_1.default activeTab={activeTab} onTabChange={setActiveTab}/>

      <div className="flex-1 overflow-y-auto scrollbar-auto-hide p-4 space-y-3">
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (<>
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

            {filteredUsers.length ? (filteredUsers.map(user => {
                const isFriend = friends.some(f => f.id === user.id);
                const userStatus = userStatuses[user.id] || 'offline';
                return (<friendCard_1.default isFriend={isFriend} key={user.id} user={user} status={userStatus} onMessage={isFriend ? () => handleMessage(user.id) : undefined} onAdd={!isFriend ? () => handleAddFriend(user.id) : undefined} onRemove={isFriend ? () => handleRemoveFriend(user.id) : undefined}/>);
            })) : (<div className="text-center py-12">
                <div className="text-gray-400 mb-2">No results found</div>
                <div className="text-sm text-gray-500">Try adjusting your search or browse different categories</div>
              </div>)}
          </>)}
      </div>
    </div>);
};
exports.default = Friends;
