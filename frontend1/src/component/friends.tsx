import React, { useState } from 'react';
const Friends = () => {
    const [activeTab, setActiveTab] = useState('all');
     const [searchQuery, setSearchQuery] = useState('');

     const allUsers = [
    { id: 1, name: 'Alice Cooper', username: '@alice', avatar: 'A', status: 'online', isFriend: true, mutualFriends: 5 },
    { id: 2, name: 'Bob Wilson', username: '@bob', avatar: 'B', status: 'offline', isFriend: false, mutualFriends: 12 },
    { id: 3, name: 'Carol Davis', username: '@carol', avatar: 'C', status: 'online', isFriend: true, mutualFriends: 8 },
    { id: 4, name: 'David Smith', username: '@david', avatar: 'D', status: 'away', isFriend: false, mutualFriends: 3 },
    { id: 5, name: 'Emma Johnson', username: '@emma', avatar: 'E', status: 'online', isFriend: true, mutualFriends: 15 },
    { id: 6, name: 'Frank Miller', username: '@frank', avatar: 'F', status: 'offline', isFriend: false, mutualFriends: 7 },
    { id: 7, name: 'Grace Lee', username: '@grace', avatar: 'G', status: 'online', isFriend: true, mutualFriends: 9 },
      { id: 4, name: 'David Smith', username: '@david', avatar: 'D', status: 'away', isFriend: false, mutualFriends: 3 },
    { id: 5, name: 'Emma Johnson', username: '@emma', avatar: 'E', status: 'online', isFriend: true, mutualFriends: 15 },
    { id: 6, name: 'Frank Miller', username: '@frank', avatar: 'F', status: 'offline', isFriend: false, mutualFriends: 7 },
    { id: 7, name: 'Grace Lee', username: '@grace', avatar: 'G', status: 'online', isFriend: true, mutualFriends: 9 },
      { id: 4, name: 'David Smith', username: '@david', avatar: 'D', status: 'away', isFriend: false, mutualFriends: 3 },
    { id: 5, name: 'Emma Johnson', username: '@emma', avatar: 'E', status: 'online', isFriend: true, mutualFriends: 15 },
    { id: 6, name: 'Frank Miller', username: '@frank', avatar: 'F', status: 'offline', isFriend: false, mutualFriends: 7 },
    { id: 7, name: 'Grace Lee', username: '@grace', avatar: 'G', status: 'online', isFriend: true, mutualFriends: 9 },
    { id: 8, name: 'Henry Brown', username: '@henry', avatar: 'H', status: 'away', isFriend: false, mutualFriends: 4 }
  ];

  const myFriends = allUsers.filter(user => user.isFriend);
  const onlineFriends = myFriends.filter(user => user.status === 'online');
 

  const tabClasses = (key: string) =>
    `px-4 py-2 rounded-t-xl rounded-bl-xl cursor-pointer transition-colors duration-200 text-primary ${
      activeTab === key
        ? 'bg-gradient-purple'
        : 'bg-grey hover:bg-[#21262d]'
    }`;

     const getFilteredUsers = () => {
    let users = [];
    switch (activeTab) {
      case 'all':
        users = allUsers;
        break;
      case 'online':
        users = onlineFriends;
        break;
      case 'friends':
        users = myFriends;
        break;
      default:
        users = allUsers;
    }
    
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

   const getStatusColor = (status: 'online' | 'away' | 'offline') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

 const handleAddFriend = (userId:number) => {
    // Simulate adding friend
    console.log(`Adding friend with ID: ${userId}`);
  };

  const handleRemoveFriend = (userId:number) => {
    // Simulate removing friend
    console.log(`Removing friend with ID: ${userId}`);
  };

  const handleMessage = (userId:number) => {
    // Simulate opening message
    console.log(`Opening message with user ID: ${userId}`);
  };
    
 
  return (
    <div className='flex flex-col h-full min-h-0 max-h-screen'>
       <div className="px-5 pb-5">
           <input className="w-full px-4 py-3 bg-tertiary-bg 
           border text-primary border-primary mt-3 h-[50px] rounded text-sm
            focus:outline-none focus:border-[#58a6ff] focus:ring-4
             focus:ring-[#58a6ff]/20" type="text"
              value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Friends..." />
       </div>
<nav className="bg-[#0d1117] border-b border-primary">
      <ul className="flex justify-between items-center px-5 py-3 gap-3">
        <li onClick={() => setActiveTab('all')} className={tabClasses('all')}>
          All Users 
        </li>
        <li onClick={() => setActiveTab('online')} className={tabClasses('online')}>
          Online Friends
        </li>
        <li onClick={() => setActiveTab('friends')} className={tabClasses('friends')}>
          My Friends  <span> ({myFriends.length})</span>
        </li>
      </ul>
    </nav>

   {/* Content */}
      <div className="flex-1  overflow-y-auto scrollbar-auto-hide p-4">
        {activeTab === 'all' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">All Users (A–Z)</h3>
              <span className="text-sm text-gray-400">{getFilteredUsers().length} users</span>
            </div>
            {getFilteredUsers().map(user => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} border-2 border-primary rounded-full`}></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary">{user.name}</div>
               
                
                </div>
                <div className="flex gap-2">
                  {user.isFriend ? (
                    <>
                      <button 
                        onClick={() => handleMessage(user.id)}
                        className="px-3 py-1 bg-[#58a6ff] text-primary rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Message
                      </button>
                      
                    </>
                  ) : (
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className="px-3 py-1 bg-green-600 text-primary rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'online' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Online Friends</h3>
              <span className="text-sm text-gray-400">{getFilteredUsers().length} online</span>
            </div>
            {getFilteredUsers().length > 0 ? (
              getFilteredUsers().map(user => (
                <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
                  <div className="relative">
                    <div className="w-12 h-12 bg-chat-icon rounded-full flex items-center justify-center text-primary font-semibold">
                      {user.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-primary">{user.name}</div>
                    <div className="text-xs text-green-400">Online now</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleMessage(user.id)}
                      className="px-3 py-1 bg-[#58a6ff] text-primary rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Message
                    </button>
                   
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No friends are online right now</div>
                <div className="text-sm text-gray-500">Check back later or invite friends to join!</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">My Friends</h3>
              <span className="text-sm text-gray-400">{getFilteredUsers().length} friends</span>
            </div>
            {getFilteredUsers().map(user => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-icon  rounded-full flex items-center justify-center text-primary font-semibold">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} border-2 border-gray-800 rounded-full`}></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary">{user.name}</div>
                
                  <div className="text-xs text-gray-500 capitalize">{user.status} • {user.mutualFriends} mutual friends</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleMessage(user.id)}
                    className="px-3 py-1 bg-[#58a6ff] text-primary rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Message
                  </button>
               
                  <button 
                    onClick={() => handleRemoveFriend(user.id)}
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {getFilteredUsers().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No results found</div>
            <div className="text-sm text-gray-500">Try adjusting your search or browse different categories</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends