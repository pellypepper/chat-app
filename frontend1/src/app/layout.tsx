'use client';

import './globals.css';
import { createContext, useState, useMemo } from 'react';
import { SocketProvider } from '@/hooks/useSocket';

import { useAuthStore } from '@/store/loginStore';

type ModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

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
          <ModalContext.Provider value={contextValue}>
   
            {/* Render the children components */}
            {children}
          </ModalContext.Provider>
        </SocketProvider>
      </body>
    </html>
  );
}