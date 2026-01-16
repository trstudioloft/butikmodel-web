"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainModelPage() {
  const [modelName, setModelName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [scanLine, setScanLine] = useState(false); // Tarama animasyonu için
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Tarayıcı efekti tetikleyici
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleTrain = async () => {
    if (!modelName || files.length < 3) {
      alert("Lütfen bir isim girin ve en az 3 fotoğraf yükleyin.");
      return;
    }
    
    setProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. SİMÜLASYON: Yapay Zeka Eğitimi
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 2. Veritabanı Kaydı (Demo)
      const demoCoverUrl = previews[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"; 

      const { error } = await supabase.from("custom_face_models").insert({
        user_id: session.user.id,
        name: modelName,
        cover_image: demoCoverUrl, 
        status: 'ready'
      });

      if (error) throw error;

      router.push("/dashboard/my-models"); 

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-gray-200/50">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase animate-pulse">Laboratuvar Modu</span>
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dijital İkiz 🧬</h1>
           <p className="text-gray-500 mt-2 text-lg">Yüz verilerini yükle, yapay zeka klonunu oluştursun.</p>
        </div>
        <button onClick={() => router.back()} className="mt-4 md:mt-0 text-sm font-bold text-gray-500 hover:text-black transition flex items-center gap-2">
          <span>←</span> Stüdyoya Dön
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: VERİ GİRİŞ TERMİNALİ (8 Birim) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* İSİM GİRİŞİ */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <span className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center text-xs">1</span>
               Kimlik Tanımlama
             </h3>
             <input 
               type="text" 
               value={modelName}
               onChange={(e) => setModelName(e.target.value)}
               placeholder="Modelin Adı (Örn: Burak v1)" 
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black font-bold text-lg placeholder:font-normal transition-all"
             />
          </div>

          {/* TARAYICI ALANI (SCANNER) */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
             <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
               <span className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center text-xs">2</span>
               Biyometrik Veri Girişi
             </h3>

             {/* Yükleme Alanı & Galeri */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {/* Upload Butonu */}
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="aspect-[3/4] border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group relative overflow-hidden"
                >
                   {/* Tarama Çizgisi Animasyonu */}
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent w-full h-[20%] animate-[scan_3s_linear_infinite]"></div>
                   
                   <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                   <span className="text-4xl text-blue-300 group-hover:text-blue-500 transition-colors mb-2">+</span>
                   <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Veri Yükle</span>
                </div>

                {/* Yüklenen Resimler */}
                <AnimatePresence>
                  {previews.map((src, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 relative group"
                    >
                       <img src={src} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">🗑️</button>
                       </div>
                       {/* Köşe İşaretleri (Tech Look) */}
                       <div className="absolute top-2 left-2 w-2 h-2 border-l-2 border-t-2 border-white/50"></div>
                       <div className="absolute top-2 right-2 w-2 h-2 border-r-2 border-t-2 border-white/50"></div>
                       <div className="absolute bottom-2 left-2 w-2 h-2 border-l-2 border-b-2 border-white/50"></div>
                       <div className="absolute bottom-2 right-2 w-2 h-2 border-r-2 border-b-2 border-white/50"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             {/* Alt Bilgi */}
             <div className="mt-6 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                <span>Min: 3 Fotoğraf</span>
                <span>Yüklenen: {files.length} / 15</span>
             </div>
          </div>

          {/* AKSİYON BUTONU */}
          <button 
            onClick={handleTrain}
            disabled={processing || files.length < 3 || !modelName}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {processing ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="animate-pulse">Sinir Ağları Eğitiliyor... (%24)</span>
              </>
            ) : (
              <>
                <span>🚀 Eğitimi Başlat</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded font-normal text-gray-300 group-hover:text-white transition-colors">20 Kredi</span>
              </>
            )}
          </button>

        </div>

        {/* SAĞ: PROTOKOL VE REHBER (4 Birim) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* REHBER KARTI */}
           <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              {/* Arka plan deseni */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[50px] opacity-40"></div>

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                 <span className="text-2xl">📋</span> Tarama Protokolü
              </h3>

              <div className="space-y-6 relative z-10">
                 {[
                   { title: "Çeşitlilik", desc: "Sadece önden değil; yan profil ve boydan fotoğraflar da ekle.", icon: "📐" },
                   { title: "Işıklandırma", desc: "Yüz gölgede kalmamalı. Doğal gün ışığı en iyi veriyi sağlar.", icon: "☀️" },
                   { title: "İzolasyon", desc: "Karede başka insanlar olmamalı. Yapay zeka yüzü karıştırabilir.", icon: "👤" },
                   { title: "Netlik", desc: "Bulanık, filtreli veya pikselli görseller hata oranını artırır.", icon: "🔍" },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg backdrop-blur-sm flex-shrink-0 border border-white/10">
                        {item.icon}
                      </div>
                      <div>
                         <h4 className="font-bold text-sm text-blue-100">{item.title}</h4>
                         <p className="text-xs text-blue-200/70 leading-relaxed mt-1">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* SİSTEM DURUMU (SÜS) */}
           <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Sistem Durumu</h4>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">GPU Kümesi</span>
                    <span className="text-green-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Çevrimiçi</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Tahmini Süre</span>
                    <span className="text-gray-900 font-bold">~25 Dakika</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Model Tipi</span>
                    <span className="text-gray-900 font-bold">Flux LoRA v2</span>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </motion.div>
  );
}