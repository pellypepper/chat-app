"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStatus = exports.searchFriends = exports.getFriendDetails = exports.getOnlineFriends = exports.removeFriend = exports.getFriends = exports.addFriend = exports.allUsers = void 0;
var db_1 = require("../util/db");
var schema_1 = require("../model/schema");
var drizzle_orm_1 = require("drizzle-orm");
var socket_1 = require("../util/socket");
var allUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, results, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.users.id,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                        profilePicture: schema_1.users.profilePicture,
                    })
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.not)((0, drizzle_orm_1.eq)(schema_1.users.id, userId)))
                        .orderBy(schema_1.users.firstname)];
            case 2:
                results = _b.sent();
                res.status(200).json({ users: results });
                return [2 /*return*/];
            case 3:
                error_1 = _b.sent();
                console.error('Fetch all users error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.allUsers = allUsers;
// Add a friend
var addFriend = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, friendId, existing, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                friendId = req.body.friendId;
                if (!userId || !friendId) {
                    res.status(400).json({ error: 'Missing user or friend ID' });
                    return [2 /*return*/];
                }
                if (userId === friendId) {
                    res.status(400).json({ error: 'You cannot add yourself as a friend' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.friends)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)))];
            case 2:
                existing = _b.sent();
                if (existing.length) {
                    res.status(409).json({ error: 'Already friends' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db.insert(schema_1.friends).values([
                        { userId: userId, friendId: friendId },
                        { userId: friendId, friendId: userId }, // mutual friendship
                    ])];
            case 3:
                _b.sent();
                res.status(201).json({ message: 'Friend added' });
                return [2 /*return*/];
            case 4:
                error_2 = _b.sent();
                console.error('Add friend error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addFriend = addFriend;
// Get all friends of a user
var getFriends = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, results, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.users.id,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                        profilePicture: schema_1.users.profilePicture,
                    })
                        .from(schema_1.friends)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.friends.friendId, schema_1.users.id))
                        .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId))
                        .orderBy(schema_1.users.firstname)];
            case 2:
                results = _b.sent();
                res.status(200).json({ friends: results });
                return [2 /*return*/];
            case 3:
                error_3 = _b.sent();
                console.error('Fetch friends error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getFriends = getFriends;
// Remove a friend
var removeFriend = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, friendId, existing, userChatIds, possibleChats, _i, possibleChats_1, chat, chatParticipants, chatParticipantIds, targetIds, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                friendId = req.body.friendId;
                if (!userId || !friendId) {
                    res.status(400).json({ error: 'Missing user or friend ID' });
                    return [2 /*return*/];
                }
                if (userId === friendId) {
                    res.status(400).json({ error: 'You cannot remove yourself as a friend' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 14, , 15]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.friends)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)))];
            case 2:
                existing = _b.sent();
                if (!existing.length) {
                    res.status(404).json({ error: 'Friend not found' });
                    return [2 /*return*/];
                }
                // Remove both directions of the friendship
                return [4 /*yield*/, db_1.db
                        .delete(schema_1.friends)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)))];
            case 3:
                // Remove both directions of the friendship
                _b.sent();
                return [4 /*yield*/, db_1.db
                        .delete(schema_1.friends)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, friendId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, userId)))];
            case 4:
                _b.sent();
                return [4 /*yield*/, db_1.db
                        .select({ chatId: schema_1.userChats.chatId })
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId))];
            case 5:
                userChatIds = (_b.sent()).map(function (row) { return row.chatId; });
                if (!(userChatIds.length > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.chats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.chats.id, userChatIds), (0, drizzle_orm_1.eq)(schema_1.chats.isGroup, false)))];
            case 6:
                possibleChats = _b.sent();
                _i = 0, possibleChats_1 = possibleChats;
                _b.label = 7;
            case 7:
                if (!(_i < possibleChats_1.length)) return [3 /*break*/, 13];
                chat = possibleChats_1[_i];
                return [4 /*yield*/, db_1.db
                        .select({ userId: schema_1.userChats.userId })
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id))];
            case 8:
                chatParticipants = _b.sent();
                chatParticipantIds = chatParticipants.map(function (p) { return p.userId; }).sort();
                targetIds = [userId, friendId].sort();
                if (!(chatParticipantIds.length === 2 &&
                    chatParticipantIds[0] === targetIds[0] &&
                    chatParticipantIds[1] === targetIds[1])) return [3 /*break*/, 12];
                // Delete messages in the chat
                return [4 /*yield*/, db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chat.id))];
            case 9:
                // Delete messages in the chat
                _b.sent();
                // Delete user-chat links
                return [4 /*yield*/, db_1.db.delete(schema_1.userChats).where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id))];
            case 10:
                // Delete user-chat links
                _b.sent();
                // Delete the chat itself
                return [4 /*yield*/, db_1.db.delete(schema_1.chats).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chat.id))];
            case 11:
                // Delete the chat itself
                _b.sent();
                _b.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 7];
            case 13:
                res.status(200).json({ message: 'Friend removed and chat (if any) deleted' });
                return [2 /*return*/];
            case 14:
                error_4 = _b.sent();
                console.error('Remove friend error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.removeFriend = removeFriend;
// Get online friends
var getOnlineFriends = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, friendRecords, friendIds, onlineFriendIds, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                console.log("Checking online friends for user:", userId);
                console.log("All online users:", Array.from(socket_1.onlineUsers.keys()));
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select({ friendId: schema_1.friends.friendId })
                        .from(schema_1.friends)
                        .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId))];
            case 2:
                friendRecords = _b.sent();
                friendIds = friendRecords.map(function (f) { return f.friendId; });
                console.log("Friend IDs:", friendIds);
                onlineFriendIds = friendIds.filter(function (id) { return socket_1.onlineUsers.has(id); });
                console.log("Online friend IDs:", onlineFriendIds);
                res.status(200).json({ online: onlineFriendIds });
                return [2 /*return*/];
            case 3:
                error_5 = _b.sent();
                console.error('Get online friends error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOnlineFriends = getOnlineFriends;
//get friend details by Id
var getFriendDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, friendId, friend, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                friendId = Number(req.params.friendId);
                console.log("Fetching details for friend ID:", friendId, "for user ID:", userId);
                if (!userId || !friendId) {
                    res.status(400).json({ error: 'Missing user or friend ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.users.id,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                        profilePicture: schema_1.users.profilePicture,
                    })
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.eq)(schema_1.users.id, friendId))
                        .limit(1)];
            case 2:
                friend = _b.sent();
                if (!friend.length) {
                    res.status(404).json({ error: 'Friend not found' });
                    return [2 /*return*/];
                }
                res.status(200).json({ friend: friend[0] });
                return [2 /*return*/];
            case 3:
                error_6 = _b.sent();
                console.error('Get friend details error:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getFriendDetails = getFriendDetails;
// Search friends by name or email
var searchFriends = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, query, results, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                query = String(req.query.query || '');
                if (!userId || !query.trim()) {
                    res.status(400).json({ error: 'Missing user ID or search query' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.users.id,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                    })
                        .from(schema_1.friends)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.friends.friendId, schema_1.users.id))
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.users.firstname, "%".concat(query, "%")), (0, drizzle_orm_1.like)(schema_1.users.lastname, "%".concat(query, "%")), (0, drizzle_orm_1.like)(schema_1.users.email, "%".concat(query, "%")))))
                        .orderBy(schema_1.users.firstname)];
            case 2:
                results = _b.sent();
                res.status(200).json({ results: results });
                return [2 /*return*/];
            case 3:
                error_7 = _b.sent();
                console.error('Search friends error:', error_7);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.searchFriends = searchFriends;
// Get user status 
var getUserStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, isOnline, lastSeenDate, response;
    return __generator(this, function (_a) {
        userId = Number(req.params.userId);
        if (!userId || isNaN(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return [2 /*return*/];
        }
        isOnline = socket_1.onlineUsers.has(userId);
        lastSeenDate = socket_1.lastSeenMap.get(userId);
        response = {
            userId: userId,
            status: isOnline ? 'online' : 'offline',
            lastSeen: isOnline ? null : (lastSeenDate ? lastSeenDate.toISOString() : null),
        };
        res.status(200).json(response);
        return [2 /*return*/];
    });
}); };
exports.getUserStatus = getUserStatus;
//# sourceMappingURL=friendController.js.map