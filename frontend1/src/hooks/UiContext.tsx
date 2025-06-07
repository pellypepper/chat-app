// context/UIContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
  isSigninOpen: boolean;
  isRegisterOpen: boolean;
    isOpen?: boolean; // Optional for handling the menu toggle
  toggleSignin: () => void;
  toggleRegister: () => void;
  handleClick?: () => void; // Optional for handling clicks
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const toggleSignin = () => setSigninOpen((prev) => !prev);
  const toggleRegister = () => setRegisterOpen((prev) => !prev);

  const handleClick = () => {

    setIsOpen(!isOpen);
  };

  return (
    <UIContext.Provider
      value={{ isSigninOpen, isRegisterOpen, toggleSignin, toggleRegister , handleClick, isOpen }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
