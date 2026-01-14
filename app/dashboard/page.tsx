"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      // 1. Kullanıcı var mı kontrol et
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Kullanıcı yoksa login sayfasına at
        router.push("/login");
        return;
      }

      setUser(user);

      // 2. Kredilerini veritabanından çek
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (profile) {
        setCredits(profile.credits);
      }
      
      setLoading(false);
    }

    getData();
  }, [router]);

  // Çıkış Yapma Fonksiyonu
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ÜST MENÜ */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl">Butikmodel Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            💰 {credits} Kredi
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black">
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* ANA İÇERİK */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Başlık Alanı */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hoş geldin, Patron 👋</h1>
          <p className="text-gray-500">Buradan yeni model oluşturabilir ve geçmiş işlerini görebilirsin.</p>
        </div>

        {/* Butonlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yeni Model Oluştur Kartı */}
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center hover:border-blue-500 transition cursor-pointer group">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
              <span className="text-3xl text-blue-600 group-hover:text-white transition">+</span>
            </div>
            <h3 className="font-bold text-lg">Yeni Fotoğraf Yükle</h3>
            <p className="text-sm text-gray-400 mt-2">1 Kredi düşer</p>
          </div>

          {/* Geçmiş İşler (Demo) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-50">
            <h3 className="font-bold text-gray-400">Geçmiş Çekimler</h3>
            <p className="text-sm text-gray-400 mt-2">Henüz fotoğraf yok.</p>
          </div>
        </div>
      </main>
    </div>
  );
}