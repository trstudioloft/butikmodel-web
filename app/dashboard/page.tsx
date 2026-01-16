"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion"; // EKLENDİ

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modelCount, setModelCount] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      setProfile(profileData);

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

  // Animasyon varyasyonları
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Elemanlar sırayla gelsin
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 min-h-screen font-sans pb-20 max-w-7xl mx-auto"
    >
      
      {/* 1. ÜST BAŞLIK */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-100">
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
      </motion.div>

      {/* 2. DURUM KARTLARI */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* KREDİ KARTI */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#000000] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer" 
          onClick={() => router.push('/dashboard/profile')}
        >
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
        </motion.div>

        {/* MANKEN SAYISI */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group cursor-pointer hover:border-blue-200 transition-colors" 
          onClick={() => router.push('/dashboard/my-models')}
        >
           <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
             👤
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">KADRODAKİ MANKENLER</p>
           <div className="text-4xl font-extrabold text-gray-900">{modelCount}</div>
           <p className="text-sm text-gray-500 mt-2">Senin için çalışan dijital modeller.</p>
           <div className="mt-4 text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
             Yenisini Ekle →
           </div>
        </motion.div>

        {/* SONUÇLAR */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group cursor-pointer hover:border-purple-200 transition-colors"
        >
           <div className="absolute top-4 right-4 bg-purple-50 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
             🚀
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">SON AKTİVİTE</p>
           <div className="text-4xl font-extrabold text-gray-900">0</div>
           <p className="text-sm text-gray-500 mt-2">Bugün üretilen görsel sayısı.</p>
           <div className="mt-4 text-purple-600 text-xs font-bold">
             Henüz işlem yapılmadı
           </div>
        </motion.div>
      </motion.div>

      {/* 3. ARAÇLAR GRID */}
      <motion.h2 variants={item} className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        Üretim Araçları
      </motion.h2>
      
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* ARAÇ KARTLARI */}
         {[
           { title: "Sanal Stüdyo", desc: "Kıyafetleri mankenlere giydir.", icon: "📸", color: "blue", link: "/dashboard/studio" },
           { title: "Hayalet Manken", desc: "Mankeni sil, sadece kıyafeti bırak.", icon: "👻", color: "purple", link: "/dashboard/ghost" },
           { title: "Atmosfer", desc: "Dükkan çekimini Paris'e taşı.", icon: "🎨", color: "green", link: "/dashboard/background" },
           { title: "Metin Yazarı", desc: "Instagram için açıklama yazdır.", icon: "✍️", color: "yellow", link: "/dashboard/copywriter" }
         ].map((tool, i) => (
            <Link key={i} href={tool.link}>
              <motion.div 
                whileHover={{ scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full group"
              >
                <div className={`w-14 h-14 bg-${tool.color}-50 text-${tool.color}-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-${tool.color}-600 group-hover:text-white transition-colors`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
              </motion.div>
            </Link>
         ))}

      </motion.div>

      {/* 4. ALT BİLGİ */}
      <motion.div variants={item} className="mt-12 bg-gray-50 rounded-xl p-4 flex items-center justify-between text-xs text-gray-500 border border-gray-100">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Yapay Zeka: <strong>Aktif</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Veritabanı: <strong>Bağlı</strong></span>
         </div>
         <div>
            butikmodel.com <span className="font-bold">v2.0</span>
         </div>
      </motion.div>

    </motion.div>
  );
}