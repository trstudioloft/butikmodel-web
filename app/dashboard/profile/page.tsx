"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // Profil verisini (Kredi bilgisini) çek
      let { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      
      // Eğer profil yoksa oluştur (Hata önleyici)
      if (!data) {
         const { data: newProfile } = await supabase.from("profiles").insert({ id: session.user.id, credits: 5 }).select().single();
         data = newProfile;
      }
      
      setProfile(data);
      setLoading(false);
    }
    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleBuyCredits = async (amount: number, price: number) => {
    if(!profile) return;
    setPurchasing(true);

    // SİMÜLASYON: Gerçek ödeme sistemi (Iyzico) buraya bağlanacak.
    setTimeout(async () => {
       const newBalance = (profile.credits || 0) + amount;
       
       const { error } = await supabase
         .from("profiles")
         .update({ credits: newBalance })
         .eq("id", user.id);

       if (!error) {
         setProfile({ ...profile, credits: newBalance });
         alert(`🎉 Ödeme Başarılı! ${amount} Kredi hesabına yüklendi.`);
       } else {
         alert("Bir hata oluştu.");
       }
       setPurchasing(false);
    }, 1500);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin text-4xl">🧬</div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-200/50">
        <div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hesap Yönetimi 💳</h1>
           <p className="text-gray-500 mt-2 text-lg">Üyelik durumunu ve bakiyeni yönet.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="mt-4 md:mt-0 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-red-500 hover:bg-red-50 hover:border-red-100 transition shadow-sm"
        >
          Çıkış Yap 🚪
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* SOL KOLON: KİMLİK & CÜZDAN (4 Birim) */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* KİMLİK KARTI (SİYAH) */}
            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/10">
                        {user?.email?.charAt(0).toUpperCase()}
                     </div>
                     <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">PRO ÜYE</span>
                  </div>
                  
                  <div>
                     <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">HESAP SAHİBİ</p>
                     <h3 className="text-xl font-bold truncate">{user?.email}</h3>
                     <p className="text-gray-500 text-sm mt-1">ID: {user?.id?.slice(0, 8)}...</p>
                  </div>
               </div>
            </div>

            {/* CÜZDAN KARTI (BEYAZ) */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">MEVCUT BAKİYE</p>
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">⚡️</div>
               </div>
               <div className="text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                  {profile?.credits}
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '40%' }}></div>
               </div>
               <p className="text-xs text-gray-400">Son yükleme: 2 gün önce</p>
            </div>

            {/* İSTATİSTİK (YENİ) */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                  <p className="text-blue-900 font-bold text-2xl">12</p>
                  <p className="text-blue-600 text-xs font-medium mt-1">Manken Giydirme</p>
               </div>
               <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100">
                  <p className="text-purple-900 font-bold text-2xl">45</p>
                  <p className="text-purple-600 text-xs font-medium mt-1">Metin Yazımı</p>
               </div>
            </div>

         </div>

         {/* SAĞ KOLON: MARKET & AYARLAR (8 Birim) */}
         <div className="lg:col-span-8 space-y-10">
            
            {/* KREDİ MARKETİ */}
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                  Kredi Yükle
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PAKET 1: DENEME */}
                  <button 
                    onClick={() => handleBuyCredits(1000, 1000)}
                    disabled={purchasing}
                    className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-500 hover:ring-4 hover:ring-blue-50 transition-all text-left relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity grayscale group-hover:grayscale-0">
                        <span className="text-6xl">🥉</span>
                     </div>
                     <h4 className="font-bold text-gray-900">Deneme</h4>
                     <div className="text-3xl font-extrabold text-blue-600 mt-2 mb-1">1.000</div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">KREDİ</p>
                     <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900">₺1.000</span>
                        <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">→</span>
                     </div>
                  </button>

                  {/* PAKET 2: BUTİK PRO (POPÜLER) */}
                  <button 
                    onClick={() => handleBuyCredits(6000, 5000)}
                    disabled={purchasing}
                    className="group bg-black text-white p-6 rounded-[2rem] border border-gray-800 hover:shadow-2xl transition-all text-left relative overflow-hidden transform hover:-translate-y-1"
                  >
                     <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full">EN İYİ FİYAT</div>
                     <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-blue-600 rounded-full blur-[50px] opacity-50"></div>
                     
                     <h4 className="font-bold text-gray-300">Butik Pro</h4>
                     <div className="text-3xl font-extrabold text-white mt-2 mb-1">6.000</div>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">KREDİ (+1000 HEDİYE)</p>
                     
                     <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                        <span className="font-bold text-white text-lg">₺5.000</span>
                        <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">→</span>
                     </div>
                  </button>

                  {/* PAKET 3: AJANS */}
                  <button 
                    onClick={() => handleBuyCredits(25000, 20000)}
                    disabled={purchasing}
                    className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-purple-500 hover:ring-4 hover:ring-purple-50 transition-all text-left relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity grayscale group-hover:grayscale-0">
                        <span className="text-6xl">👑</span>
                     </div>
                     <h4 className="font-bold text-gray-900">Ajans</h4>
                     <div className="text-3xl font-extrabold text-purple-600 mt-2 mb-1">25.000</div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">KREDİ (+5000 HEDİYE)</p>
                     <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900">₺20.000</span>
                        <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">→</span>
                     </div>
                  </button>
               </div>
            </div>

            {/* HESAP AYARLARI */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gray-900 rounded-full"></span>
                  Giriş Bilgileri
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-Posta Adresi</label>
                     <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-500">
                        <span className="flex-1 font-medium">{user?.email}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-500">Değiştirilemez</span>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Güvenlik</label>
                     <button className="w-full flex justify-between items-center bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-2xl p-4 transition-all group">
                        <div className="flex items-center gap-3">
                           <span className="text-lg">🔒</span>
                           <span className="font-bold text-gray-900">Şifre Değiştir</span>
                        </div>
                        <span className="text-gray-400 group-hover:text-black">→</span>
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </motion.div>
  );
}