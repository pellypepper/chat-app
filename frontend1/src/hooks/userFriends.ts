import { useState, useMemo } from 'react';
import { User, TabType } from '../types/user';
import { filterUsersByTab, filterUsersBySearch } from '../utils/userUtils';

export const useFriends = (allUsers: User[]) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myFriends = useMemo(() => allUsers.filter(user => user.isFriend), [allUsers]);
  const onlineFriends = useMemo(() => myFriends.filter(user => user.status === 'online'), [myFriends]);

  const filteredUsers = useMemo(() => {
    const tabFiltered = filterUsersByTab(allUsers, activeTab);
    return filterUsersBySearch(tabFiltered, searchQuery);
  }, [allUsers, activeTab, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    myFriends,
    onlineFriends,
    filteredUsers
  };
};