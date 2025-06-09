import { User , Conversations } from '../types/user';


export const mockUsers: User[] = [
  { id: 1, name: 'Alice Cooper', username: '@alice', avatar: 'A', status: 'online', isFriend: true, mutualFriends: 5 },
  { id: 2, name: 'Bob Wilson', username: '@bob', avatar: 'B', status: 'offline', isFriend: false, mutualFriends: 12 },
  { id: 3, name: 'Carol Davis', username: '@carol', avatar: 'C', status: 'online', isFriend: true, mutualFriends: 8 },
  { id: 4, name: 'David Smith', username: '@david', avatar: 'D', status: 'away', isFriend: false, mutualFriends: 3 },
  { id: 5, name: 'Emma Johnson', username: '@emma', avatar: 'E', status: 'online', isFriend: true, mutualFriends: 15 },
  { id: 6, name: 'Frank Miller', username: '@frank', avatar: 'F', status: 'offline', isFriend: false, mutualFriends: 7 },
  { id: 7, name: 'Grace Lee', username: '@grace', avatar: 'G', status: 'online', isFriend: true, mutualFriends: 9 },
  { id: 8, name: 'Henry Brown', username: '@henry', avatar: 'H', status: 'away', isFriend: false, mutualFriends: 4 }
];


export const conversations: Conversations[] = [
  {
    id: "1",
    avatar: "A",
    online: true,
    name: "Alice",
    message: "Hello!",
    time: "10:00",
    unread: 2,
    active: true,
  },
  {
    id: "2",
    avatar: "B",
    online: false,
    name: "Bob",
    message: "How are you?",
    time: "09:45",
    unread: 0,
    active: false,
  },
  {
    id: "3",
    avatar: "C",
    online: true,
    name: "Carol",
    message: "Meeting at 3?",
    time: "09:00",
    unread: 1,
    active: false,
  },
  {
    id: "4",
    avatar: "D",
    online: false,
    name: "David",
    message: "See you later!",
    time: "08:15",
    unread: 0,
    active: false,
  },
  // ... more unique conversations if needed
];




export const allUsers: User[] = [
  { id: 1, name: 'Alice Cooper', username: '@alice', avatar: 'A', status: 'online', isFriend: true, mutualFriends: 5 },
  { id: 2, name: 'Bob Wilson', username: '@bob', avatar: 'B', status: 'offline', isFriend: false, mutualFriends: 12 },
  { id: 3, name: 'Carol Davis', username: '@carol', avatar: 'C', status: 'online', isFriend: true, mutualFriends: 8 },
  { id: 4, name: 'David Smith', username: '@david', avatar: 'D', status: 'away', isFriend: false, mutualFriends: 3 },
  { id: 5, name: 'Emma Johnson', username: '@emma', avatar: 'E', status: 'online', isFriend: true, mutualFriends: 15 },
  { id: 6, name: 'Frank Miller', username: '@frank', avatar: 'F', status: 'offline', isFriend: false, mutualFriends: 7 },
  { id: 7, name: 'Grace Lee', username: '@grace', avatar: 'G', status: 'online', isFriend: true, mutualFriends: 9 },
  { id: 8, name: 'Henry Brown', username: '@henry', avatar: 'H', status: 'away', isFriend: false, mutualFriends: 4 }
];