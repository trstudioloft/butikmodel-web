"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CopywriterPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("samimi"); // Samimi, Kurumsal, Hype
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
    setGeneratedText(""); // Yeni resim gelince eski metni sil
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !user) return;
    setProcessing(true);

    try {
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      
      // Metin yazmak daha ucuz olsun (0.5 kredi gibi) veya şimdilik 1 kredi
      if (profile && profile.credits < 1) {
        alert("Yetersiz Kredi!");
        setProcessing(false);
        return;
      }

      // SİMÜLASYON: Gerçekte burası resmi GPT-4 Vision'a gönderip analiz ettirecek.
      setTimeout(async () => {
        if (profile) {
            await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);
        }

        let demoText = "";
        
        // Platforma Göre Senaryolar
        if (platform === "instagram") {
            demoText = `✨ Bu sezonun favori parçası stoklarda! ✨\n\nKombinlerinize şıklık katacak bu özel tasarım, hem günlük kullanımda hem de özel davetlerde kurtarıcınız olacak. Yumuşak dokusu ve modern kesimiyle üzerinizden çıkarmak istemeyeceksiniz. 😍\n\n✅ Sınırlı stok\n✅ Hızlı kargo\n✅ Şeffaf kargo imkanı\n\n👇 Sipariş için DM veya link profilde!\n\n#moda #trend #kombin #yenisezon #butik #tarz`;
        } else if (platform === "trendyol") {
            demoText = `Ürün Özellikleri:\n- Kumaş Tipi: %100 Pamuklu Dokuma\n- Kalıp: Regular Fit (Rahat Kesim)\n- Manken Bilgisi: Boy: 1.75, Kilo: 58, Beden: S\n\nGünlük kullanıma uygun, terletmeyen özel kumaşı ile gün boyu konfor sağlar. 30 derecede yıkanması önerilir. Türkiye'de üretilmiştir.\n\nSEO Anahtar Kelimeler: Kadın giyim, yazlık elbise, pamuklu tişört, günlük kombin.`;
        } else {
            demoText = `Global Trend Alert! 🌍\n\nDiscover the ultimate comfort meets style. Perfect for your capsule wardrobe. \n\n🌿 Sustainable materials\n✈️ Worldwide Shipping\n\nShop now at butikmodel.ai`;
        }

        setGeneratedText(demoText);
        setProcessing(false);
      }, 3000);

    } catch (error) {
      alert("Hata oluştu.");
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert("Metin kopyalandı! 🎉");
  };

  return (
    <div className="p-8 min-h-screen font-sans pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Akıllı Metin Yazarı ✍️</h1>
        <p className="text-gray-500 mt-2">Ürün fotoğrafını yükle, yapay zeka senin için satış odaklı açıklama yazsın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOL: GİRDİLER */}
        <div className="space-y-6">
          
          {/* Resim Yükleme */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Ürün Fotoğrafı</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${uploadedImage ? 'border-green-500' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {uploadedImage ? (
                <img src={uploadedImage} className="w-full h-full object-contain bg-gray-50" />
              ) : (
                <div className="text-center">
                  <span className="text-3xl">📷</span>
                  <p className="text-sm text-gray-500 mt-2">Fotoğraf Seç</p>
                </div>
              )}
            </div>
          </div>

          {/* Ayarlar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Metin Ayarları</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Platform</label>
                <div className="flex gap-2">
                  {['instagram', 'trendyol', 'global'].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${platform === p ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Dil & Ton</label>
                <select 
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="samimi">Samimi & Emoji Dolu (Instagram)</option>
                  <option value="kurumsal">Resmi & Bilgi Odaklı (Pazaryeri)</option>
                  <option value="hype">Heyecanlı & Aciliyet (Kampanya)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!uploadedImage || processing}
              className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {processing ? "Yazar Düşünüyor..." : "✨ Metni Yaz (1 Kredi)"}
            </button>
          </div>
        </div>

        {/* SAĞ: SONUÇ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">Oluşturulan Metin</h3>
             {generatedText && (
               <button onClick={copyToClipboard} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hover:bg-green-200 transition-colors">
                 Kopyala
               </button>
             )}
          </div>

          <div className="flex-1 relative">
             <textarea 
               value={generatedText}
               onChange={(e) => setGeneratedText(e.target.value)}
               placeholder="Sonuç burada görünecek..."
               className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
             />
             {processing && (
               <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm rounded-xl">
                 <div className="text-center">
                    <div className="text-4xl animate-bounce mb-2">✍️</div>
                    <p className="text-indigo-600 font-bold animate-pulse">Kalem oynatılıyor...</p>
                 </div>
               </div>
             )}
          </div>
          
          <p className="text-xs text-gray-400 mt-4 text-center">
            *Metni düzenleyebilir, hashtag ekleyip çıkarabilirsiniz.
          </p>
        </div>

      </div>
    </div>
  );
}