"use strict";
"use client";
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
exports.SocketProvider = exports.useSocketContext = void 0;
const react_1 = __importStar(require("react"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const SOCKET_URL = "http://localhost:4000";
const SocketContext = (0, react_1.createContext)({ socket: null, socketConnected: false });
const useSocketContext = () => (0, react_1.useContext)(SocketContext);
exports.useSocketContext = useSocketContext;
const SocketProvider = ({ userId, children }) => {
    const [socketConnected, setSocketConnected] = (0, react_1.useState)(false);
    const socketRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!userId)
            return;
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        socketRef.current = (0, socket_io_client_1.default)(SOCKET_URL, {
            query: { userId: userId.toString() },
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
        });
        socketRef.current.on("connect", () => setSocketConnected(true));
        socketRef.current.on("disconnect", () => setSocketConnected(false));
        socketRef.current.on("connect_error", () => setSocketConnected(false));
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);
    return (<SocketContext.Provider value={{ socket: socketRef.current, socketConnected }}>
      {children}
    </SocketContext.Provider>);
};
exports.SocketProvider = SocketProvider;
