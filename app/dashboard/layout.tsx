"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]"> 
      {/* Sidebar Sabit */}
      <Sidebar />
      
      {/* İçerik Alanı */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Dekoratif Arkaplan Işığı (Çok hafif mavi hare) */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
        
        {children}
      </main>
    </div>
  );
}