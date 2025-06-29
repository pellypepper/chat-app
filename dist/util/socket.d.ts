import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
declare let io: Server;
declare const onlineUsers: Map<number, string>;
declare const lastSeenMap: Map<number, Date>;
export declare function initializeSocket(server: HTTPServer): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export { io, onlineUsers, lastSeenMap };
