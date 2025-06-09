import React from 'react'
import { Conversations } from '../types/user';
type MessagesProps = {
   
 conversations: Conversations[];
    onChatSelect: (chatId: string) => void;


};



const Messages : React.FC<MessagesProps> = ({ conversations, onChatSelect}) => {



  return (
    <div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div 
       onClick={() => onChatSelect(conversation.id)}
            key={conversation.id}
            className={`flex p-4 justify-between items-center border-b border-gray-600 gap-3 hover:bg-gray-700/30 cursor-pointer transition-all duration-200 ${
              conversation.active 
                ? 'bg-gray-700/50 border-r-4 border-blue-400' 
                : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative w-[45px] h-[45px] rounded-full bg-gradient-purple text-primary flex items-center justify-center font-semibold text-base">
              <p>{conversation.avatar}</p>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="font-semibold text-primary">{conversation.name}</div>
              <div className="text-sm text-gray-400 truncate">{conversation.message}</div>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-end gap-1 text-xs">
              <span className="text-gray-400">{conversation.time}</span>
              {conversation.unread > 0 && (
                <span className="bg-gradient-orange text-primary font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs">
                  {conversation.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
