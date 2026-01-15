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
  const [consistencyMode, setConsistencyMode] = useState(true); // Tutarlılık Kilidi
  
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
    // Yeni dosyaları mevcutların üstüne ekle (Maksimum 5)
    const newFiles = Array.from(event.target.files).map(file => URL.createObjectURL(file));
    if (uploadedFiles.length + newFiles.length > 5) {
      alert("Maksimum 5 fotoğraf yükleyebilirsiniz.");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setResults([]); // Yeni yükleme yapılınca eski sonuçları temizle
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 || !user) return;
    setProcessing(true);
    setStatusMessage("Sahne analizi yapılıyor...");

    try {
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      const requiredCredits = uploadedFiles.length; // Her fotoğraf 1 kredi

      if (profile && profile.credits < requiredCredits) {
        alert(`Yetersiz Kredi! Bu işlem için ${requiredCredits} kredi lazım.`);
        setProcessing(false);
        return;
      }

      // SİMÜLASYON: Tutarlılık Modu
      // Gerçekte burada tüm fotolara AYNI seed ve AYNI prompt gönderilir.
      setTimeout(() => setStatusMessage(consistencyMode ? "Işık ve ortam eşitleniyor (Consistency Mode)..." : "Bağımsız sahneler oluşturuluyor..."), 1500);
      
      setTimeout(async () => {
        if (profile) {
            await supabase.from("profiles").update({ credits: profile.credits - requiredCredits }).eq("id", user.id);
        }
        
        // Örnek Sonuçlar (Seçilen temaya göre değişiyormuş gibi)
        const demoResults = uploadedFiles.map(() => 
          selectedTheme === 'paris' 
            ? "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=500&fit=crop" // Paris
            : "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=500&h=500&fit=crop" // Stüdyo
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
        <p className="text-gray-500 mt-2">Dükkanda çektiğin ürünleri tek tıkla profesyonel stüdyoya veya sokağa taşı.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: AYARLAR (1 birim) */}
        <div className="space-y-6">
          
          {/* 1. Tema Seçimi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Mekan Seçimi</h3>
            <div className="space-y-3">
              {[
                {id: 'stüdyo', name: 'Minimal Stüdyo (Gri)', icon: '📸'},
                {id: 'paris', name: 'Paris Sokakları', icon: '🇫🇷'},
                {id: 'home', name: 'Bohem Ev Ortamı', icon: '🌿'},
                {id: 'beach', name: 'Gün Batımı Kumsal', icon: '🌅'},
              ].map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${selectedTheme === theme.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="font-medium text-sm">{theme.name}</span>
                  {selectedTheme === theme.id && <span className="ml-auto text-green-600 font-bold">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tutarlılık Ayarı */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">Tutarlılık Modu</h3>
            <p className="text-xs text-gray-500 mb-4">Tüm fotoğraflarda aynı ışık ve renk tonunu korur.</p>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${consistencyMode ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => setConsistencyMode(!consistencyMode)}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${consistencyMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-bold">{consistencyMode ? "Açık (Önerilen)" : "Kapalı"}</span>
            </label>
          </div>

          {/* İşlem Butonu */}
          <button 
            onClick={handleProcess}
            disabled={uploadedFiles.length === 0 || processing}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
          >
            {processing ? "Büyü Yapılıyor..." : `✨ Dönüştür (${uploadedFiles.length || 1} Kredi)`}
          </button>

        </div>

        {/* SAĞ: GALERİ (2 birim) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Yükleme Alanı */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Fotoğraflar ({uploadedFiles.length}/5)</h3>
               <button onClick={() => setUploadedFiles([])} className="text-xs text-red-500 hover:underline">Temizle</button>
             </div>
             
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
               {/* Yükle Butonu */}
               {uploadedFiles.length < 5 && (
                 <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-colors">
                   <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   <span className="text-2xl text-gray-400">+</span>
                   <span className="text-xs text-gray-500 font-bold mt-1">Ekle</span>
                 </div>
               )}

               {/* Yüklenenler */}
               {uploadedFiles.map((src, i) => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden relative border border-gray-200">
                   <img src={src} className="w-full h-full object-cover" />
                   <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded">Orijinal</div>
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
                    <a href={src} download className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">⬇️ İndir</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {processing && (
            <div className="text-center py-12">
               <div className="text-4xl animate-bounce mb-4">🎨</div>
               <p className="text-gray-500 font-medium">{statusMessage}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}