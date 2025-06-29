"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageStore_1 = require("@/store/messageStore");
const loginStore_1 = require("@/store/loginStore");
const friendStore_1 = require("@/store/friendStore");
const react_1 = require("react");
const image_1 = __importDefault(require("next/image"));
const useSocket_1 = require("@/hooks/useSocket");
const lucide_react_1 = require("lucide-react");
const Rightdashboard = ({ chat, handleUpdateOpen, onBack }) => {
    const { fetchMessages, messages, fetchChatsSummary, sendMessage, deleteChatEveryone, deleteMessageEveryone, } = (0, messageStore_1.useChatStore)();
    const user = (0, loginStore_1.useAuthStore)(state => state.user);
    const currentUserId = user?.id;
    const { onlineFriends, getUserSeen } = (0, friendStore_1.useFriendsStore)();
    const { socket } = (0, useSocket_1.useSocketContext)();
    const chatMessages = (0, react_1.useMemo)(() => (chat ? messages[chat.id] || [] : []), [chat, messages]);
    const messagesEndRef = (0, react_1.useRef)(null);
    // For message input and file
    const [input, setInput] = (0, react_1.useState)('');
    const [file, setFile] = (0, react_1.useState)(null);
    const [sending, setSending] = (0, react_1.useState)(false);
    const [lastSeen, setLastSeen] = (0, react_1.useState)(null);
    // Determine other user for 1:1 chat
    const otherUserId = (chat && chat.participants && chat.participants.length === 2 && currentUserId)
        ? chat.participants.find(p => p.id !== currentUserId)?.id
        : null;
    // Listen for new messages for the current chat
    (0, react_1.useEffect)(() => {
        if (!socket || !chat?.id)
            return;
        const handleNewMessage = ({ message }) => {
            if (message && chat && message.chatId === chat.id) {
                fetchMessages(chat.id);
            }
        };
        socket.on("new_message", handleNewMessage);
        socket.emit("join_chat", chat.id);
        fetchMessages(chat.id);
        return () => {
            socket.emit("leave_chat", chat.id);
            socket.off("new_message", handleNewMessage);
        };
    }, [chat, fetchMessages, socket]);
    (0, react_1.useEffect)(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, chat]);
    // Last seen display logic for 1:1 chat
    const [onlineText, setOnlineText] = (0, react_1.useState)("Offline");
    const [isOtherUserOnline, setIsOtherUserOnline] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        async function fetchStatusAndSeen() {
            if (chat && chat.participants && chat.participants.length === 2 && otherUserId) {
                const online = onlineFriends.includes(otherUserId);
                setIsOtherUserOnline(online);
                if (online) {
                    setOnlineText("Active now");
                    setLastSeen(null);
                }
                else {
                    // Fetch last seen for the other user
                    try {
                        const res = await getUserSeen(otherUserId);
                        if (isMounted) {
                            setLastSeen(res?.lastSeen ?? null);
                            setOnlineText(res?.lastSeen
                                ? `Last seen: ${formatLastSeen(res.lastSeen)}`
                                : "Offline");
                        }
                    }
                    catch {
                        if (isMounted) {
                            setLastSeen(null);
                            setOnlineText("Offline");
                        }
                    }
                }
            }
            else if (chat && chat.participants && chat.participants.length > 2) {
                // Group logic
                setLastSeen(null);
                setOnlineText("");
                setIsOtherUserOnline(false);
            }
            else {
                setOnlineText("Connecting...");
                setLastSeen(null);
            }
        }
        fetchStatusAndSeen();
        return () => { isMounted = false; };
    }, [chat, onlineFriends, getUserSeen, currentUserId, otherUserId]);
    //  format "last seen" string
    function formatLastSeen(isoString) {
        if (!isoString)
            return "";
        const date = new Date(isoString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff < 60 * 1000)
            return "just now";
        if (diff < 60 * 60 * 1000)
            return `${Math.floor(diff / 60000)} min ago`;
        if (diff < 24 * 60 * 60 * 1000)
            return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleString();
    }
    const handleSend = async () => {
        if ((!input.trim() && !file) || !chat)
            return;
        setSending(true);
        try {
            await sendMessage(chat.id, input.trim() ? input : undefined, file || undefined);
            await fetchChatsSummary();
            setInput('');
            setFile(null);
        }
        catch (error) {
        }
        finally {
            setSending(false);
        }
    };
    const handleDeleteMessageEveryone = async (chatId, msgId) => {
        if (chatId && msgId) {
            try {
                await deleteMessageEveryone(chatId, msgId);
            }
            catch (error) { }
        }
    };
    const handleDeleteChat = async (chatId) => {
        if (chatId) {
            try {
                await deleteChatEveryone(chatId);
                onBack();
            }
            catch (error) { }
        }
    };
    const handleInfo = (chat) => {
        handleUpdateOpen(chat);
    };
    const isImageUrl = (url) => {
        if (!url || typeof url !== 'string')
            return false;
        if (url.includes('pelly-chat.s3.') && /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
            return true;
        }
        return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
    };
    // Online indicator
    const onlineIndicator = (<div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${isOtherUserOnline ? "bg-green-500" : "bg-gray-400"}`}></div>);
    // For group chats: build a map of participantId -> online status
    const groupParticipantStatus = {};
    if (chat && chat.participants && chat.participants.length > 2) {
        chat.participants.forEach(p => {
            if (p.id === currentUserId)
                return;
            groupParticipantStatus[p.id] = onlineFriends.includes(p.id) ? "online" : "offline";
        });
    }
    return (<div className="p-4 ">
      <div className="flex flex-col flex-1 h-screen">
           {chat ?
            (<div className="flex flex-col flex-1 h-screen">
         <div className="p-5 border-b border-primary flex items-center justify-between">
           {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="md:hidden text-xs text-primary mb-4">
                      <lucide_react_1.ArrowLeft className="w-5 h-5 text-primary "/>
            </button>
            <div className="relative w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-primary text-xs font-semibold">
              {chat?.name?.[0] ?? "?"}
              {chat && chat.participants && chat.participants.length === 2 && onlineIndicator}
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-primary">{chat ? chat.name : ""}</h3>
              <div className="text-secondary text-sm flex items-center gap-2">
                {chat && chat.participants && chat.participants.length === 2 ? (<>
                    {isOtherUserOnline ? (<span className="text-green-500">Online</span>) : (<span className="text-gray-400">{onlineText}</span>)}
                    {lastSeen && !isOtherUserOnline && (<span className="text-xs text-gray-500">
            
                      </span>)}
                  </>) : chat && chat.participants && chat.participants.length > 2 ? (<span className="text-gray-400">Group Chat</span>) : ""}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
  

            <button onClick={() => handleInfo(chat)} className="w-10 h-10 rounded-full bg-tertiary-bg hover:bg-primary  text-secondary hover:text-primary flex items-center justify-center transition">
              ℹ️
            </button>
            <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-800 text-white flex items-center justify-center transition" title="Delete Chat" onClick={() => {
                    if (chat?.id !== undefined)
                        handleDeleteChat(chat.id);
                }}>
              🗑️
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 scrollbar-hidden">
          {chatMessages.length === 0 && (<div className="text-secondary text-center mt-10">No messages yet.</div>)}

          {chatMessages.map((msg, idx) => {
                    const isSent = msg.senderId === currentUserId;
                    const isImage = msg.type === 'image' || isImageUrl(msg.content);
                    // Get sender info
                    const sender = chat?.participants?.find(p => p.id === msg.senderId);
                    const senderName = !isSent
                        ? sender?.name || "Unknown"
                        : user?.firstname || "You";
                    const initials = isSent
                        ? (user?.firstname?.[0] || "Y")
                        : (sender?.name?.[0] || "U");
                    // For group: determine online status below each message
                    let messageStatus = null;
                    if (chat && chat.participants && chat.participants.length > 2 && sender && sender.id !== currentUserId) {
                        messageStatus = groupParticipantStatus[sender.id] === "online" ? "Online" : "Offline";
                    }
                    return (<div key={msg.id || idx} className={`flex gap-3 max-w-[70%] ${isSent ? "self-start flex-row" : "self-end flex-row-reverse"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold 
                  ${isSent ? "bg-gradient-to-br from-[#58a6ff] to-[#a855f7]" : "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]"} flex-shrink-0`}>
                  {initials}
                </div>
                <div className="flex flex-col">
                  {/* Name above message */}
                   {messageStatus && (<div className="text-xs mt-1 text-[#a3a3a3] text-right">
                        {messageStatus}
                      </div>)}
                  <div className={`text-xs mb-1 ml-2 ${isSent ? "text-[#7d8590] text-left" : "text-[#7d8590] text-right"}`}>
                    {senderName}
                    
                  </div>
                  <div className={`px-4 py-3 rounded-xl relative group ${isSent
                            ? "bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white rounded-bl-sm"
                            : "bg-[#21262d] border border-[#30363d] text-white rounded-br-sm"}`}>
                    <div>
                      {isImage ? (<>
                          <image_1.default src={msg.content} alt="sent image" width={320} height={240} className="max-w-xs rounded-lg mb-1" style={{ width: 'auto', height: 'auto', maxWidth: '20rem', maxHeight: '15rem' }} unoptimized onError={(e) => {
                                const target = e.target;
                                target.style.display = 'none';
                                if (target.nextSibling instanceof HTMLElement) {
                                    target.nextSibling.style.display = 'block';
                                }
                            }}/>
                          <span style={{ display: 'none' }}>{msg.content}</span>
                        </>) : (<span>{msg.content}</span>)}
                    </div>
                    {/* Group chat: online/offline status under name */}
                   
                    <div className={`text-xs mt-2 ${isSent ? "text-white/70" : "text-[#7d8590]"}`}>
                      {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                      {isSent && (<span className="ml-2">
                          ✓✓
                        </span>)}
                    </div>
                    {/* Message actions */}
                    <div className={`absolute top-2 ${isSent ? "left-2" : "right-2"} opacity-0 group-hover:opacity-100 flex gap-2`}>
                      <button title="Delete for everyone" className="text-xs px-2 py-1 bg-black/20 rounded hover:bg-red-600 hover:text-white transition-colors" onClick={() => handleDeleteMessageEveryone(chat.id, msg.id)}>
                        🗑️
                      </button>
                    </div>
                    
                  </div>
                </div>
                
              </div>);
                })}
          <div ref={messagesEndRef}/>
        </div>

        {/* Input */}
        <div className="p-5 border-t border-[#30363d]">
          <form onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                }} className="flex items-center gap-3 bg-[#21262d] border border-[#30363d] rounded-full px-5 py-3">
            <div className="flex gap-2 text-[#7d8590]">
              <label className="hover:text-[#58a6ff] transition cursor-pointer">
                📎
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                    }
                }} disabled={sending}/>
              </label>
            </div>
            <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-primary focus:outline-none text-base placeholder-[#7d8590]" value={input} onChange={e => setInput(e.target.value)} disabled={sending}/>
            {file && (<div className="flex items-center">
                <image_1.default src={URL.createObjectURL(file)} alt="preview" width={40} height={40} className="w-10 h-10 object-cover rounded-full mr-2"/>
                <button type="button" onClick={() => setFile(null)} className="text-red-500 text-xs">
                  ✕
                </button>
              </div>)}
            <button type="submit" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] text-white hover:scale-110 transition" disabled={sending || (!input.trim() && !file)} title="Send">
              ➤
            </button>
          </form>
        </div>
      </div>) : (<div className="flex flex-col items-center justify-center h-full text-center px-4">
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a855f7] flex items-center justify-center text-white text-4xl mb-4 shadow-lg">
    💬
  </div>
  <h1 className="text-2xl font-semibold text-gradient-purple mb-2">Select a chat</h1>
  <p className="text-secondary text-sm max-w-xs">
    Choose a conversation from the left panel to start messaging.
  </p>
        </div>)}
      </div>
    </div>);
};
exports.default = Rightdashboard;
