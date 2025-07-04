import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';


let io: Server;

const onlineUsers = new Map<number, string>();
const lastSeenMap = new Map<number, Date>();

export function initializeSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:8080",
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
    socket.on('join_chat', (chatId: number) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on('leave_chat', (chatId: number) => {
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

export { io, onlineUsers, lastSeenMap };
