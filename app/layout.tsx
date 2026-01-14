import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Arka plan bileşenini içeri çağırıyoruz
import Background from "@/components/Background";

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
      <body className={`${inter.className} relative min-h-screen overflow-x-hidden`}>
        {/* Işıklar burada yanacak */}
        <Background />
        
        {/* Site içeriği bunun üstünde duracak */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}