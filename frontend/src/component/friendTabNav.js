"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabClasses = (key) => `px-4 py-2 rounded-t-xl rounded-bl-xl cursor-pointer transition-colors duration-200 text-primary ${activeTab === key ? 'bg-gradient-purple' : 'bg-grey hover:bg-[#21262d]'}`;
    return (<nav className="bg-[#0d1117] border-b border-primary text-sm md:text-base">
  <ul className="flex justify-between items-center px-3 py-2 gap-2">
    <li onClick={() => onTabChange('all')} className={tabClasses('all')}>All Users</li>
    <li onClick={() => onTabChange('online')} className={tabClasses('online')}>Online Friends</li>
    <li onClick={() => onTabChange('friends')} className={tabClasses('friends')}>
      My Friends 
    </li>
  </ul>
    </nav>);
};
exports.default = TabNavigation;
