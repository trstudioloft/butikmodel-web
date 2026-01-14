"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Supabase bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    credits: "...", // Yükleniyor...
    faces: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Krediyi Çek
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", session.user.id)
          .single();
        
        // Veriyi state'e aktar
        if (profile) {
          setStats(prev => ({ ...prev, credits: profile.credits }));
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      {/* 1. ÜST MAVİ ALAN */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hoş geldin, Patron 👋</h1>
          <p className="text-blue-100 mb-6 max-w-xl">
            Bugün hangi ürünleri vitrine çıkarmak istersin? Yapay zeka stüdyon emrine amade.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/studio" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Hemen Üretim Yap
            </Link>
            <button className="bg-blue-800/50 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Nasıl Çalışır?
            </button>
          </div>
        </div>
      </div>

      {/* 2. İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase mb-2">TOPLAM ÜRETİM</div>
          <div className="text-3xl font-bold text-gray-800">12</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-blue-500 text-xs font-bold uppercase mb-2">KALAN KREDİ</div>
          <div className="text-3xl font-bold text-blue-600">{stats.credits}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase mb-2">KAYITLI YÜZLER</div>
          <div className="text-3xl font-bold text-gray-800">1</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase mb-2">PAKET</div>
          <div className="text-3xl font-bold text-gray-800">Ücretsiz</div>
        </div>
      </div>

      {/* 3. STÜDYO ARAÇLARI */}
      <h2 className="text-xl font-bold mb-6 text-gray-800">Stüdyo Araçları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* AI Manken */}
        <Link href="/dashboard/studio" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">👗</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">AI Manken</h3>
          <p className="text-gray-500 text-sm mt-2">Kıyafetleri mankenlere giydir.</p>
        </Link>

        {/* Hayalet Manken */}
        <Link href="/dashboard/ghost" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">👻</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Hayalet Manken</h3>
          <p className="text-gray-500 text-sm mt-2">Mankeni fotoğraftan sil.</p>
        </Link>

        {/* Metin Yazarı */}
        <Link href="/dashboard/copywriter" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Metin Yazarı</h3>
          <p className="text-gray-500 text-sm mt-2">SEO uyumlu açıklama yaz.</p>
        </Link>

        {/* AI Stüdyo */}
        <Link href="/dashboard/background" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">AI Stüdyo</h3>
          <p className="text-gray-500 text-sm mt-2">Ürün arka planını değiştir.</p>
        </Link>

        {/* Kendi Yüzün */}
        <Link href="/dashboard/my-models" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Kendi Yüzün</h3>
          <p className="text-gray-500 text-sm mt-2">Kendi fotoğrafını manken yap.</p>
        </Link>

      </div>
    </div>
  );
}