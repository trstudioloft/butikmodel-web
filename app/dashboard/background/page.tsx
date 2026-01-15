"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BackgroundPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Çoklu Dosya Yönetimi
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  
  // Atmosfer Seçimi
  const [selectedTheme, setSelectedTheme] = useState("stüdyo");
  const [customPrompt, setCustomPrompt] = useState(""); // YENİ: Kullanıcının Yazdığı Prompt
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

  // Bir hazır tema seçildiğinde prompt kutusunu da ona göre dolduralım mı?
  // İstersen doldurabiliriz ama şimdilik sadece seçimi güncelleyelim.
  const handleThemeSelect = (id: string) => {
    setSelectedTheme(id);
    // Eğer kullanıcı "Özel" yazmak yerine butona basarsa, kutuyu temizle veya varsayılanı kullan
    if (id !== 'custom') setCustomPrompt(""); 
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 || !user) return;
    setProcessing(true);
    setStatusMessage("Sahne analizi yapılıyor...");

    try {
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      const requiredCredits = uploadedFiles.length; 

      if (profile && profile.credits < requiredCredits) {
        alert(`Yetersiz Kredi! Bu işlem için ${requiredCredits} kredi lazım.`);
        setProcessing(false);
        return;
      }

      // HANGİ PROMPT KULLANILACAK?
      // Eğer kullanıcı kutuya bir şey yazdıysa O geçerli. Yazmadıysa seçilen tema.
      const finalPrompt = customPrompt.trim().length > 0 
        ? customPrompt 
        : `Professional product photography in ${selectedTheme} environment`;

      console.log("🚀 Yapay Zekaya Giden Emir:", finalPrompt);

      setTimeout(() => setStatusMessage(consistencyMode ? "Işık ve ortam eşitleniyor..." : "Sahneler oluşturuluyor..."), 1500);
      
      setTimeout(async () => {
        if (profile) {
            await supabase.from("profiles").update({ credits: profile.credits - requiredCredits }).eq("id", user.id);
        }
        
        // Demo Sonuçlar
        const demoResults = uploadedFiles.map(() => 
          "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=500&h=500&fit=crop" 
        );
        
        setResults(demoResults);
        setStatusMessage(`✅ ${uploadedFiles.length} Fotoğraf İşlendi!`);
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
        <p className="text-gray-500 mt-2">Dükkanda çektiğin ürünleri tek tıkla profesyonel stüdyoya veya hayalindeki mekana taşı.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: AYARLAR (1 birim) */}
        <div className="space-y-6">
          
          {/* 1. MEKAN SEÇİMİ (Prompt veya Buton) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Mekan & Atmosfer</h3>
            
            {/* YENİ: Özel Prompt Alanı 🚀 */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Senin Tarifin (Özel)</label>
                <textarea 
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Örn: Ahşap bir masanın üzerinde, arkada şömine ateşi, sıcak ve loş bir dağ evi ortamı..."
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-black focus:border-transparent outline-none shadow-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">Türkçe yazabilirsin, AI anlayacaktır.</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">VEYA HAZIR SEÇ</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                {id: 'stüdyo', name: 'Minimal Stüdyo (Beyaz)', icon: '📸'},
                {id: 'paris', name: 'Paris Sokakları', icon: '🇫🇷'},
                {id: 'luxury', name: 'Lüks Mağaza Vitrini', icon: '💎'},
                {id: 'nature', name: 'Doğa & Orman', icon: '🌿'},
                {id: 'industrial', name: 'Endüstriyel Beton', icon: '🏭'},
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
            {customPrompt !== "" && <p className="text-xs text-green-600 mt-2 font-medium text-center">✨ Özel tarifin kullanılacak.</p>}
          </div>

          {/* 2. Tutarlılık Ayarı */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">Tutarlılık Modu</h3>
            <p className="text-xs text-gray-500 mb-4">Seri çekimlerde (örn. katalog) tüm ürünler aynı ışıkta olsun.</p>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${consistencyMode ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => setConsistencyMode(!consistencyMode)}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${consistencyMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-bold">{consistencyMode ? "Açık" : "Kapalı"}</span>
            </label>
          </div>

          {/* İşlem Butonu */}
          <button 
            onClick={handleProcess}
            disabled={uploadedFiles.length === 0 || processing}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex flex-col items-center justify-center"
          >
            {processing ? (
                <span>Büyü Yapılıyor...</span>
            ) : (
                <>
                    <span>✨ Dönüştür</span>
                    <span className="text-[10px] opacity-70 font-normal mt-1">{uploadedFiles.length || 0} Fotoğraf = {uploadedFiles.length || 0} Kredi</span>
                </>
            )}
          </button>

        </div>

        {/* SAĞ: GALERİ (2 birim) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Yükleme Alanı */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Fotoğraflar ({uploadedFiles.length}/5)</h3>
               <button onClick={() => {setUploadedFiles([]); setResults([]);}} className="text-xs text-red-500 hover:underline font-medium">Temizle</button>
             </div>
             
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
               {/* Yükle Butonu */}
               {uploadedFiles.length < 5 && (
                 <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-colors group">
                   <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   <span className="text-2xl text-gray-400 group-hover:scale-110 transition-transform">+</span>
                   <span className="text-xs text-gray-500 font-bold mt-1">Ekle</span>
                 </div>
               )}

               {/* Yüklenenler */}
               {uploadedFiles.map((src, i) => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden relative border border-gray-200 group">
                   <img src={src} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                        <span className="text-white text-xs font-bold">#{i+1}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Sonuç Alanı */}
          {results.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 animate-in slide-in-from-bottom-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                ✅ Sonuçlar
                <span className="text-xs font-normal text-gray-500">(Otomatik olarak galeriye kaydedildi)</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((src, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm">
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
               <div className="text-4xl animate-bounce mb-4">🎨</div>
               <p className="text-gray-500 font-medium">{statusMessage}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}