"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      
      {/* KARŞILAMA BANNERI */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-3xl md:text-4xl font-bold mb-4">Hoş geldin, Patron 👋</h1>
           <p className="text-blue-100 text-lg max-w-xl">Bugün hangi ürünleri vitrine çıkarmak istersin? Yapay zeka stüdyon emrine amade.</p>
           <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard/model" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
                Hemen Üretim Yap
              </Link>
              <button className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition border border-blue-500">
                Nasıl Çalışır?
              </button>
           </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
           <span className="text-9xl">⚡️</span>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase">Toplam Üretim</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase">Kalan Kredi</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">4</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase">Kayıtlı Yüzler</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase">Paket</p>
            <p className="text-lg font-bold text-gray-900 mt-1">Ücretsiz</p>
         </div>
      </div>

      {/* STÜDYO ARAÇLARI - TÜMÜ AKTİF */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Stüdyo Araçları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. AI MANKEN */}
          <Link href="/dashboard/model" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">👗</div>
             <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">AI Manken</h3>
             <p className="text-gray-500 text-xs mt-2">Kıyafetleri mankenlere giydir.</p>
          </Link>
          
          {/* 2. HAYALET MANKEN */}
          <Link href="/dashboard/ghost" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition cursor-pointer">
             <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">👻</div>
             <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600">Hayalet Manken</h3>
             <p className="text-gray-500 text-xs mt-2">Mankeni fotoğraftan sil.</p>
          </Link>

          {/* 3. METİN YAZARI */}
          <Link href="/dashboard/copywriter" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer">
             <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">✍️</div>
             <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600">Metin Yazarı</h3>
             <p className="text-gray-500 text-xs mt-2">SEO uyumlu açıklama yaz.</p>
          </Link>

          {/* 4. ARKA PLAN STÜDYO (YENİ!) */}
          <Link href="/dashboard/studio" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition cursor-pointer">
             <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">📸</div>
             <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600">AI Stüdyo</h3>
             <p className="text-gray-500 text-xs mt-2">Ürün arkaplanını değiştir.</p>
          </Link>

           {/* 5. KENDİ YÜZÜN */}
          <Link href="/dashboard/my-models" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-500 hover:shadow-lg transition cursor-pointer">
             <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">👤</div>
             <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-600">Kendi Yüzün</h3>
             <p className="text-gray-500 text-xs mt-2">Kendi fotoğrafını manken yap.</p>
          </Link>

      </div>
    </div>
  );
}