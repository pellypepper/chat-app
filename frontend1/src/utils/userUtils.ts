import { User, TabType } from '../types/user';

export const filterUsersByTab = (users: User[], tab: TabType): User[] => {
  switch (tab) {
    case 'all':
      return users;
    case 'online':
      return users.filter(user => user.isFriend && user.status === 'online');
    case 'friends':
      return users.filter(user => user.isFriend);
    default:
      return users;
  }
};

export const filterUsersBySearch = (users: User[], searchQuery: string): User[] => {
  if (!searchQuery.trim()) return users;
  
  const query = searchQuery.toLowerCase();
  return users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query)
  );
};

export const getStatusColor = (status: User['status']): string => {
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