"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastSeenMap = exports.onlineUsers = exports.io = void 0;
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
let io;
const onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
const lastSeenMap = new Map();
exports.lastSeenMap = lastSeenMap;
function initializeSocket(server) {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', async (socket) => {
        const rawUserId = socket.handshake.query.userId;
        const userId = rawUserId ? Number(rawUserId) : null;
        if (!userId || isNaN(userId)) {
            socket.disconnect();
            return;
        }
        onlineUsers.set(userId, socket.id);
        socket.join(`user_${userId}`);
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
        socket.on('join_chat', (chatId) => {
            socket.join(`chat_${chatId}`);
        });
        socket.on('leave_chat', (chatId) => {
            socket.leave(`chat_${chatId}`);
        });
        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            lastSeenMap.set(userId, new Date());
            socket.broadcast.emit('user_offline', userId);
        });
    });
    return io;
}
