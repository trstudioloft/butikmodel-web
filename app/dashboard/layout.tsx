"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Ana Panel', href: '/dashboard', icon: '🏠' },
    { name: 'AI Manken Stüdyosu', href: '/dashboard/model', icon: '👗' },
    { name: 'Hayalet Manken', href: '/dashboard/ghost', icon: '👻' }, // YENİ EKLENDİ
    { name: 'Mankenlerim (Yüz)', href: '/dashboard/my-models', icon: '👤' },
    { name: 'Ürün Açıklaması', href: '/dashboard/copywriter', icon: '✍️' },
    { name: 'Arka Plan', href: '/dashboard/studio', icon: '📸' },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SOL SIDEBAR (Masaüstü) */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white min-h-screen fixed left-0 top-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
           <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold mr-3">B</div>
           <span className="font-bold text-lg tracking-wide">butikmodel<span className="text-blue-500">.ai</span></span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-900 rounded-xl p-4">
             <p className="text-xs text-gray-500 mb-1">Kalan Kredi</p>
             <div className="flex items-center justify-between">
                <span className="font-bold text-white text-lg">---</span>
                <button className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-500">Yükle</button>
             </div>
          </div>
        </div>
      </aside>

      {/* MOBİL MENÜ BUTONU */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black text-white z-50 px-4 py-3 flex justify-between items-center">
         <span className="font-bold">butikmodel.ai</span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
      </div>

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 mt-12 md:mt-0 transition-all">
        {children}
      </div>

    </div>
  );
}