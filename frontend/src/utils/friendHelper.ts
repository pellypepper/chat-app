
import { Friend, User } from '@/types/user'; // Assuming this exists
import { useFriendsStore } from '@/store/friendStore';


export const getStatusColor = (status: 'online' | 'away' | 'offline') => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
    default:
      return 'bg-gray-500';
  }
};

export const getFilteredUsers = (activeTab: string, searchQuery: string): User[] => {
  const { allUsers, friends, onlineFriends } = useFriendsStore.getState();

  let users: User[] = [];
  switch (activeTab) {
    case 'online':
      users = allUsers.filter(user => onlineFriends.includes(user.id));
      break;
    case 'friends':
      users = friends;
      break;
    case 'all':
    default:
      users = allUsers;
  }

  return users.filter(user =>
    user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())

  );
};
