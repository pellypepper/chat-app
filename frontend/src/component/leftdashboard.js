"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const stories_1 = __importDefault(require("./stories"));
const messages_1 = __importDefault(require("./messages"));
const friends_1 = __importDefault(require("./friends"));
const createGroupIcon_1 = __importDefault(require("./createGroupIcon"));
const loginStore_1 = require("@/store/loginStore");
const navigation_1 = require("next/navigation");
const successPop_1 = __importDefault(require("./successPop"));
const errorpopup_1 = __importDefault(require("./errorpopup"));
const spinner_1 = require("./spinner");
const messageStore_1 = require("@/store/messageStore");
const Leftdashboard = ({ handleGroup, handleClick, onChatSelect }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('Messages');
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const [showError, setShowError] = (0, react_1.useState)(false);
    const navItems = ['Messages', 'Friends', 'Group'];
    const router = (0, navigation_1.useRouter)();
    const { logout, isLoading, user, error } = (0, loginStore_1.useAuthStore)();
    const { chats } = (0, messageStore_1.useChatStore)();
    // Handle logout and redirect
    const handleLogout = async () => {
        try {
            await logout();
            setShowSuccess(true);
            // Redirect after 2 seconds without waiting for click
            setTimeout(() => {
                router.push('/withNavpages');
            }, 2000);
        }
        catch {
            setShowError(true);
        }
    };
    // Handle error dismissal
    const handleErrorDismiss = () => {
        setShowError(false);
    };
    return (<section className=" p-4 h-screen bg-primary-bg flex flex-col">
      <div className="flex justify-between p-5 items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-icon text-primary flex items-center justify-center font-semibold">
    {(user?.firstname?.[0]?.toUpperCase() || "") + (user?.lastname?.[0]?.toUpperCase() || "")}

        </div>
        <div className="flex gap-2">
          <p onClick={handleClick} className="text-primary text-xl md:text-2xl cursor-pointer">⚙️</p>
    <p onClick={handleLogout} className="text-primary text-xl md:text-2xl cursor-pointer">⏻</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-primary">
        <ul className="flex justify-between items-center w-full relative">
          {navItems.map((item) => (<li key={item} className="flex-1">
              <button onClick={() => setActiveTab(item)} className={`w-full p-4 text-center transition-all duration-200 relative ${activeTab === item
                ? 'text-primary font-semibold'
                : 'text-gray-400 hover:text-gray-300'}`}>
                {item}
                {activeTab === item && (<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-purple rounded-full"></div>)}
              </button>
            </li>))}
        </ul>
      </nav>

      {/* Content Area */}
      <section className="flex-1 flex flex-col min-h-0">
        {activeTab === 'Messages' && (<div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 flex-shrink-0">
              <stories_1.default />
            </div>
        <div className="flex-1 border-t  border-primary overflow-y-auto scrollbar-auto-hide px-5">
            {chats.length > 0 ? (<messages_1.default onChatSelect={onChatSelect} conversations={chats
                    .filter(chat => !chat.isGroup)
                    .map(chat => {
                    const participantWithPicture = chat.participants.find(p => p.profilePicture);
                    return {
                        id: Number(chat.id),
                        name: chat.name,
                        avatar: participantWithPicture ? participantWithPicture.profilePicture : '',
                        message: chat.lastMessage || '',
                        time: chat.lastMessageAt || '',
                        unread: 0,
                    };
                })}/>) : (<div className="flex flex-col items-center justify-center mt-16 text-center text-secondary">
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" className="mb-4">
      <circle cx="32" cy="32" r="32" fill="#23272F"/>
      <path d="M22 28a10 10 0 0 1 20 0v4a10 10 0 0 1-20 0v-4Z" stroke="#A855F7" strokeWidth="2"/>
      <circle cx="26" cy="32" r="2" fill="#58A6FF"/>
      <circle cx="38" cy="32" r="2" fill="#58A6FF"/>
      <rect x="28" y="38" width="8" height="2" rx="1" fill="#A855F7"/>
    </svg>
    <h2 className="text-lg font-semibold text-primary mb-1">No Conversations Yet</h2>
    <p className="text-sm text-secondary max-w-xs">
      Start a chat with your friends or contacts to see your conversations here.
    </p>
  </div>)}
        </div>

          </div>)}

        {activeTab === 'Friends' && (<div className="p-5">
            <friends_1.default onChatSelect={onChatSelect}/>
          </div>)}

        {activeTab === 'Group' && (<div className="flex-1 flex flex-col min-h-0">
            <div className="p-5 flex-shrink-0">
              <div className="p-2 mt-2 flex justify-center">
                <button onClick={handleGroup} className="flex justify-center items-center gap-2 bg-gradient-purple text-primary font-semibold px-5 py-3 rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out">
                  <createGroupIcon_1.default size={24} color="white"/>
                  Create Group
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-5">
              {chats.length > 0 ? (<messages_1.default onChatSelect={onChatSelect} conversations={chats
                    .filter(chat => chat.isGroup)
                    .map((chat) => ({
                    id: Number(chat.id),
                    name: chat.name,
                    avatar: '',
                    message: chat.lastMessage || '',
                    time: chat.lastMessageAt || '',
                    unread: 0,
                }))}/>) : (<div className="text-center text-gray-400">
                  <p className="text-lg font-semibold">No Groups Available</p>
                  <p className="text-sm">Create or join a group to start chatting!</p>
                </div>)}
            </div>
          </div>)}
      </section>

      {/* Loading Spinner Overlay */}
      {isLoading && (<div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <spinner_1.MultiRingSpinner />
        </div>)}

      {/* Success Popup */}
      {showSuccess && (<successPop_1.default message="Logout successful! Redirecting to homepage in 3 seconds..." handleTimeout={() => { }} url="/withNavpages" tempState={null}/>)}

      {/* Error Popup */}
      {showError && (<errorpopup_1.default message={error || 'Logout failed. Please try again.'} handleTimeout={handleErrorDismiss}/>)}
    </section>);
};
exports.default = Leftdashboard;
