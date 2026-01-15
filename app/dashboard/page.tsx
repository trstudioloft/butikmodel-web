"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modelCount, setModelCount] = useState(0); // Kaç mankeni var?
  
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      // 1. Kullanıcıyı Al
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // 2. Profil ve Kredi bilgisini çek
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      setProfile(profileData);

      // 3. Kullanıcının kaç mankeni var?
      const { count } = await supabase
        .from("user_models")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id);
      
      setModelCount(count || 0);
      setLoading(false);
    }
    getData();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen font-sans pb-20 max-w-7xl mx-auto">
      
      {/* 1. ÜST BAŞLIK ALANI */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-100">
        <div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">KOMUTA MERKEZİ</span>
           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
             Hoş geldin, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Patron'} 👋
           </h1>
           <p className="text-gray-500 mt-2">Bugün markanı bir üst seviyeye taşımaya hazır mısın?</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
           <div className={`px-4 py-2 rounded-full text-xs font-bold border ${profile?.membership_tier === 'pro' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>
              {profile?.membership_tier === 'pro' ? 'PRO PLAN ⚡️' : 'ÜCRETSİZ PLAN'}
           </div>
           <Link href="/dashboard/profile" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-200">
              Kredi Yükle
           </Link>
        </div>
      </div>

      {/* 2. DURUM KARTLARI (DASHBOARD STATS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* KREDİ KARTI */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#000000] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1" onClick={() => router.push('/dashboard/profile')}>
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">MEVCUT BAKİYE</p>
           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-extrabold tracking-tight">{profile?.credits || 0}</span>
             <span className="text-sm font-medium text-gray-400">Kredi</span>
           </div>
           <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
             <span>Hesap Aktif</span>
           </div>
        </div>

        {/* MANKEN SAYISI */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group cursor-pointer hover:border-blue-200 transition-all" onClick={() => router.push('/dashboard/my-models')}>
           <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
             👤
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">KADRODAKİ MANKENLER</p>
           <div className="text-4xl font-extrabold text-gray-900">{modelCount}</div>
           <p className="text-sm text-gray-500 mt-2">Senin için çalışan dijital modeller.</p>
           <div className="mt-4 text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
             Yenisini Ekle →
           </div>
        </div>

        {/* HIZLI AKSİYON: SONUÇLAR */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group cursor-pointer hover:border-purple-200 transition-all">
           <div className="absolute top-4 right-4 bg-purple-50 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
             🚀
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">SON AKTİVİTE</p>
           <div className="text-4xl font-extrabold text-gray-900">0</div>
           <p className="text-sm text-gray-500 mt-2">Bugün üretilen görsel sayısı.</p>
           <div className="mt-4 text-purple-600 text-xs font-bold">
             Henüz işlem yapılmadı
           </div>
        </div>
      </div>

      {/* 3. HIZLI ERİŞİM ARAÇLARI (TOOLS GRID) */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        Üretim Araçları
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* ARAÇ 1: SANAL STÜDYO */}
         <Link href="/dashboard/studio" className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              📸
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sanal Stüdyo</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Kıyafetleri mankenlere giydir.</p>
         </Link>

         {/* ARAÇ 2: HAYALET MANKEN */}
         <Link href="/dashboard/ghost" className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              👻
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Hayalet Manken</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Mankeni sil, sadece kıyafeti bırak.</p>
         </Link>

         {/* ARAÇ 3: ATMOSFER */}
         <Link href="/dashboard/background" className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              🎨
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Atmosfer</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Dükkan çekimini Paris'e taşı.</p>
         </Link>

         {/* ARAÇ 4: METİN YAZARI */}
         <Link href="/dashboard/copywriter" className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Metin Yazarı</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Instagram için açıklama yazdır.</p>
         </Link>

      </div>

      {/* 4. ALT BİLGİ / SİSTEM DURUMU */}
      <div className="mt-12 bg-gray-50 rounded-xl p-4 flex items-center justify-between text-xs text-gray-500 border border-gray-100">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Yapay Zeka: <strong>Aktif</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Veritabanı: <strong>Bağlı</strong></span>
         </div>
         <div>
            butikmodel.ai <span className="font-bold">v2.0</span>
         </div>
      </div>

    </div>
  );
}