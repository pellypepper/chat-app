'use client';

import Navigation from '@/component/Navigation';
import Signin from '@/component/signin';
import Register from '@/component/register';
import { useState, useContext } from 'react';
import { ModalContext } from '../layout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('PublicLayout must be used within ModalContext');
  }

  const { toggleSignin, toggleRegister, isSigninOpen, registerOpen } = modalContext;
  const handleClick = () => setIsOpen(prev => !prev);

  return (
    <>
      <Navigation isOpen={isOpen} handleClick={handleClick} openSignin={toggleSignin} />
      <Signin isOpen={isSigninOpen} onClose={toggleSignin} openRegister={toggleRegister} />
      <Register isOpen={registerOpen} onClose={toggleRegister} openSignin={toggleSignin} />
      <main className="pt-20">{children}</main>
    </>
  );
}