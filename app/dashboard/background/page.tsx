"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BackgroundPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [shootMode, setShootMode] = useState<'model' | 'product'>('model');
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files).map(file => URL.createObjectURL(file));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setResults([]);
  };

  const handleProcess = async () => {
    setProcessing(true);
    setStatusMessage("Atmosfer yaratılıyor...");
    setTimeout(() => {
        const demoResults = uploadedFiles.map(() => 
          shootMode === 'model' 
             ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" 
             : "https://images.unsplash.com/photo-1549388604-817d15aa0110?w=600&h=800&fit=crop"
        );
        setResults(demoResults);
        setProcessing(false);
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Atmosfer Sihirbazı 🎨</h1>
        <p className="text-gray-500 mt-2 text-lg">Ürünü istediğin mekana ışınla. Stüdyo, sokak veya uzay.</p>
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
            
            <textarea 
               value={customPrompt}
               onChange={(e) => setCustomPrompt(e.target.value)}
               placeholder={shootMode === 'model' ? "Örn: Lüks bir otel lobisinde..." : "Örn: Mermer masa üzerinde, gün ışığı..."}
               className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm min-h-[140px] focus:ring-2 focus:ring-black outline-none mb-6 resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              {[
                {id: 'stüdyo', name: 'Stüdyo', icon: '📸'},
                {id: 'street', name: 'Sokak', icon: '🏙️'},
                {id: 'cafe', name: 'Cafe', icon: '☕'},
                {id: 'nature', name: 'Doğa', icon: '🌿'},
              ].map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${selectedTheme === theme.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <span>{theme.icon}</span>
                  <span className="text-sm font-bold text-gray-700">{theme.name}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleProcess}
              disabled={uploadedFiles.length === 0 || processing}
              className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Oluşturuluyor..." : "✨ Atmosferi Değiştir"}
            </button>
          </div>
        </div>

        {/* SAĞ: GALERİ (2 Kolon) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 min-h-[600px]">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800 text-lg">
                 {shootMode === 'model' ? "Manken Fotoğrafları" : "Ürün Fotoğrafları"}
               </h3>
               <button onClick={() => {setUploadedFiles([]); setResults([]);}} className="text-xs text-red-500 font-bold hover:underline">Temizle</button>
             </div>
             
             {/* Yükleme Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               <div onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-colors">
                 <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                 <span className="text-3xl text-gray-300 mb-2">+</span>
                 <span className="text-xs font-bold text-gray-400">Yükle</span>
               </div>
               {uploadedFiles.map((src, i) => (
                 <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-gray-100 group">
                   <img src={src} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/10"></div>
                 </div>
               ))}
             </div>

             {/* Sonuçlar */}
             {results.length > 0 && (
               <div className="mt-12 pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-4">
                 <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                   ✅ Sonuçlar
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {results.map((src, i) => (
                     <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105">
                       <img src={src} className="w-full h-full object-cover" />
                       <a href={src} download className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full">⬇️ İndir</span>
                       </a>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}