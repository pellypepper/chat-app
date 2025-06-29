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
exports.lastSeenMap = exports.onlineUsers = exports.io = void 0;
exports.initializeSocket = initializeSocket;
var socket_io_1 = require("socket.io");
var io;
var onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
var lastSeenMap = new Map();
exports.lastSeenMap = lastSeenMap;
function initializeSocket(server) {
    var _this = this;
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
        var rawUserId, userId;
        return __generator(this, function (_a) {
            rawUserId = socket.handshake.query.userId;
            userId = rawUserId ? Number(rawUserId) : null;
            if (!userId || isNaN(userId)) {
                socket.disconnect();
                return [2 /*return*/];
            }
            onlineUsers.set(userId, socket.id);
            socket.join("user_".concat(userId));
            socket.broadcast.emit('user_online', userId);
            // Optional: Auto-join all chats for this user
            /*
            const userChatsList = await db
              .select()
              .from(userChats)
              .where(eq(userChats.userId, userId));
        
            userChatsList.forEach((uc) => {
              socket.join(`chat_${uc.chatId}`);
            });
            */
            // Custom chat room joining
            socket.on('join_chat', function (chatId) {
                socket.join("chat_".concat(chatId));
            });
            socket.on('leave_chat', function (chatId) {
                socket.leave("chat_".concat(chatId));
            });
            socket.on('disconnect', function () {
                onlineUsers.delete(userId);
                lastSeenMap.set(userId, new Date());
                socket.broadcast.emit('user_offline', userId);
            });
            return [2 /*return*/];
        });
    }); });
    return io;
}
//# sourceMappingURL=socket.js.map