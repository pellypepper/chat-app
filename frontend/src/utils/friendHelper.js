"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredUsers = exports.getStatusColor = void 0;
const friendStore_1 = require("@/store/friendStore");
const getStatusColor = (status) => {
    switch (status) {
        case 'online':
            return 'bg-green-500';
        case 'away':
            return 'bg-yellow-500';
        case 'offline':
        default:
            return 'bg-gray-500';
    }
};
exports.getStatusColor = getStatusColor;
const getFilteredUsers = (activeTab, searchQuery) => {
    const { allUsers, friends, onlineFriends } = friendStore_1.useFriendsStore.getState();
    let users = [];
    switch (activeTab) {
        case 'online':
            users = allUsers.filter(user => onlineFriends.includes(user.id));
            break;
        case 'friends':
            users = friends;
            break;
        case 'all':
        default:
            users = allUsers;
    }
    return users.filter(user => user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()));
};
exports.getFilteredUsers = getFilteredUsers;
