import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

// Outfit fontunu yapılandır
const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'] 
});

// SEO AYARLARI
export const metadata: Metadata = {
  title: {
    template: '%s | ButikModel.com',
    default: 'ButikModel.com | Yapay Zeka Manken & Stüdyo', // Ana Başlık
  },
  description: "Manken ve stüdyo masraflarına son verin. Kıyafetlerinizi yapay zeka ile profesyonel mankenlere giydirin. E-ticaret için satış odaklı görseller üretin.",
  keywords: ["yapay zeka manken", "sanal stüdyo", "e-ticaret fotoğrafçılığı", "ghost manken", "ürün çekimi", "ai model", "moda teknolojisi"],
  authors: [{ name: "ButikModel Team" }],
  creator: "ButikModel",
  publisher: "ButikModel AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://butikmodel.com'), // Gerçek domain buraya
  openGraph: {
    title: 'ButikModel.com | Yapay Zeka Manken Stüdyosu',
    description: 'Kıyafetlerinizi yapay zeka ile profesyonel mankenlere giydirin. Satışlarınızı artırın.',
    url: 'https://butikmodel.com',
    siteName: 'ButikModel.com',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ButikModel.com | Yapay Zeka Manken Stüdyosu',
    description: 'Manken masrafına son verin. Hemen ücretsiz deneyin.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          color="#2563eb"
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