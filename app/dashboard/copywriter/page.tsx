"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CopywriterPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // ÇOKLU DİL SEÇİMİ (Varsayılan sadece Türkçe)
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['tr']);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null); 
  const [publicUrl, setPublicUrl] = useState<string | null>(null); 
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Samimi & Emoji Dolu 🚀");
  const [generatedText, setGeneratedText] = useState("");
  
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

  // Dil Aç/Kapa Fonksiyonu
  const toggleLanguage = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      // Eğer listede varsa çıkar (ama en az 1 dil kalsın)
      if (selectedLangs.length > 1) {
        setSelectedLangs(prev => prev.filter(l => l !== lang));
      }
    } else {
      // Yoksa ekle
      setSelectedLangs(prev => [...prev, lang]);
    }
  };

  // --- 1. RESİM YÜKLEME ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    setUploadedImage(URL.createObjectURL(file));
    setGeneratedText("");
    setUploading(true);
    setStatusMessage("Görsel analiz için yükleniyor...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `copy-${Date.now()}.${fileExt}`;
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

  // --- 2. MOTORU ÇALIŞTIR ---
  const handleGenerate = async () => {
    if (!publicUrl) { alert("Lütfen görselin yüklenmesini bekleyin."); return; }
    
    setProcessing(true);
    setGeneratedText("");
    setStatusMessage("Yapay Zeka Metinleri Hazırlıyor...");

    try {
      // Seçilen dilleri metne çevir (Örn: "Türkçe, İngilizce")
      const languageNames = selectedLangs.map(l => 
        l === 'tr' ? 'Turkish' : l === 'en' ? 'English' : 'Arabic'
      ).join(', ');

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "copywriter",
          imageUrl: publicUrl,
          // ÇOKLU DİL PROMPT'U
          prompt: `Act as a professional copywriter. Write a separate caption for EACH of the following languages: ${languageNames}. 
          Platform: ${platform}. Tone: ${tone}. 
          Format: 
          [Language Name]
          (The caption with emojis and hashtags)
          
          ---
          ` 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "İşlem başarısız.");

      setGeneratedText(data.output);
      setStatusMessage("✨ Tüm Metinler Hazır!");

    } catch (error: any) {
      alert("Hata: " + error.message);
      setStatusMessage("❌ Hata oluştu");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert("Metin kopyalandı! 🎉");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Akıllı Metin Yazarı ✍️</h1>
          <p className="text-gray-500 mt-2 text-lg">Görseli yükle, yapay zeka seçtiğin dillerde satış metnini yazsın.</p>
        </div>
        {statusMessage && (
           <div className="text-sm font-bold bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full animate-pulse">
              ℹ️ {statusMessage}
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOL: GİRDİLER */}
        <div className="space-y-6">
          
          {/* Görsel Alanı */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden group">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">1. Ürün Görseli</h3>
            
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-gray-50 ${uploadedImage ? 'border-green-500' : 'border-gray-200 hover:border-yellow-500 hover:bg-yellow-50/20'} ${uploading ? 'opacity-50' : ''}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
              
              {uploading ? (
                 <div className="flex flex-col items-center">
                    <span className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></span>
                    <span className="text-xs font-bold text-yellow-600">Yükleniyor...</span>
                 </div>
              ) : uploadedImage ? (
                <img src={uploadedImage} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-5xl block mb-3 opacity-30">📷</span>
                  <p className="text-sm font-bold text-gray-400">Fotoğrafı Buraya Bırak</p>
                </div>
              )}
            </div>
          </div>

          {/* Ayarlar Alanı */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">2. Hedef & Diller</h3>
            
            <div className="space-y-6">
              
              {/* ÇOKLU DİL SEÇİMİ */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Çıktı Dilleri (Birden fazla seçilebilir)</label>
                <div className="flex gap-3">
                   {/* TÜRKÇE */}
                   <button 
                     onClick={() => toggleLanguage('tr')}
                     className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${selectedLangs.includes('tr') ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-400'}`}
                   >
                     <span>🇹🇷</span> Türkçe
                   </button>
                   {/* İNGİLİZCE */}
                   <button 
                     onClick={() => toggleLanguage('en')}
                     className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${selectedLangs.includes('en') ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}
                   >
                     <span>🇬🇧</span> English
                   </button>
                   {/* ARAPÇA */}
                   <button 
                     onClick={() => toggleLanguage('ar')}
                     className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${selectedLangs.includes('ar') ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                   >
                     <span>🇸🇦</span> Arabic
                   </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Platform</label>
                <div className="flex gap-3">
                  {['Instagram', 'Trendyol', 'Etsy', 'LinkedIn'].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${platform === p ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Yazı Dili</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-yellow-400 outline-none appearance-none"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option>Samimi & Emoji Dolu 🚀</option>
                  <option>Resmi & Teknik Detaylı 👔</option>
                  <option>Heyecanlı & Kampanya Odaklı 🔥</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!publicUrl || processing}
              className="w-full mt-8 bg-yellow-500 text-black py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02]"
            >
              {processing ? (
                 <>
                   <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                   Yazar Düşünüyor...
                 </>
              ) : "✨ Metinleri Oluştur (1 Kredi)"}
            </button>
          </div>
        </div>

        {/* SAĞ: SONUÇ (NOT DEFTERİ) */}
        <div className="bg-[#fff9c4]/10 rounded-[2.5rem] border border-yellow-100 p-2 h-full min-h-[600px] flex flex-col relative">
           <div className="absolute inset-0 bg-yellow-50/50 rounded-[2.5rem] -z-10"></div>
           
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                 </div>
                 {generatedText && (
                   <button onClick={copyToClipboard} className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                     📋 Kopyala
                   </button>
                 )}
              </div>

              <div className="flex-1 relative">
                 <textarea 
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   placeholder="Yapay zeka seçtiğin dillerde sonuçları buraya yazacak..."
                   className="w-full h-full p-2 bg-transparent border-none text-gray-700 text-lg leading-loose resize-none focus:ring-0 outline-none font-medium font-mono"
                 />
                 
                 {processing && (
                   <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                      <div className="text-5xl animate-bounce mb-4">✍️</div>
                      <p className="text-gray-500 font-bold animate-pulse">Kelimeler seçiliyor...</p>
                   </div>
                 )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400 font-mono">
                 <span>{generatedText.length} Karakter</span>
                 <span>Seçili Diller: {selectedLangs.join(", ").toUpperCase()}</span>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}