import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Inter yerine Outfit
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

// Outfit fontunu yapılandır
const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'] 
});

export const metadata: Metadata = {
  title: "ButikModel.com | Yapay Zeka Stüdyosu",
  description: "Manken masrafına son verin. Yapay zeka destekli ürün fotoğrafçılığı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${outfit.className} antialiased`}>
        <NextTopLoader 
          color="#2563eb" // Siyah yerine "Royal Blue" daha teknolojik durur
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        {children}
      </body>
    </html>
  );
}