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
const messageStore_1 = require("@/store/messageStore");
const loginStore_1 = require("@/store/loginStore");
const friendStore_1 = require("@/store/friendStore");
const spinner_1 = require("@/component/spinner");
const dashboardMobileView_1 = __importDefault(require("@/component/dashboardMobileView"));
const dashboardDesktopView_1 = __importDefault(require("@/component/dashboardDesktopView"));
const ModalContainer_1 = __importDefault(require("@/component/ModalContainer"));
const Dashboard = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [selectedChat, setSelectedChat] = (0, react_1.useState)(null);
    const [showCreateGroup, setShowCreateGroup] = (0, react_1.useState)(false);
    const [showUpdateGroup, setShowUpdateGroup] = (0, react_1.useState)(false);
    const [showFriendProfile, setShowFriendProfile] = (0, react_1.useState)(false);
    const [updateGroupChat, setUpdateGroupChat] = (0, react_1.useState)(null);
    const { isAuthenticated, getSession } = (0, loginStore_1.useAuthStore)();
    const { chats, fetchChatsSummary } = (0, messageStore_1.useChatStore)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [loadingStage, setLoadingStage] = (0, react_1.useState)('redirecting');
    const { fetchFriends, fetchOnlineFriends, fetchAllUsers } = (0, friendStore_1.useFriendsStore)();
    //fetch user session on mount
    (0, react_1.useEffect)(() => {
        const fetchUser = async () => {
            await getSession();
        };
        fetchUser();
    }, [getSession]);
    // Handle loading stages based on authentication status
    (0, react_1.useEffect)(() => {
        if (isAuthenticated) {
            setLoadingStage('redirecting');
            const timer1 = setTimeout(() => {
                setLoadingStage('authenticating');
            }, 2500);
            const timer2 = setTimeout(() => {
                setLoading(false);
            }, 5000);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
        else {
            setLoading(false);
        }
    }, [isAuthenticated]);
    (0, react_1.useEffect)(() => {
        fetchAllUsers();
        fetchFriends();
        fetchChatsSummary();
        fetchOnlineFriends();
    }, [fetchAllUsers, fetchFriends, fetchOnlineFriends, fetchChatsSummary]);
    const handleClick = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    // Handle chat selection
    const handleChatSelect = async (chatId, optionalChat) => {
        if (optionalChat) {
            setSelectedChat(optionalChat);
            return;
        }
        const selected = chats.find(c => Number(c.id) === chatId) || null;
        if (!selected || !Array.isArray(selected.participants)) {
            setSelectedChat(null);
            return;
        }
        const normalizedSelected = {
            ...selected,
            participants: selected.participants.map((p) => ({
                id: p.id,
                name: p.name ?? '',
            })),
            lastMessage: selected.lastMessage ?? undefined,
            lastMessageAt: selected.lastMessageAt ?? undefined,
        };
        setSelectedChat(normalizedSelected);
    };
    // Handle group creation toggle
    const handleGroup = () => {
        setShowCreateGroup(!showCreateGroup);
    };
    const handleUpdateOpen = (chat) => {
        if (chat?.isGroup) {
            setUpdateGroupChat(chat);
            setShowUpdateGroup(!showUpdateGroup);
        }
        else {
            setShowFriendProfile(!showFriendProfile);
            setUpdateGroupChat(chat);
        }
    };
    // Handle click outside to close modals
    const handleClickOutside = () => {
        setShowCreateGroup(false);
        setShowUpdateGroup(false);
        setShowFriendProfile(false);
    };
    const handleGroupUpdated = (updated) => {
        setSelectedChat(prev => prev && prev.id === updated.id
            ? {
                ...prev,
                name: updated.name,
                participants: updated.participants.map(id => {
                    const found = prev.participants.find(p => p.id === id);
                    return found ? found : { id, name: "" };
                })
            }
            : prev);
    };
    const handleBack = () => setSelectedChat(null);
    if (loading) {
        return (<div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4 ">
        <spinner_1.MultiRingSpinner />
        <p className="text-lg font-semibold text-primary">
          {loadingStage === 'redirecting' ? 'redirecting...' : 'Authenticating...'}
        </p>
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div className={`h-full bg-gradient-to-r from-blue-400 to-purple-600 animate-progressBar`} style={{ animationDuration: '5s' }}/>
        </div>
      </div>);
    }
    return (<div className="h-screen overflow-hidden ">
      <dashboardMobileView_1.default selectedChat={selectedChat} handleUpdateOpen={handleUpdateOpen} handleBack={handleBack} handleGroup={handleGroup} handleChatSelect={handleChatSelect} handleClick={handleClick}/>
      <dashboardDesktopView_1.default selectedChat={selectedChat} handleUpdateOpen={handleUpdateOpen} handleBack={handleBack} handleGroup={handleGroup} handleChatSelect={handleChatSelect} handleClick={handleClick}/>
      <ModalContainer_1.default isOpen={isOpen} handleClose={handleClose} showCreateGroup={showCreateGroup} handleClickOutside={handleClickOutside} showUpdateGroup={showUpdateGroup} updateGroupChat={updateGroupChat} handleGroupUpdated={handleGroupUpdated} showFriendProfile={showFriendProfile}/>
    </div>);
};
exports.default = Dashboard;
