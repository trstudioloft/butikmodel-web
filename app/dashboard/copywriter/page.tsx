"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CopywriterPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("samimi");
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
    setGeneratedText("");
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !user) return;
    setProcessing(true);

    try {
      // SİMÜLASYON
      setTimeout(async () => {
        let demoText = "";
        
        if (platform === "instagram") {
            demoText = `✨ Bu sezonun favori parçası stoklarda! ✨\n\nKombinlerinize şıklık katacak bu özel tasarım, hem günlük kullanımda hem de özel davetlerde kurtarıcınız olacak. Yumuşak dokusu ve modern kesimiyle üzerinizden çıkarmak istemeyeceksiniz. 😍\n\n✅ Sınırlı stok\n✅ Hızlı kargo\n✅ Şeffaf kargo imkanı\n\n👇 Sipariş için DM veya link profilde!\n\n#moda #trend #kombin #yenisezon #butik #tarz`;
        } else if (platform === "trendyol") {
            demoText = `Ürün Özellikleri:\n- Kumaş Tipi: %100 Pamuklu Dokuma\n- Kalıp: Regular Fit (Rahat Kesim)\n- Manken Bilgisi: Boy: 1.75, Kilo: 58, Beden: S\n\nGünlük kullanıma uygun, terletmeyen özel kumaşı ile gün boyu konfor sağlar. 30 derecede yıkanması önerilir. Türkiye'de üretilmiştir.\n\nSEO Anahtar Kelimeler: Kadın giyim, yazlık elbise, pamuklu tişört, günlük kombin.`;
        } else {
            demoText = `Global Trend Alert! 🌍\n\nDiscover the ultimate comfort meets style. Perfect for your capsule wardrobe. \n\n🌿 Sustainable materials\n✈️ Worldwide Shipping\n\nShop now at butikmodel.ai`;
        }

        setGeneratedText(demoText);
        setProcessing(false);
      }, 2500);

    } catch (error) {
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
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Akıllı Metin Yazarı ✍️</h1>
        <p className="text-gray-500 mt-2 text-lg">Görseli yükle, yapay zeka satış odaklı açıklamanı yazsın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOL: GİRDİLER (BENTO) */}
        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden group">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">1. Ürün Görseli</h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${uploadedImage ? 'border-green-500' : 'border-gray-200 hover:border-yellow-500 hover:bg-yellow-50/20'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {uploadedImage ? (
                <img src={uploadedImage} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-5xl block mb-3 opacity-30">📷</span>
                  <p className="text-sm font-bold text-gray-400">Analiz Edilecek Fotoğrafı Seç</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">2. Hedef Kitle & Ton</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Platform</label>
                <div className="flex gap-3">
                  {['instagram', 'trendyol', 'global'].map((p) => (
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
                  <option value="samimi">Samimi & Emoji Dolu 🚀</option>
                  <option value="kurumsal">Resmi & Teknik Detaylı 👔</option>
                  <option value="hype">Heyecanlı & Kampanya Odaklı 🔥</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!uploadedImage || processing}
              className="w-full mt-8 bg-yellow-500 text-black py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02]"
            >
              {processing ? "Yazar Düşünüyor..." : "✨ Metni Oluştur (1 Kredi)"}
            </button>
          </div>
        </div>

        {/* SAĞ: SONUÇ (NOT DEFTERİ GÖRÜNÜMÜ) */}
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
                   placeholder="Yapay zeka sonucu buraya yazacak..."
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
                 <span>AI Copywriter v2.0</span>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}