"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]); // Siparişleri tutacak sepet
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      // 1. Kullanıcı Kontrolü
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      // 2. Krediyi Çek
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile) setCredits(profile.credits);

      // 3. GEÇMİŞ SİPARİŞLERİ ÇEK (YENİ KISIM) 🚀
      const { data: generations } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // En yenisi en başta

      if (generations) {
        // Resimlerin tam linkini oluştur
        const ordersWithUrls = generations.map((order: any) => {
           const { data } = supabase.storage.from("uploads").getPublicUrl(order.input_image);
           return { ...order, imageUrl: data.publicUrl };
        });
        setOrders(ordersWithUrls);
      }

      setLoading(false);
    }
    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ÜST MENÜ */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl tracking-tight">Butikmodel<span className="text-blue-600">.ai</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-bold items-center gap-2">
            <span>💎</span> {credits} Kredi
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition">Çıkış</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Başlık */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Atölye</h1>
          <p className="text-gray-500 mt-2">Yeni üretim yap veya geçmiş işlerini kontrol et.</p>
        </div>

        {/* HİZMET KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Link href="/dashboard/model" className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="absolute top-4 right-4"><span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span></div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-2xl">👗</div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600">AI Manken</h3>
            <p className="text-xs text-gray-500 mt-2">Kıyafet giydirme</p>
          </Link>
           {/* Diğer kartlar yer tutucu olarak dursun */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-60"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-2xl">👻</div><h3 className="font-bold text-gray-900">Hayalet Manken</h3><p className="text-xs text-gray-500 mt-2">Yakında</p></div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-60"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-2xl">✍️</div><h3 className="font-bold text-gray-900">Metin Yazarı</h3><p className="text-xs text-gray-500 mt-2">Yakında</p></div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-60"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-2xl">📸</div><h3 className="font-bold text-gray-900">Stüdyo</h3><p className="text-xs text-gray-500 mt-2">Yakında</p></div>
        </div>

        {/* GEÇMİŞ İŞLER LİSTESİ (YENİ) */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📂 Son İşlemler
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{orders.length}</span>
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <span className="text-4xl block mb-4">📭</span>
              <p className="text-gray-500">Henüz hiç sipariş vermediniz.</p>
              <Link href="/dashboard/model" className="text-blue-600 font-bold hover:underline mt-2 inline-block">İlk mankenini oluştur →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
                  {/* Resim Alanı */}
                  <div className="aspect-[3/4] bg-gray-100 relative group">
                    <img src={order.imageUrl} alt="Girdi" className="w-full h-full object-cover" />
                    
                    {/* Durum Etiketi */}
                    <div className="absolute top-2 left-2">
                       {order.status === 'processing' && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> İşleniyor</span>}
                       {order.status === 'completed' && <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">✅ Tamamlandı</span>}
                       {order.status === 'failed' && <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">❌ Hata</span>}
                    </div>
                  </div>
                  
                  {/* Bilgi Alanı */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{new Date(order.created_at).toLocaleDateString("tr-TR")} • {new Date(order.created_at).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-sm font-medium text-gray-900">AI Manken Çekimi</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}