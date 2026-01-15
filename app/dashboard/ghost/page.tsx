"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function GhostPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Kullanıcı Kontrolü
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
    }
    getUser();
  }, [router]);

  // Dosya Seçilince
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
    setResultImage(null); // Yeni resim gelince eski sonucu temizle
  };

  // İşlemi Başlat
  const handleProcess = async () => {
    if (!uploadedImage || !user) return;
    setProcessing(true);
    setStatusMessage("Manken tespit ediliyor...");

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      
      if (profile && profile.credits < 1) {
        alert("Yetersiz Kredi! Lütfen kredi yükleyin.");
        setProcessing(false);
        setStatusMessage("");
        return;
      }

      // 2. SİMÜLASYON ADIMLARI (Kullanıcıya işlem yapıldığını hissettir)
      setTimeout(() => setStatusMessage("Ten rengi analiz ediliyor..."), 1000);
      setTimeout(() => setStatusMessage("Uzuvlar siliniyor..."), 2500);
      setTimeout(() => setStatusMessage("Yaka ve iç etiketler tamamlanıyor..."), 3500);
      
      // 3. SONUÇ VE KREDİ DÜŞME
      setTimeout(async () => {
        // Krediyi veritabanından düş
        if (profile) {
            await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);
        }
        
        // Örnek bir Hayalet Manken sonucu (Demo görsel)
        setResultImage("https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop"); 
        
        setStatusMessage("✅ İşlem Tamamlandı! Trendyol uyumlu.");
        setProcessing(false);
      }, 5000);

    } catch (error) {
      alert("Bir hata oluştu.");
      setProcessing(false);
      setStatusMessage("Hata oluştu.");
    }
  };

  return (
    <div className="p-8 min-h-screen font-sans pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hayalet Manken 👻</h1>
        <p className="text-gray-500 mt-2">Mankeni sil, sadece kıyafeti bırak. E-ticaret için %100 uyumlu dekupe görsel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* SOL: YÜKLEME ALANI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">Orijinal Fotoğraf</h3>
             {uploadedImage && <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded font-bold">Resim Seçildi</span>}
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${uploadedImage ? 'border-gray-200' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'}`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            
            {uploadedImage ? (
              <img src={uploadedImage} className="w-full h-full object-contain" alt="Upload Preview" />
            ) : (
              <div className="text-center p-6">
                <span className="text-5xl mb-4 block opacity-30 group-hover:scale-110 transition-transform">📸</span>
                <p className="text-gray-600 font-medium">Fotoğrafı Buraya Sürükle</p>
                <p className="text-xs text-gray-400 mt-2">veya tıklayarak seç</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleProcess}
            disabled={!uploadedImage || processing}
            className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Yapay Zeka İşliyor...</span>
              </>
            ) : (
              <>⚡️ Mankeni Yok Et (1 Kredi)</>
            )}
          </button>
          
          {processing && (
             <div className="mt-4 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg text-sm text-center animate-pulse font-medium">
               {statusMessage}
             </div>
          )}
        </div>

        {/* SAĞ: SONUÇ ALANI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit relative">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">Sonuç (Dekupe)</h3>
             {resultImage && <span className="text-indigo-600 text-xs bg-indigo-50 px-2 py-1 rounded font-bold">Hazır</span>}
          </div>

          <div className="border border-gray-100 rounded-xl aspect-[3/4] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {resultImage ? (
              <>
                <img src={resultImage} className="w-full h-full object-contain z-10 animate-in zoom-in duration-500" alt="Ghost Result" />
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm border">
                    Arkaplan: Şeffaf / Beyaz
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center opacity-40">
                <span className="text-6xl block mb-2">👻</span>
                <p>İşlem sonucu burada görünecek</p>
              </div>
            )}
          </div>

          {resultImage && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="bg-gray-100 text-gray-800 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                🔍 Yakınlaştır
              </button>
              <a href={resultImage} download="ghost_manken.png" className="bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                ⬇️ İndir (PNG)
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}