"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
require("./globals.css");
const react_1 = require("react");
const useSocket_1 = require("@/hooks/useSocket");
const loginStore_1 = require("@/store/loginStore");
function RootLayout({ children }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const contextValue = (0, react_1.useMemo)(() => ({
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
    }), [isOpen]);
    const { user } = (0, loginStore_1.useAuthStore)();
    return (<html lang="en" className="scroll-smooth">
      <body>
        <useSocket_1.SocketProvider userId={user?.id}>
      
   
            {/* Render the children components */}
            {children}
   
        </useSocket_1.SocketProvider>
      </body>
    </html>);
}
