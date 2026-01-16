"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BackgroundPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Resim Yönetimi
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // Ekranda görünen
  const [publicUrl, setPublicUrl] = useState<string | null>(null); // API'ye giden
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Ayarlar
  const [shootMode, setShootMode] = useState<'model' | 'product'>('product'); // Varsayılan Ürün olsun
  const [selectedTheme, setSelectedTheme] = useState("stüdyo");
  const [customPrompt, setCustomPrompt] = useState(""); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
    }
    getUser();
  }, [router]);

  // --- 1. RESİM YÜKLEME ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    // Önizleme
    setUploadedImage(URL.createObjectURL(file));
    setResultImage(null);
    setUploading(true);
    setStatusMessage("Görsel buluta yükleniyor...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `bg-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath);

      setPublicUrl(publicUrl);
      setStatusMessage("✅ Görsel Hazır!");

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 2. TEMA SEÇİMİ ---
  const handleThemeSelect = (id: string, name: string) => {
    setSelectedTheme(id);
    // Temayı prompt'a otomatik ekle
    setCustomPrompt(`${name} ortamında, profesyonel ürün fotoğrafçılığı, 8k çözünürlük, sinematik ışık.`);
  };

  // --- 3. MOTORU ÇALIŞTIR ---
  const handleProcess = async () => {
    if (!publicUrl) { alert("Lütfen görselin yüklenmesini bekleyin."); return; }
    
    setProcessing(true);
    setStatusMessage("Atmosfer yaratılıyor...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "background", // API'ye yeni bir görev türü gönderiyoruz
          imageUrl: publicUrl,
          prompt: customPrompt || "Professional studio lighting, minimal background"
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "İşlem başarısız.");

      setResultImage(data.output);
      setStatusMessage("✨ Sahne Hazır!");

    } catch (error: any) {
      alert("Motor Hatası: " + error.message);
      setStatusMessage("❌ Hata oluştu");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      <div className="mb-10 flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Atmosfer Sihirbazı 🎨</h1>
           <p className="text-gray-500 mt-2 text-lg">Ürünü istediğin mekana ışınla. Stüdyo, sokak veya uzay.</p>
        </div>
        {statusMessage && (
           <div className="text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full animate-pulse">
              ℹ️ {statusMessage}
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: AYARLAR */}
        <div className="space-y-6">
          
          {/* MOD SEÇİMİ */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex">
             <button 
               onClick={() => setShootMode('model')}
               className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shootMode === 'model' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               👤 Manken
             </button>
             <button 
               onClick={() => setShootMode('product')}
               className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shootMode === 'product' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               👜 Ürün / Obje
             </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">Mekan Tarifi</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                {id: 'stüdyo', name: 'Stüdyo', icon: '📸', desc: 'Minimalist Stüdyo'},
                {id: 'street', name: 'Sokak', icon: '🏙️', desc: 'Paris Sokakları'},
                {id: 'cafe', name: 'Cafe', icon: '☕', desc: 'Lüks Kafe Masası'},
                {id: 'nature', name: 'Doğa', icon: '🌿', desc: 'Doğal Güneş Işığı'},
              ].map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id, theme.desc)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${selectedTheme === theme.id ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <span>{theme.icon}</span>
                  <span className="text-sm font-bold">{theme.name}</span>
                </button>
              ))}
            </div>

            <textarea 
               value={customPrompt}
               onChange={(e) => setCustomPrompt(e.target.value)}
               placeholder={shootMode === 'model' ? "Örn: Lüks bir otel lobisinde..." : "Örn: Mermer masa üzerinde, gün ışığı..."}
               className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm min-h-[140px] focus:ring-2 focus:ring-black outline-none mb-6 resize-none"
            />

            <button 
              onClick={handleProcess}
              disabled={!uploadedImage || processing || !publicUrl}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                 <>
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                   Oluşturuluyor...
                 </>
              ) : "✨ Atmosferi Değiştir (5 Kredi)"}
            </button>
          </div>
        </div>

        {/* SAĞ: GALERİ / SONUÇ */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 min-h-[600px] flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800 text-lg">
                 Atölye Masası
               </h3>
               {uploadedImage && (
                  <button onClick={() => {setUploadedImage(null); setResultImage(null); setPublicUrl(null);}} className="text-xs text-red-500 font-bold hover:underline">Temizle</button>
               )}
             </div>
             
             <div className="flex-1 flex flex-col gap-8">
                {/* 1. YÜKLEME ALANI */}
                {!uploadedImage ? (
                  <div 
                     onClick={() => !uploading && fileInputRef.current?.click()}
                     className={`flex-1 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${uploading ? 'opacity-50' : ''}`}
                  >
                     <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
                     <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-4">
                        {uploading ? '⏳' : '🎨'}
                     </div>
                     <p className="font-bold text-gray-400">{uploading ? 'Yükleniyor...' : 'Fotoğrafı Buraya Bırak'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                     {/* Orijinal */}
                     <div className="relative rounded-2xl overflow-hidden border border-gray-100 group h-[400px]">
                        <img src={uploadedImage} className="w-full h-full object-contain bg-gray-50" />
                        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">Orijinal</div>
                     </div>

                     {/* Sonuç */}
                     <div className="relative rounded-2xl overflow-hidden border border-green-100 group h-[400px] bg-gray-50 flex items-center justify-center">
                        {resultImage ? (
                           <>
                              <img src={resultImage} className="w-full h-full object-contain" />
                              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">Yeni Atmosfer</div>
                              <a href={resultImage} target="_blank" className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-xl hover:scale-105 transition-transform">
                                 ⬇️ İndir
                              </a>
                           </>
                        ) : (
                           <div className="text-center opacity-40">
                              {processing ? (
                                 <div className="animate-pulse">
                                    <span className="text-4xl">✨</span>
                                    <p className="mt-2 font-bold">Yapay Zeka Çalışıyor...</p>
                                 </div>
                              ) : (
                                 <>
                                    <span className="text-4xl">Waiting...</span>
                                    <p className="mt-2 text-sm">İşlem bekleniyor</p>
                                 </>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}