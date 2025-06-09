'use client';

import './globals.css';
import { createContext } from 'react';

type ModalContextType = {
 
};

export const ModalContext = createContext<ModalContextType | null>(null);

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ModalContext.Provider value={{  }}>
          {children}
        </ModalContext.Provider>
      </body>
    </html>
  );
}
