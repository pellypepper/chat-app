// src/util/socket.ts
import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

const onlineUsers = new Map<number, string>();
const lastSeenMap = new Map<number, Date>(); // New map for last seen timestamps

export function initializeSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const rawUserId = socket.handshake.query.userId;
    const userId = rawUserId ? Number(rawUserId) : null;

    if (!userId || isNaN(userId)) {
      socket.disconnect();
      return;
    }

    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    socket.broadcast.emit('user_online', userId);

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      lastSeenMap.set(userId, new Date()); // Store last seen
      socket.broadcast.emit('user_offline', userId);
    });
  });

  return io;
}

export { io, onlineUsers, lastSeenMap };
