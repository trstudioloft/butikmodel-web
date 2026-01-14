import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
// Yeni oluşturduğumuz Sidebar'ı çağırıyoruz
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
      <body className={`${inter.className} relative min-h-screen flex`}>
        {/* Işıklar En Arkada */}
        <Background />

        {/* Sidebar: Sol Menü */}
        {/* Not: Login sayfasında Sidebar görünmesin istersen buraya ilerde ayar yaparız */}
        <Sidebar />

        {/* Ana İçerik */}
        <div className="flex-1 relative z-10 p-8">
          {children}
        </div>
      </body>
    </html>
  );
}