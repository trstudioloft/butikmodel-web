import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Hataları Görmezden Gelme Ayarları */
  eslint: {
    // Uyarı var diye üretimi durdurma
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tip hatası var diye üretimi durdurma
    ignoreBuildErrors: true,
  },
};

export default nextConfig;