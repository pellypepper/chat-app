'use client';

import Navigation from '@/component/Navigation';


import { useState } from 'react';


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);


 
  const handleClick = () => setIsOpen(prev => !prev);

  return (
    <>
      <Navigation isOpen={isOpen} handleClick={handleClick} />
    

      <main className="pt-20">{children}</main>
    </>
  );
}