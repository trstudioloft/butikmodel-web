"use client";

import { useState } from "react";

export default function StudioPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);

  // Dosya yükleme simülasyonu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCloth(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="p-8 min-h-screen pb-20">
      {/* BAŞLIK */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Manken Stüdyosu ✨</h1>
        <p className="text-gray-500 mt-2">Kıyafet fotoğrafını yükle, modelini seç, gerisini yapay zekaya bırak.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: YÜKLEME VE SEÇİM (2 birim) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ADIM: Kıyafet Yükleme */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              Kıyafet Fotoğrafı
            </h3>
            
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              {selectedCloth ? (
                <div className="relative h-64 w-full">
                  <img src={selectedCloth} alt="Seçilen Kıyafet" className="h-full w-full object-contain rounded-lg" />
                  <button onClick={(e) => {e.preventDefault(); setSelectedCloth(null)}} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">✕</button>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">👕</div>
                  <p className="text-gray-600 font-medium">Fotoğrafı buraya sürükle veya seç</p>
                  <p className="text-gray-400 text-xs mt-2">JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* 2. ADIM: Manken Seçimi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
              Manken Seçimi
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Statik Mankenler (Görsel) */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedModel(`model-${i}`)}
                  className={`aspect-[3/4] rounded-xl bg-gray-100 cursor-pointer relative overflow-hidden border-2 transition-all group ${selectedModel === `model-${i}` ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-3xl mb-2">👤</span>
                    <span className="text-xs font-medium">Model {i}</span>
                  </div>
                  {/* Seçildi Tik İşareti */}
                  {selectedModel === `model-${i}` && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">✓</div>
                  )}
                </div>
              ))}
              
              {/* Kendi Yüzünü Ekle */}
              <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors">
                <span className="text-3xl mb-1">+</span>
                <span className="text-xs font-medium">Yüz Ekle</span>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: KONTROL PANELİ (1 birim) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Stüdyo Ayarları</h3>
            
            {/* Kategori */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kıyafet Türü</label>
              <div className="grid grid-cols-2 gap-2">
                {['Elbise', 'Üst Giyim', 'Alt Giyim', 'Dış Giyim'].map((type) => (
                  <button key={type} className="border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Detaylar (Opsiyonel)</label>
              <textarea 
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm h-24 resize-none"
                placeholder="Örn: Yazlık keten kumaş, bol kesim, stüdyo ışığı..."
              ></textarea>
            </div>

            {/* Aksiyon */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>İşlem Bedeli:</span>
                <span className="font-bold text-gray-900">1 Kredi</span>
              </div>
              
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                <span>✨</span>
                Manken Üret
              </button>
            </div>
            
          </div>
          
          {/* İpucu Kutusu */}
          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs leading-relaxed">
            💡 <strong>İpucu:</strong> En iyi sonuç için kıyafetin düz bir zeminde veya askıda çekilmiş net bir fotoğrafını yükleyin.
          </div>
        </div>

      </div>
    </div>
  );
}