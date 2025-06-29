"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const friendHelper_1 = require("../utils/friendHelper");
const image_1 = __importDefault(require("next/image"));
const FriendCard = ({ user, onMessage, onAdd, onRemove, isFriend, status }) => {
    const initials = `${(user?.firstname?.[0]?.toUpperCase() || "") + (user?.lastname?.[0]?.toUpperCase() || "")}`;
    return (<div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-primary font-semibold">
    

  
    
           {user.profilePicture ? (<image_1.default width={80} height={80} src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover"/>) : (initials)}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${(0, friendHelper_1.getStatusColor)(status)} border-2 border-primary rounded-full`}/>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="font-semibold text-primary">{user.firstname}</div>
        <div className="flex flex-col gap-2">
          {isFriend ? (<>
              <button onClick={() => onMessage?.(user.id)} className="px-3 py-1 bg-[#58a6ff] text-primary  rounded-lg hover:bg-blue-700 transition-colors text-xs">
                Message
              </button>
              {onRemove && (<button onClick={() => onRemove(user.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-xs">
                  Remove
                </button>)}
            </>) : (onAdd && (<button onClick={() => onAdd(user.id)} className="px-3 py-1 bg-green-600 text-primary rounded-lg hover:bg-green-700 transition-colors text-xs">
                Add Friend
              </button>))}
        </div>
      </div>
    </div>);
};
exports.default = FriendCard;
