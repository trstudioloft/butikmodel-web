import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ButikModel.ai",
  description: "AI Destekli Manken ve Fotoğraf Stüdyosu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* BURADA SIDEBAR ASLA OLMAMALI */}
        {children}
      </body>
    </html>
  );
}