import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Sidebar from "@/components/Sidebar"; // <-- İŞTE YENİ PARÇA BURADA

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Butikmodel.ai",
  description: "Yapay Zeka Manken Stüdyosu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} relative flex min-h-screen overflow-hidden`}>
        {/* 1. IŞIKLAR (EN ARKADA) */}
        <Background />

        {/* 2. SOL MENÜ (AKILLI BİLEŞEN) */}
        {/* Artık kodlar burada değil, Sidebar.tsx dosyasından geliyor */}
        <Sidebar />
        
        {/* 3. ANA İÇERİK (SAĞ TARAFTAKİ ALAN) */}
        <main className="flex-1 relative z-10 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}