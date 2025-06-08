export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  isFriend: boolean;
  mutualFriends: number;
}

export type TabType = 'all' | 'online' | 'friends';

export type Chat = {
  id: string;
  avatar: string;
  online: boolean;
  name: string;
  message: string;
  time: string;
  unread: number;
  active: boolean;
};