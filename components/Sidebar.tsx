"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Sidebar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);

  // Supabase bağlantısı
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCredits = async () => {
      console.log("🔍 Kredi kontrolü başlıyor...");

      // 1. Oturumu kontrol et
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error("❌ Oturum hatası:", authError.message);
        return;
      }

      if (!session?.user) {
        console.warn("⚠️ Kullanıcı girişi yapılmamış.");
        return;
      }

      console.log("👤 Kullanıcı bulundu:", session.user.id);

      // 2. Veritabanından çek
      const { data, error: dbError } = await supabase
        .from("profiles") // <-- Tablo adın farklı olabilir mi? (users?)
        .select("credits")
        .eq("id", session.user.id)
        .single();

      if (dbError) {
        console.error("❌ Veritabanı hatası:", dbError.message);
        console.log("💡 İPUCU: Tablo adı yanlış olabilir veya RLS (güvenlik) izni eksik olabilir.");
      } else {
        console.log("✅ Kredi bilgisi geldi:", data);
        if (data) setCredits(data.credits);
      }
    };

    fetchCredits();
  }, [supabase]);

  const menuItems = [
    { name: "Ana Panel", href: "/dashboard", icon: "🏠" },
    { name: "AI Manken Stüdyosu", href: "/dashboard/studio", icon: "👗" },
    { name: "Hayalet Manken", href: "/dashboard/ghost", icon: "👻" },
    { name: "Mankenlerim (Yüz)", href: "/dashboard/my-models", icon: "👤" },
    { name: "Ürün Açıklaması", href: "/dashboard/copywriter", icon: "✍️" },
    { name: "Arka Plan", href: "/dashboard/background", icon: "📸" },
    { name: "Ayarlar", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col justify-between p-4 sticky top-0 flex-shrink-0">
      <div>
        <div className="text-2xl font-bold mb-8 px-2 flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded px-2 py-1 text-sm">B</span>
          butikmodel.ai
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="bg-gray-900 rounded-xl p-4 mt-4 border border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Kalan Kredi</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold text-white">
            {credits !== null ? credits : "-"}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors">
            Yükle
          </button>
        </div>
      </div>
    </div>
  );
}