import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Eski kalabalık kodlar yerine sadece bu bileşenleri çağırıyoruz
import Background from "@/components/Background";
import Sidebar from "@/components/Sidebar"; 

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
        {/* 1. ARKA PLAN IŞIKLARI */}
        <Background />

        {/* 2. SOL MENÜ (Artık akıllı dosya buradan çalışacak) */}
        <Sidebar />
        
        {/* 3. ANA İÇERİK (SAĞ TARAF) */}
        <main className="flex-1 relative z-10 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}