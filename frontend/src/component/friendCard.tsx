"use client";

import { getStatusColor } from '../utils/friendHelper';
import { User } from '@/types/user'; 
import Image from 'next/image';
interface FriendCardProps {
  user: User;
  isFriend: boolean; 
  status: string; 
  onMessage?: (id: number) => void;
  onAdd?: (id: number) => void;
  onRemove?: (id: number) => void;

}

const FriendCard: React.FC<FriendCardProps> = ({ user, onMessage, onAdd, onRemove,  isFriend, status }) => {

  
    const initials = `${(user?.firstname?.[0]?.toUpperCase() || "") + (user?.lastname?.[0]?.toUpperCase() || "")}`;
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-primary font-semibold">
    

  
    
           {user.profilePicture ? (
             <Image
               width={80}
               height={80}
               src={user.profilePicture}
               alt="Profile"
               className="w-full h-full rounded-full object-cover"
             />
           ) : (
             initials
           )}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(status as "online" | "away" | "offline")} border-2 border-primary rounded-full`} />
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="font-semibold text-primary">{user.firstname}</div>
        <div className="flex flex-col gap-2">
          {isFriend ? (
            <>
              <button onClick={() => onMessage?.(user.id)} className="px-3 py-1 bg-[#58a6ff] text-primary  rounded-lg hover:bg-blue-700 transition-colors text-xs">
                Message
              </button>
              {onRemove && (
                <button onClick={() => onRemove(user.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-xs">
                  Remove
                </button>
              )}
            </>
          ) : (
            onAdd && (
              <button onClick={() => onAdd(user.id)} className="px-3 py-1 bg-green-600 text-primary rounded-lg hover:bg-green-700 transition-colors text-xs">
                Add Friend
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;