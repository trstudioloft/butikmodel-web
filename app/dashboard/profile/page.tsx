"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
      let { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      
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
    // Şimdilik demo olduğu için direkt yüklüyoruz.
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

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-8 min-h-screen pb-20 font-sans max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Hesabım & Kredilerim 💳</h1>
           <p className="text-gray-500 mt-2">{user?.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
        >
          Çıkış Yap 🚪
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {/* CÜZDAN KARTI */}
         <div className="col-span-1 bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <span className="text-9xl">💎</span>
            </div>
            <p className="text-gray-400 font-medium mb-2">Mevcut Bakiyen</p>
            <div className="text-6xl font-extrabold mb-4">{profile?.credits || 0}</div>
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
               1 Kredi = 1 Fotoğraf
            </div>
         </div>

         {/* PAKETLER */}
         <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Başlangıç", credits: 50, price: 499, color: "bg-white border-gray-200" },
              { name: "Butik Pro", credits: 200, price: 999, color: "bg-blue-50 border-blue-200 ring-1 ring-blue-200", badge: "POPÜLER" },
              { name: "Ajans", credits: 1000, price: 2499, color: "bg-white border-gray-200" },
            ].map((pkg, i) => (
               <div key={i} className={`p-6 rounded-2xl border flex flex-col justify-between relative hover:scale-105 transition-transform cursor-pointer ${pkg.color}`}>
                  {pkg.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">{pkg.badge}</span>}
                  
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-3xl font-extrabold my-3 text-gray-900">{pkg.credits}</p>
                    <p className="text-xs text-gray-500">Kredi</p>
                  </div>

                  <button 
                    onClick={() => handleBuyCredits(pkg.credits, pkg.price)}
                    disabled={purchasing}
                    className="w-full mt-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition"
                  >
                    {purchasing ? "..." : `₺${pkg.price} Satın Al`}
                  </button>
               </div>
            ))}
         </div>
      </div>

      {/* AYARLAR ALANI */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
         <h3 className="font-bold text-gray-800 mb-6 pb-4 border-b">Hesap Ayarları</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">E-Posta Adresi</label>
               <input type="text" value={user?.email} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
               <button className="w-full p-3 border border-gray-200 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition flex justify-between items-center">
                  <span>••••••••</span>
                  <span className="text-xs text-blue-600 font-bold">Değiştir</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}