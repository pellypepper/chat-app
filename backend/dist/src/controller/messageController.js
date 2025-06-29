"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatForEveryone = exports.deleteMessageForEveryone = exports.updateGroupChat = exports.sendMessage = exports.createChat = exports.getMessage = exports.getUserChatsSummary = void 0;
var db_1 = require("../util/db");
var schema_1 = require("../model/schema");
var drizzle_orm_1 = require("drizzle-orm");
var socket_1 = require("../util/socket");
var upload_1 = require("../middleware/upload");
var getUserChatsSummary = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userChatsList, chatIds, chatsDetails, lastMessages, lastMessageMap_1, _i, lastMessages_1, msg, allUserChats, chatUsersMap_1, _a, allUserChats_1, uc, chatsSummary, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                return [4 /*yield*/, db_1.db
                        .select({ chatId: schema_1.userChats.chatId })
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId))];
            case 2:
                userChatsList = _c.sent();
                chatIds = userChatsList.map(function (row) { return row.chatId; });
                if (chatIds.length === 0) {
                    return [2 /*return*/, res.status(200).json({ chats: [] })];
                }
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.chats.id,
                        name: schema_1.chats.name,
                        isGroup: schema_1.chats.isGroup,
                    })
                        .from(schema_1.chats)
                        .where((0, drizzle_orm_1.inArray)(schema_1.chats.id, chatIds))];
            case 3:
                chatsDetails = _c.sent();
                return [4 /*yield*/, db_1.db
                        .select({
                        chatId: schema_1.messages.chatId,
                        content: schema_1.messages.content,
                        createdAt: schema_1.messages.createdAt,
                    })
                        .from(schema_1.messages)
                        .where((0, drizzle_orm_1.inArray)(schema_1.messages.chatId, chatIds))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.createdAt))];
            case 4:
                lastMessages = _c.sent();
                lastMessageMap_1 = new Map();
                for (_i = 0, lastMessages_1 = lastMessages; _i < lastMessages_1.length; _i++) {
                    msg = lastMessages_1[_i];
                    if (!lastMessageMap_1.has(msg.chatId) && msg.createdAt) {
                        lastMessageMap_1.set(msg.chatId, { content: msg.content, createdAt: msg.createdAt });
                    }
                }
                return [4 /*yield*/, db_1.db
                        .select({
                        chatId: schema_1.userChats.chatId,
                        userId: schema_1.userChats.userId,
                        userName: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " || ' ' || ", ""], ["", " || ' ' || ", ""])), schema_1.users.firstname, schema_1.users.lastname).as("userName"),
                        profilePicture: schema_1.users.profilePicture,
                    })
                        .from(schema_1.userChats)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.userChats.userId, schema_1.users.id))
                        .where((0, drizzle_orm_1.inArray)(schema_1.userChats.chatId, chatIds))];
            case 5:
                allUserChats = _c.sent();
                chatUsersMap_1 = new Map();
                for (_a = 0, allUserChats_1 = allUserChats; _a < allUserChats_1.length; _a++) {
                    uc = allUserChats_1[_a];
                    if (!chatUsersMap_1.has(uc.chatId)) {
                        chatUsersMap_1.set(uc.chatId, []);
                    }
                    chatUsersMap_1.get(uc.chatId).push({
                        userId: uc.userId,
                        name: uc.userName,
                        profilePicture: uc.profilePicture || undefined,
                    });
                }
                chatsSummary = chatsDetails.map(function (chat) {
                    var participants = chatUsersMap_1.get(chat.id) || [];
                    var displayName = chat.name;
                    if (!chat.isGroup && participants.length > 0) {
                        var otherParticipant = participants.find(function (p) { return p.userId !== userId; });
                        displayName = otherParticipant ? otherParticipant.name : 'Unknown';
                    }
                    var lastMessage = lastMessageMap_1.get(chat.id);
                    return {
                        id: chat.id,
                        name: displayName,
                        isGroup: chat.isGroup,
                        participants: participants.map(function (p) {
                            var isCurrentUser = p.userId === userId;
                            var participantData = {
                                id: p.userId,
                                name: p.name,
                            };
                            // Only include profilePicture if:
                            // 1. It's a 1-on-1 chat
                            // 2. The participant is NOT the current user
                            // 3. The profilePicture exists
                            if (!chat.isGroup && !isCurrentUser && p.profilePicture) {
                                participantData.profilePicture = p.profilePicture;
                            }
                            return participantData;
                        }),
                        lastMessage: (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.content) || null,
                        lastMessageAt: (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.createdAt) || null,
                    };
                });
                chatsSummary.sort(function (a, b) {
                    if (a.lastMessageAt === null && b.lastMessageAt === null)
                        return 0;
                    if (a.lastMessageAt === null)
                        return 1;
                    if (b.lastMessageAt === null)
                        return -1;
                    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
                });
                return [2 /*return*/, res.status(200).json({ chats: chatsSummary })];
            case 6:
                error_1 = _c.sent();
                console.error('Error fetching user chats summary:', error_1);
                return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getUserChatsSummary = getUserChatsSummary;
// Get messages for a user or a specific chat
var getMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, query, userMessages, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                chatId = req.query.chatId ? Number(req.query.chatId) : undefined;
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                query = db_1.db
                    .select({
                    id: schema_1.messages.id,
                    chatId: schema_1.messages.chatId,
                    senderId: schema_1.messages.senderId,
                    content: schema_1.messages.content,
                    contentType: schema_1.messages.type,
                    createdAt: schema_1.messages.createdAt
                })
                    .from(schema_1.messages)
                    .leftJoin(schema_1.messageDeletes, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messageDeletes.messageId, schema_1.messages.id), (0, drizzle_orm_1.eq)(schema_1.messageDeletes.userId, userId)))
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chatId), (0, drizzle_orm_1.isNull)(schema_1.messageDeletes.messageId)))
                    .orderBy(schema_1.messages.createdAt);
                return [4 /*yield*/, query];
            case 2:
                userMessages = _b.sent();
                res.status(200).json({ messages: userMessages });
                return [2 /*return*/];
            case 3:
                error_2 = _b.sent();
                console.error("Error fetching messages:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMessage = getMessage;
// Create a new chat
var createChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUserId, _a, participantIds, name, isGroup, uniqueParticipantIds, participantCount, participantsSorted, userChatsList, userChatIds, possibleChats, _i, possibleChats_1, chat, chatUsers, chatUserIds, participants_1, existingGroupChats, _b, existingGroupChats_1, groupChat, chatUsers, chatUserIds, newChat_1, userChatEntries, participants, error_3;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                currentUserId = Number((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
                _a = req.body, participantIds = _a.participantIds, name = _a.name, isGroup = _a.isGroup;
                if (!currentUserId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                if (!Array.isArray(participantIds) || participantIds.length === 0) {
                    res.status(400).json({ error: 'participantIds must be a non-empty array' });
                    return [2 /*return*/];
                }
                // Ensure current user is included
                if (!participantIds.includes(currentUserId)) {
                    participantIds.push(currentUserId);
                }
                uniqueParticipantIds = __spreadArray([], new Set(participantIds), true);
                participantCount = uniqueParticipantIds.length;
                // Validate inputs
                if (!isGroup && participantCount !== 2) {
                    res.status(400).json({ error: '1-on-1 chat must have exactly one other participant' });
                    return [2 /*return*/];
                }
                if (isGroup && participantCount < 3) {
                    res.status(400).json({ error: 'Group chat must have at least 2 other participants' });
                    return [2 /*return*/];
                }
                if (!isGroup && name) {
                    res.status(400).json({ error: '1-on-1 chats should not have a name' });
                    return [2 /*return*/];
                }
                if (isGroup && !name) {
                    res.status(400).json({ error: 'Group chats must have a name' });
                    return [2 /*return*/];
                }
                participantsSorted = __spreadArray([], uniqueParticipantIds, true).sort();
                _d.label = 1;
            case 1:
                _d.trys.push([1, 17, , 18]);
                if (!!isGroup) return [3 /*break*/, 8];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, currentUserId))];
            case 2:
                userChatsList = _d.sent();
                userChatIds = userChatsList.map(function (uc) { return uc.chatId; });
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.chats)
                        .where((0, drizzle_orm_1.inArray)(schema_1.chats.id, userChatIds))];
            case 3:
                possibleChats = _d.sent();
                _i = 0, possibleChats_1 = possibleChats;
                _d.label = 4;
            case 4:
                if (!(_i < possibleChats_1.length)) return [3 /*break*/, 8];
                chat = possibleChats_1[_i];
                if (chat.isGroup)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id))];
            case 5:
                chatUsers = _d.sent();
                chatUserIds = chatUsers.map(function (cu) { return cu.userId; }).sort();
                if (!(chatUserIds.length === participantsSorted.length &&
                    chatUserIds.every(function (val, idx) { return val === participantsSorted[idx]; }))) return [3 /*break*/, 7];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.inArray)(schema_1.users.id, chatUserIds))];
            case 6:
                participants_1 = _d.sent();
                res.status(200).json({ chat: __assign(__assign({}, chat), { participants: participants_1 }) });
                return [2 /*return*/];
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8:
                if (!isGroup) return [3 /*break*/, 13];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.chats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.chats.isGroup, true), (0, drizzle_orm_1.eq)(schema_1.chats.name, name)))];
            case 9:
                existingGroupChats = _d.sent();
                _b = 0, existingGroupChats_1 = existingGroupChats;
                _d.label = 10;
            case 10:
                if (!(_b < existingGroupChats_1.length)) return [3 /*break*/, 13];
                groupChat = existingGroupChats_1[_b];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, groupChat.id))];
            case 11:
                chatUsers = _d.sent();
                chatUserIds = chatUsers.map(function (cu) { return cu.userId; }).sort();
                if (chatUserIds.length === participantsSorted.length &&
                    chatUserIds.every(function (val, idx) { return val === participantsSorted[idx]; })) {
                    res.status(200).json({ chat: groupChat });
                    return [2 /*return*/];
                }
                _d.label = 12;
            case 12:
                _b++;
                return [3 /*break*/, 10];
            case 13: return [4 /*yield*/, db_1.db
                    .insert(schema_1.chats)
                    .values({
                    name: isGroup ? name : null,
                    isGroup: !!isGroup,
                })
                    .returning()];
            case 14:
                newChat_1 = (_d.sent())[0];
                userChatEntries = uniqueParticipantIds.map(function (userId) { return ({
                    chatId: newChat_1.id,
                    userId: userId,
                }); });
                return [4 /*yield*/, db_1.db.insert(schema_1.userChats).values(userChatEntries)];
            case 15:
                _d.sent();
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.inArray)(schema_1.users.id, uniqueParticipantIds))];
            case 16:
                participants = _d.sent();
                // ✅ Emit via socket.io
                uniqueParticipantIds.forEach(function (id) {
                    socket_1.io.to("user_".concat(id)).emit('chat_created', { chat: newChat_1 });
                });
                res.status(201).json({ chat: __assign(__assign({}, newChat_1), { participants: participants }) });
                return [3 /*break*/, 18];
            case 17:
                error_3 = _d.sent();
                console.error('Create chat error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.createChat = createChat;
// Send a message 
var sendMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var senderId, _a, chatId, content, userChat, messageContent, messageType, newMessage, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                senderId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                _a = req.body, chatId = _a.chatId, content = _a.content;
                if (!senderId || !chatId) {
                    res.status(400).json({ error: "Missing required fields" });
                    return [2 /*return*/];
                }
                //check if text or file  exists
                if (!content && !req.file) {
                    res.status(400).json({ error: "Either content or image file must be provided" });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, senderId)))];
            case 2:
                userChat = _c.sent();
                if (!userChat.length) {
                    res.status(403).json({ error: "You are not a participant of this chat" });
                    return [2 /*return*/];
                }
                messageContent = content;
                messageType = 'text';
                if (!req.file) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, upload_1.compressAndUpload)(req.file)];
            case 3:
                messageContent = _c.sent();
                messageType = 'image';
                _c.label = 4;
            case 4: return [4 /*yield*/, db_1.db
                    .insert(schema_1.messages)
                    .values({
                    chatId: chatId,
                    senderId: senderId,
                    content: messageContent,
                    type: messageType,
                })
                    .returning()];
            case 5:
                newMessage = (_c.sent())[0];
                // Emit to socket.io clients
                socket_1.io.to("chat_".concat(chatId)).emit('new_message', {
                    message: newMessage,
                });
                res.status(201).json({ message: newMessage });
                return [3 /*break*/, 7];
            case 6:
                error_4 = _c.sent();
                console.error("Send message error:", error_4);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
var updateGroupChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, _a, name, _b, addUserIds, _c, removeUserIds, chat, isParticipant, existingUsers, existingIds_1, newUserIds, newLinks, currentParticipants, remaining, error_5;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                userId = Number((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
                chatId = Number(req.params.chatId);
                _a = req.body, name = _a.name, _b = _a.addUserIds, addUserIds = _b === void 0 ? [] : _b, _c = _a.removeUserIds, removeUserIds = _c === void 0 ? [] : _c;
                if (!userId || !chatId) {
                    res.status(400).json({ error: 'Missing user or chat ID' });
                    return [2 /*return*/];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 12, , 13]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.chats)
                        .where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId))];
            case 2:
                chat = (_e.sent())[0];
                if (!chat) {
                    res.status(404).json({ error: 'Chat not found' });
                    return [2 /*return*/];
                }
                if (!chat.isGroup) {
                    res.status(400).json({ error: 'Only group chats can be updated' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId)))];
            case 3:
                isParticipant = (_e.sent())[0];
                if (!isParticipant) {
                    res.status(403).json({ error: 'You are not a participant of this chat' });
                    return [2 /*return*/];
                }
                if (!(name && name !== chat.name)) return [3 /*break*/, 5];
                return [4 /*yield*/, db_1.db.update(schema_1.chats).set({ name: name }).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId))];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                if (!(Array.isArray(addUserIds) && addUserIds.length > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, db_1.db
                        .select({ userId: schema_1.userChats.userId })
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId))];
            case 6:
                existingUsers = _e.sent();
                existingIds_1 = new Set(existingUsers.map(function (u) { return u.userId; }));
                newUserIds = addUserIds.filter(function (id) { return !existingIds_1.has(id); });
                newLinks = newUserIds.map(function (userId) { return ({
                    chatId: chatId,
                    userId: userId
                }); });
                if (!(newLinks.length > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, db_1.db.insert(schema_1.userChats).values(newLinks)];
            case 7:
                _e.sent();
                // Notify new users
                newUserIds.forEach(function (id) {
                    socket_1.io.to("user_".concat(id)).emit('added_to_chat', { chatId: chatId });
                });
                _e.label = 8;
            case 8:
                if (!(Array.isArray(removeUserIds) && removeUserIds.length > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId))];
            case 9:
                currentParticipants = _e.sent();
                remaining = currentParticipants.filter(function (p) { return !removeUserIds.includes(p.userId); });
                if (remaining.length < 2) {
                    res.status(400).json({ error: 'Cannot remove all participants from group chat' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .delete(schema_1.userChats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.inArray)(schema_1.userChats.userId, removeUserIds)))];
            case 10:
                _e.sent();
                // Notify removed users
                removeUserIds.forEach(function (id) {
                    socket_1.io.to("user_".concat(id)).emit('removed_from_chat', { chatId: chatId });
                });
                _e.label = 11;
            case 11:
                res.status(200).json({ message: 'Group chat updated successfully' });
                return [3 /*break*/, 13];
            case 12:
                error_5 = _e.sent();
                console.error('Update group chat error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updateGroupChat = updateGroupChat;
var deleteMessageForEveryone = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, messageId, msg, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                messageId = Number(req.params.messageId);
                if (!userId || !messageId) {
                    res.status(400).json({ error: 'Missing user or message ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.id, messageId))];
            case 2:
                msg = (_b.sent())[0];
                if (!msg) {
                    res.status(404).json({ error: 'Message not found' });
                    return [2 /*return*/];
                }
                // delete message if the user is the sender
                if (msg.senderId !== userId) {
                    res.status(403).json({ error: 'Only the sender can delete this message for everyone' });
                    return [2 /*return*/];
                }
                // Delete the message for all users
                return [4 /*yield*/, db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.id, messageId))];
            case 3:
                // Delete the message for all users
                _b.sent();
                // Notify all chat participants (using socket.io)
                socket_1.io.to("chat_".concat(msg.chatId)).emit('message_deleted_for_everyone', { messageId: messageId });
                res.status(200).json({ message: 'Message deleted for everyone' });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _b.sent();
                console.error('Delete message for everyone error:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteMessageForEveryone = deleteMessageForEveryone;
// delete a message for everyone
var deleteChatForEveryone = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, isParticipant, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                chatId = Number(req.params.chatId);
                if (!userId || !chatId) {
                    res.status(400).json({ error: 'Missing user or chat ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userChats)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId)))];
            case 2:
                isParticipant = _b.sent();
                if (!isParticipant.length) {
                    res.status(403).json({ error: 'You are not a participant of this chat' });
                    return [2 /*return*/];
                }
                // Delete messages
                return [4 /*yield*/, db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chatId))];
            case 3:
                // Delete messages
                _b.sent();
                // Delete user-chat relations
                return [4 /*yield*/, db_1.db.delete(schema_1.userChats).where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId))];
            case 4:
                // Delete user-chat relations
                _b.sent();
                // Delete chat itself
                return [4 /*yield*/, db_1.db.delete(schema_1.chats).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId))];
            case 5:
                // Delete chat itself
                _b.sent();
                // Emit to socket.io clients
                socket_1.io.to("chat_".concat(chatId)).emit('chat_deleted', { chatId: chatId });
                res.status(200).json({ message: 'Chat deleted for all users' });
                return [2 /*return*/];
            case 6:
                error_7 = _b.sent();
                console.error('Delete chat error:', error_7);
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteChatForEveryone = deleteChatForEveryone;
var templateObject_1;
//# sourceMappingURL=messageController.js.map