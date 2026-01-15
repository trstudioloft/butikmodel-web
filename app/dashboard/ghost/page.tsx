"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function GhostPage() {
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Ayarlar
  const [bgType, setBgType] = useState<'transparent' | 'white'>('white');
  const [sliderPosition, setSliderPosition] = useState(50); // Karşılaştırma çizgisi
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      setResultImage(null); // Yeni resim gelince sonucu sıfırla
    }
  };

  const handleProcess = () => {
    if (!uploadedImage) return;
    setLoading(true);

    // SİMÜLASYON: Gerçek API bağlanınca burası değişecek
    setTimeout(() => {
      // Demo olarak aynı resmi döndürüyoruz ama gerçekte dekupe edilmiş hali gelecek
      // Burada görsel efekti göstermek için Unsplash'ten 'ceket' görseli kullanıyorum
      setResultImage("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"); 
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="p-8 min-h-screen font-sans pb-20 max-w-7xl mx-auto">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-100 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Hayalet Manken 👻</h1>
           <p className="text-gray-500 mt-2">Mankeni fotoğraftan sil, e-ticaret için tertemiz ürün görseli al.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
           <span className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full uppercase tracking-wider">
             MOD: {bgType === 'white' ? 'BEYAZ FON (Trendyol)' : 'ŞEFFAF (PNG)'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* SOL: YÜKLEME VE AYARLAR */}
        <div className="space-y-8">
           
           {/* 1. FOTOĞRAF YÜKLEME */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              {!uploadedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-12 cursor-pointer hover:bg-gray-50 hover:border-black transition-all group"
                >
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">🧥</span>
                   <h3 className="font-bold text-gray-900 text-lg">Mankenli Fotoğrafı Yükle</h3>
                   <p className="text-gray-500 text-sm mt-2">JPEG veya PNG. Maksimum 5MB.</p>
                   <button className="mt-6 bg-black text-white px-6 py-2 rounded-full text-sm font-bold group-hover:bg-gray-800">
                     Fotoğraf Seç
                   </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                   <img src={uploadedImage} className="w-full h-[400px] object-contain bg-gray-50" />
                   <button 
                     onClick={() => {setUploadedImage(null); setResultImage(null);}}
                     className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </div>
              )}
           </div>

           {/* 2. AYARLAR & İŞLEM */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Çıktı Ayarları</h3>
              
              <div className="flex gap-4 mb-8">
                 <button 
                   onClick={() => setBgType('white')}
                   className={`flex-1 py-4 px-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-2 transition-all ${bgType === 'white' ? 'border-black bg-gray-50 text-black' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                 >
                    <div className="w-6 h-6 bg-white border border-gray-200 rounded-full"></div>
                    Beyaz Arkaplan
                 </button>
                 <button 
                   onClick={() => setBgType('transparent')}
                   className={`flex-1 py-4 px-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-2 transition-all ${bgType === 'transparent' ? 'border-black bg-gray-50 text-black' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                 >
                    <div className="w-6 h-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] border border-gray-200 rounded-full opacity-50"></div>
                    Şeffaf (PNG)
                 </button>
              </div>

              <button 
                onClick={handleProcess}
                disabled={!uploadedImage || loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Manken Siliniyor...
                  </>
                ) : (
                  <>
                    <span>✨ Sihri Uygula (1 Kredi)</span>
                  </>
                )}
              </button>
           </div>
        </div>

        {/* SAĞ: SONUÇ GÖRÜNTÜLEME (SLIDER) */}
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-2 flex flex-col h-full min-h-[500px]">
           {resultImage && uploadedImage ? (
             <div className="relative w-full h-full flex-1 rounded-2xl overflow-hidden cursor-ew-resize select-none"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setSliderPosition((x / rect.width) * 100);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    setSliderPosition((x / rect.width) * 100);
                  }}
             >
                {/* ALT KATMAN (SONUÇ) */}
                <img src={resultImage} className="absolute inset-0 w-full h-full object-contain bg-white" draggable="false" />
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg z-10">SONUÇ</div>

                {/* ÜST KATMAN (ORİJİNAL) - Clip Path ile maskelenir */}
                <div 
                  className="absolute inset-0 w-full h-full border-r-2 border-white bg-gray-100"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                   <img src={uploadedImage} className="absolute inset-0 w-full h-full object-contain" draggable="false" />
                   <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-md">ORİJİNAL</div>
                </div>

                {/* SÜRÜKLEME ÇUBUĞU */}
                <div 
                  className="absolute inset-y-0 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 z-20 top-1/2 -translate-y-1/2 -ml-4 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  ↔
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                   <button className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl hover:scale-105 transition-transform text-sm">
                     ⬇️ İndir (HD)
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-4">👻</div>
                <h3 className="text-gray-900 font-bold text-lg">Önizleme Alanı</h3>
                <p className="text-sm mt-2 max-w-xs">Sol taraftan fotoğraf yükleyip işlemi başlattığında sonuç burada görünecek.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}