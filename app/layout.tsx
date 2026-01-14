import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Background bileşenini içe aktar
import Background from "@/components/Background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Butikmodel.ai - Yapay Zeka Manken Stüdyosu",
  description: "E-ticaret fotoğraflarınızı saniyeler içinde profesyonel mankenli çekimlere dönüştürün.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      {/* body'ye 'relative' veriyoruz ki background onun arkasında kalsın */}
      <body className={`${inter.className} h-full relative`}>
        {/* Arka Planı en başa koyuyoruz */}
        <Background />
        
        {/* Diğer tüm içerik bunun üzerine gelecek */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}