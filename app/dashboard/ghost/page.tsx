"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GhostPage() {
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [bgType, setBgType] = useState<'transparent' | 'white'>('white');
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      setResultImage(null);
    }
  };

  const handleProcess = () => {
    if (!uploadedImage) return;
    setLoading(true);
    setTimeout(() => {
      setResultImage("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"); 
      setLoading(false);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-gray-100 pb-6">
        <div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hayalet Manken 👻</h1>
           <p className="text-gray-500 mt-2 text-lg">Mankeni sil, sadece ürünü bırak. E-ticaret için dekupe çözümü.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* SOL: KONTROL */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              
              {!uploadedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-[2rem] p-16 cursor-pointer hover:bg-purple-50/50 hover:border-purple-300 transition-all group"
                >
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <span className="text-4xl">🧥</span>
                   </div>
                   <h3 className="font-bold text-gray-900 text-xl">Fotoğrafı Buraya Bırak</h3>
                   <p className="text-gray-500 mt-2">veya tıklayarak seç</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
                   <img src={uploadedImage} className="w-full h-[500px] object-contain bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-gray-50" />
                   <button 
                     onClick={() => {setUploadedImage(null); setResultImage(null);}}
                     className="absolute top-4 right-4 bg-white/90 text-red-500 p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                   </button>
                </div>
              )}
           </div>

           {uploadedImage && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100"
             >
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Çıktı Ayarları</h3>
                
                <div className="flex gap-4 mb-8">
                   {['white', 'transparent'].map((mode) => (
                     <button 
                       key={mode}
                       onClick={() => setBgType(mode as any)}
                       className={`flex-1 py-6 rounded-2xl border-2 text-sm font-bold flex flex-col items-center gap-3 transition-all ${bgType === mode ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                     >
                        <div className={`w-8 h-8 rounded-full border border-gray-200 ${mode === 'white' ? 'bg-white' : 'bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-50'}`}></div>
                        {mode === 'white' ? 'Beyaz Fon' : 'Şeffaf (PNG)'}
                     </button>
                   ))}
                </div>

                <button 
                  onClick={handleProcess}
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <span>✨ Sihri Başlat</span>
                      <span className="text-xs font-normal opacity-70 bg-white/20 px-2 py-0.5 rounded">1 Kredi</span>
                    </>
                  )}
                </button>
             </motion.div>
           )}
        </div>

        {/* SAĞ: SLIDER SONUÇ */}
        <div className="bg-gray-50 rounded-[3rem] border border-gray-200 p-3 h-full min-h-[600px] flex flex-col">
           {resultImage && uploadedImage ? (
             <div className="relative w-full h-full flex-1 rounded-[2.5rem] overflow-hidden cursor-ew-resize select-none shadow-inner bg-white"
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
                <img src={resultImage} className="absolute inset-0 w-full h-full object-contain p-8" draggable="false" />
                <div className="absolute top-6 right-6 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">SONUÇ</div>

                <div 
                  className="absolute inset-0 w-full h-full border-r-4 border-white bg-gray-100"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                   <img src={uploadedImage} className="absolute inset-0 w-full h-full object-contain p-8" draggable="false" />
                   <div className="absolute top-6 left-6 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">ORİJİNAL</div>
                </div>

                <div 
                  className="absolute inset-y-0 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-400 z-20 top-1/2 -translate-y-1/2 -ml-6 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  ↔
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                   <button className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform text-sm flex items-center gap-2">
                     <span>⬇️</span> İndir (Yüksek Kalite)
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-6xl mb-6 shadow-inner">👻</div>
                <h3 className="text-gray-400 font-bold text-xl">Önizleme Alanı</h3>
                <p className="text-sm mt-3 max-w-xs opacity-70">Sol taraftan fotoğraf yükleyip işlemi başlattığında sonuç burada görünecek.</p>
             </div>
           )}
        </div>

      </div>
    </motion.div>
  );
}