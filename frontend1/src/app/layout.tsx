// app/layout.tsx
'use client';

import './globals.css';
import Navigation from '@/component/Navigation';
import Signin from '@/component/signin';
import Register from '@/component/register';
import { useState, createContext } from 'react';

type ModalContextType = {
  toggleSignin: () => void;
  toggleRegister: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleSignin = () => setIsSigninOpen(prev => !prev);
  const toggleRegister = () => setRegisterOpen(prev => !prev);
  const handleClick = () => setIsOpen(prev => !prev);

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ModalContext.Provider value={{ toggleSignin, toggleRegister }}>
          <Navigation isOpen={isOpen} handleClick={handleClick} openSignin={toggleSignin} />
          <Signin isOpen={isSigninOpen} onClose={toggleSignin} openRegister={toggleRegister} />
          <Register isOpen={registerOpen} onClose={toggleRegister} openSignin={toggleSignin} />
          <main className="pt-20">{children}</main>
        </ModalContext.Provider>
      </body>
    </html>
  );
}
