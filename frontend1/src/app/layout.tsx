'use client';

import './globals.css';
import { useState, createContext } from 'react';

type ModalContextType = {
  toggleSignin: () => void;
  toggleRegister: () => void;
  isSigninOpen: boolean;
  registerOpen: boolean;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleSignin = () => setIsSigninOpen(prev => !prev);
  const toggleRegister = () => setRegisterOpen(prev => !prev);

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ModalContext.Provider value={{ toggleSignin, toggleRegister, isSigninOpen, registerOpen }}>
          {children}
        </ModalContext.Provider>
      </body>
    </html>
  );
}
