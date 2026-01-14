"use client";
import { useState } from "react";

export default function MyModelsPage() {
  // Demo veri: Yüklenmiş yüzler
  const [faces, setFaces] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", name: "Profil 1" }
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mankenlerim (Yüzlerim)</h1>
          <p className="text-gray-500">Kendi fotoğraflarınızı yükleyin, kıyafetleri sizin üzerinizde gösterelim.</p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center gap-2">
          <span>+</span> Yeni Yüz Ekle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Yüklenmiş Yüz Kartı */}
        {faces.map((face) => (
          <div key={face.id} className="group relative bg-white rounded-2xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
               <img src={face.url} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button className="text-white text-xs bg-red-600 px-2 py-1 rounded">Sil</button>
               </div>
            </div>
            <p className="text-sm font-bold text-gray-900 text-center">{face.name}</p>
          </div>
        ))}

        {/* Boş Ekleme Kartı */}
        <button className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center aspect-square text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition bg-white">
           <span className="text-4xl mb-2">+</span>
           <span className="text-sm font-bold">Yeni Ekle</span>
        </button>

      </div>

      {/* BİLGİ KUTUSU */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start">
        <div className="text-2xl">💡</div>
        <div>
          <h4 className="font-bold text-blue-900">İyi bir sonuç için ipuçları</h4>
          <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
            <li>Yüzün net göründüğü, aydınlık fotoğraflar kullanın.</li>
            <li>Gözlük veya şapka takmamaya çalışın.</li>
            <li>Doğrudan kameraya baktığınız pozlar en iyi sonucu verir.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}