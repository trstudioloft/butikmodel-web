"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BackgroundPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Dosya Yönetimi
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  
  // Ayarlar
  const [shootMode, setShootMode] = useState<'model' | 'product'>('model'); // YENİ: İnsan mı Nesne mi?
  const [selectedTheme, setSelectedTheme] = useState("stüdyo");
  const [customPrompt, setCustomPrompt] = useState(""); 
  const [consistencyMode, setConsistencyMode] = useState(true);
  
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
    if (uploadedFiles.length + newFiles.length > 5) {
      alert("Maksimum 5 fotoğraf yükleyebilirsiniz.");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setResults([]);
  };

  const handleThemeSelect = (id: string) => {
    setSelectedTheme(id);
    if (id !== 'custom') setCustomPrompt(""); 
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 || !user) return;
    setProcessing(true);
    setStatusMessage("Fotoğraftaki kişi analiz ediliyor...");

    try {
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      const requiredCredits = uploadedFiles.length; 

      if (profile && profile.credits < requiredCredits) {
        alert(`Yetersiz Kredi! Bu işlem için ${requiredCredits} kredi lazım.`);
        setProcessing(false);
        return;
      }

      // AKILLI PROMPT MANTIĞI 🧠
      // Mod 'model' ise: "Fashion photography of a model..."
      // Mod 'product' ise: "Product photography of an object..."
      
      const subject = shootMode === 'model' ? "fashion model wearing the clothes" : "product object";
      const basePrompt = customPrompt.trim().length > 0 
        ? customPrompt 
        : `Professional ${selectedTheme} background`;

      const finalPrompt = `High quality photography of a ${subject}. Background: ${basePrompt}. Keep the subject exactly as is, change background only.`;

      console.log("🚀 Yapay Zeka Emri:", finalPrompt);

      setTimeout(() => setStatusMessage(consistencyMode ? "Tüm pozlar aynı mekana taşınıyor..." : "Mekan değiştiriliyor..."), 1500);
      
      setTimeout(async () => {
        if (profile) {
            await supabase.from("profiles").update({ credits: profile.credits - requiredCredits }).eq("id", user.id);
        }
        
        // Demo Sonuçlar (İnsanlı moda çekimi örnekleri)
        const demoResults = uploadedFiles.map(() => 
          shootMode === 'model' 
             ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" // Model Örneği
             : "https://images.unsplash.com/photo-1549388604-817d15aa0110?w=600&h=800&fit=crop" // Ürün Örneği
        );
        
        setResults(demoResults);
        setStatusMessage(`✅ İşlem Tamamlandı!`);
        setProcessing(false);
      }, 4000);

    } catch (error) {
      alert("Hata oluştu.");
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 min-h-screen font-sans pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Atmosfer Sihirbazı 🎨</h1>
        <p className="text-gray-500 mt-2">Kıyafeti giy, fotoğrafını çek, arka planı saniyeler içinde değiştir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: AYARLAR */}
        <div className="space-y-6">
          
          {/* 0. ÇEKİM MODU (YENİ) */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex p-1 gap-1">
             <button 
               onClick={() => setShootMode('model')}
               className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shootMode === 'model' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               👤 Manken / İnsan
             </button>
             <button 
               onClick={() => setShootMode('product')}
               className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shootMode === 'product' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               👜 Sadece Ürün
             </button>
          </div>

          {/* 1. MEKAN SEÇİMİ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Mekan & Atmosfer</h3>
            
            {/* Özel Prompt */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                  {shootMode === 'model' ? "Özel Sahne Tarifi" : "Ürün Sahne Tarifi"}
                </label>
                <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={shootMode === 'model' 
                      ? "Örn: Paris sokaklarında yürürken, arkada flu mağazalar, güneşli bir gün..." 
                      : "Örn: Mermer bir masa üzerinde, yanında kuru çiçekler, minimalist ortam..."}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-black focus:border-transparent outline-none shadow-sm"
                />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">VEYA HAZIR SEÇ</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                {id: 'stüdyo', name: 'Minimal Stüdyo (Gri/Beyaz)', icon: '📸'},
                {id: 'street', name: 'Şehir & Sokak Modası', icon: '🏙️'},
                {id: 'cafe', name: 'Butik Cafe Ortamı', icon: '☕'},
                {id: 'luxury', name: 'Lüks Mağaza İçi', icon: '✨'},
                {id: 'nature', name: 'Doğa & Gün Işığı', icon: '🌿'},
              ].map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${selectedTheme === theme.id && customPrompt === "" ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <span className="text-xl">{theme.icon}</span>
                  <span className="font-medium text-sm text-gray-700">{theme.name}</span>
                  {selectedTheme === theme.id && customPrompt === "" && <span className="ml-auto text-green-600 font-bold text-xs">SEÇİLDİ</span>}
                </div>
              ))}
            </div>
          </div>

          {/* İşlem Butonu */}
          <button 
            onClick={handleProcess}
            disabled={uploadedFiles.length === 0 || processing}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex flex-col items-center justify-center"
          >
            {processing ? (
                <span>Sihir Uygulanıyor...</span>
            ) : (
                <>
                    <span>✨ {shootMode === 'model' ? "Mankeni Işınla" : "Arkaplanı Değiştir"}</span>
                    <span className="text-[10px] opacity-70 font-normal mt-1">{uploadedFiles.length || 0} Fotoğraf = {uploadedFiles.length || 0} Kredi</span>
                </>
            )}
          </button>

        </div>

        {/* SAĞ: GALERİ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">
                 {shootMode === 'model' ? "Manken Fotoğrafları" : "Ürün Fotoğrafları"} ({uploadedFiles.length}/5)
               </h3>
               <button onClick={() => {setUploadedFiles([]); setResults([]);}} className="text-xs text-red-500 hover:underline font-medium">Temizle</button>
             </div>
             
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
               {uploadedFiles.length < 5 && (
                 <div onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-colors group">
                   <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   <span className="text-2xl text-gray-400 group-hover:scale-110 transition-transform">+</span>
                   <span className="text-xs text-gray-500 font-bold mt-1">Yükle</span>
                 </div>
               )}
               {uploadedFiles.map((src, i) => (
                 <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden relative border border-gray-200 group">
                   <img src={src} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                        <span className="text-white text-xs font-bold">#{i+1}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {results.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 animate-in slide-in-from-bottom-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                ✅ Sonuçlar
                <span className="text-xs font-normal text-gray-500">(Galeriye kaydedildi)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((src, i) => (
                  <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
                    <img src={src} className="w-full h-full object-cover" />
                    <a href={src} download className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform">⬇️ İndir</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {processing && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <div className="text-4xl animate-bounce mb-4">📸</div>
               <p className="text-gray-500 font-medium">{statusMessage}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}