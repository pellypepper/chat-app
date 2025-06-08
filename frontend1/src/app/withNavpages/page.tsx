// Home.tsx - Fixed version with debugging
'use client';

import { useContext } from "react";
import { ModalContext } from "../layout"; // Adjust the path if needed

import Feature from "@/component/feature";
import Content from "@/component/content";
import Started from "@/component/started";
import Footer from "@/component/footer";


export default function Home() {
 
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    // Optionally handle the case where context is not available
    return null;
  }

  const { toggleRegister } = modalContext;

  
  return (
    <main>

    
      <Content openRegister={toggleRegister} />
      <Feature />
      <Started />
      <Footer />
    </main>
  );
}