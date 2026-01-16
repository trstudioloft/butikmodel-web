"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      
      {/* MOBİL SIDEBAR (Drawer) */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Karartma Katmanı */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebarın Kendisi */}
        <div className={`absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* MASAÜSTÜ SIDEBAR (Sabit) */}
      <div className="hidden lg:block w-64 flex-shrink-0">
         <div className="fixed top-0 left-0 h-full w-64">
            <Sidebar />
         </div>
      </div>
      
      {/* İÇERİK ALANI */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
        
        {/* MOBİL HEADER (Sadece küçük ekranda görünür) */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
              <span className="font-bold text-lg">butikmodel.ai</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
           </button>
        </div>

        {/* Sayfa İçeriği */}
        <div className="flex-1 overflow-y-auto">
           {children}
        </div>
      </main>
    </div>
  );
}