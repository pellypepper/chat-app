// components/Friends/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  myFriendsCount: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, myFriendsCount }) => {
  const tabClasses = (key: string) =>
    `px-4 py-2 rounded-t-xl rounded-bl-xl cursor-pointer transition-colors duration-200 text-primary ${
      activeTab === key ? 'bg-gradient-purple' : 'bg-grey hover:bg-[#21262d]'
    }`;

  return (
    <nav className="bg-[#0d1117] border-b border-primary">
      <ul className="flex justify-between items-center px-5 py-3 gap-3">
        <li onClick={() => onTabChange('all')} className={tabClasses('all')}>All Users</li>
        <li onClick={() => onTabChange('online')} className={tabClasses('online')}>Online Friends</li>
        <li onClick={() => onTabChange('friends')} className={tabClasses('friends')}>My Friends <span>({myFriendsCount})</span></li>
      </ul>
    </nav>
  );
};

export default TabNavigation;
