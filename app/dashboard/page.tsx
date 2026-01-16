"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modelCount, setModelCount] = useState(0);
  const [recentImages, setRecentImages] = useState<string[]>([]); // Galeri Resimleri
  
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // Profil Bilgisi
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profileData);

      // Manken Sayısı
      const { count } = await supabase
        .from("user_models")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id);
      setModelCount(count || 0);

      // --- GALERİ: Son Yüklenen Resimleri Çek (Storage'dan) ---
      // NOT: Gerçek bir üretim tablosu olmadığı için şimdilik 'uploads' klasöründeki son dosyaları listeliyoruz.
      const { data: files } = await supabase.storage.from('uploads').list(session.user.id, {
        limit: 8,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (files) {
         // Dosya isimlerinden public URL oluştur
         const urls = files.map(file => {
            const { data } = supabase.storage.from('uploads').getPublicUrl(`${session.user.id}/${file.name}`);
            return data.publicUrl;
         });
         setRecentImages(urls);
      }

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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
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
          className="bg-gradient-to-br from-[#1a1a1a] to-[#000000] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group cursor-pointer" 
          onClick={() => router.push('/dashboard/profile')}
        >
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">💳</span>
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">MEVCUT BAKİYE</p>
           <div className="flex items-baseline gap-2">
             <span className="text-6xl font-extrabold tracking-tight">{profile?.credits || 0}</span>
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
          className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group cursor-pointer hover:border-blue-200 transition-colors" 
          onClick={() => router.push('/dashboard/my-models')}
        >
           <div className="absolute top-6 right-6 bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
             👤
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">KADRODAKİ MANKENLER</p>
           <div className="text-5xl font-extrabold text-gray-900">{modelCount}</div>
           <p className="text-sm text-gray-500 mt-2">Senin için çalışan dijital modeller.</p>
           <div className="mt-6 text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
             Yenisini Ekle →
           </div>
        </motion.div>

        {/* SON AKTİVİTE */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group cursor-pointer hover:border-purple-200 transition-colors"
        >
           <div className="absolute top-6 right-6 bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
             📸
           </div>
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">GALERİ</p>
           <div className="text-5xl font-extrabold text-gray-900">{recentImages.length}</div>
           <p className="text-sm text-gray-500 mt-2">Son yüklenen dosyalar.</p>
           <div className="mt-6 text-purple-600 text-xs font-bold">
             Tümünü Gör →
           </div>
        </motion.div>
      </motion.div>

      {/* 3. ARAÇLAR GRID */}
      <motion.h2 variants={item} className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        Üretim Araçları
      </motion.h2>
      
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${tool.color}-50 rounded-bl-[2rem] -mr-4 -mt-4 transition-colors group-hover:bg-${tool.color}-100`}></div>
                <div className={`w-14 h-14 bg-${tool.color}-50 text-${tool.color}-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-${tool.color}-600 group-hover:text-white transition-colors relative z-10`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 relative z-10">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">{tool.desc}</p>
              </motion.div>
            </Link>
         ))}
      </motion.div>

      {/* 4. GALERİ (SON ÇEKİMLER) - YENİ EKLENDİ */}
      <motion.div variants={item}>
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
               Son Yüklemeler
            </h2>
            <button className="text-sm font-bold text-gray-400 hover:text-black transition">Daha Fazla →</button>
         </div>

         {recentImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
               {recentImages.map((src, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
                 >
                    <img src={src} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="İndir">⬇️</button>
                       <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Büyüt">🔍</button>
                    </div>
                 </motion.div>
               ))}
            </div>
         ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
               <span className="text-4xl block mb-4 opacity-20">📂</span>
               <h3 className="text-lg font-bold text-gray-900">Henüz Bir Şey Yok</h3>
               <p className="text-gray-500 mb-6">İlk çekimini yapmak için stüdyoya git.</p>
               <Link href="/dashboard/studio" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                  Stüdyoya Git
               </Link>
            </div>
         )}
      </motion.div>

    </motion.div>
  );
}