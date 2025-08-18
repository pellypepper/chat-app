'use client';
import './globals.css';

import { SocketProvider } from '@/hooks/useSocket';

import { useAuthStore } from '@/store/loginStore';



export default function RootLayout({ children }: { children: React.ReactNode }) {


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