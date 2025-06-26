'use client';

import './globals.css';
import {  useState, useMemo } from 'react';
import { SocketProvider } from '@/hooks/useSocket';

import { useAuthStore } from '@/store/loginStore';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = useMemo(() => ({
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }), [isOpen]);
  const { user } = useAuthStore();
   

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <SocketProvider userId={user?.id}>
      
   
            {/* Render the children components */}
            {children}
   
        </SocketProvider>
      </body>
    </html>
  );
}