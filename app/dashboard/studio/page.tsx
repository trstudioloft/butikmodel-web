"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StudioPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Resimler
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  
  // Manken Yönetimi (3 KATEGORİ)
  const [activeTab, setActiveTab] = useState<'system' | 'generated' | 'face'>('system');
  
  const [systemModels, setSystemModels] = useState<any[]>([]); // Hazır Havuz
  const [userModels, setUserModels] = useState<any[]>([]);     // Lab (Yapay)
  const [customFaceModels, setCustomFaceModels] = useState<any[]>([]); // Dijital İkizler
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // Verileri Çek
      const { data: sysData } = await supabase.from("system_models").select("*").order("name");
      if (sysData) setSystemModels(sysData);

      const { data: usrData } = await supabase.from("user_models").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      if (usrData) setUserModels(usrData);

      const { data: faceData } = await supabase.from("custom_face_models").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      if (faceData) setCustomFaceModels(faceData);
    }
    initData();
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
  };

  // --- GÜNCELLENEN KISIM: GERÇEK API BAĞLANTISI ---
  const handleGenerate = async () => {
    if (!selectedModel) { alert("Lütfen bir manken seçin!"); return; }
    if (!uploadedImage) { alert("Lütfen bir kıyafet yükleyin!"); return; }
    
    setProcessing(true);
    setStatusMessage("Yapay Zeka Motoruna Bağlanılıyor..."); // Kullanıcıya bilgi ver

    try {
      // 1. Seçilen mankeni bul
      const allModels = [...systemModels, ...userModels, ...customFaceModels];
      const targetModel = allModels.find(m => m.id === selectedModel);
      
      // 2. API'ye İstek At (Motoru Çalıştır)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "studio",
          // NOT: Faz 2 (Storage) yapılmadığı için şimdilik test resmi gönderiyoruz.
          // Gerçek sistemde buraya 'uploadedImage'in storage linki gelecek.
          imageUrl: "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/cloth.jpg", 
          modelUrl: targetModel?.image_url || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg",
          prompt: userPrompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İşlem başarısız.");
      }

      // 3. Sonucu Göster
      setResultImage(data.output);
      setStatusMessage("✅ Çekim Başarılı!");
      
      // 4. Kredi Düş (Opsiyonel: Bunu API tarafında yapmak daha güvenlidir)
      /* const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);
      }
      */

    } catch (error: any) {
      // Hata Mesajını Ekrana Bas (Örn: Yetersiz Bakiye)
      alert("⚠️ MOTOR DURUMU: " + error.message);
      setStatusMessage("❌ İşlem Durduruldu.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sanal Stüdyo 📸</h1>
          <p className="text-gray-500 mt-2 text-lg">Profesyonel moda çekimi, saniyeler içinde.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL KOLON: GİRDİLER (Bento Kart 1) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. KIYAFET YÜKLEME */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[2rem] -mr-4 -mt-4 z-0"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
              <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded-full text-xs">1</span>
              Kıyafet
            </h3>
            
            <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all z-10 bg-gray-50/50 ${uploadedImage ? 'border-green-500' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {uploadedImage ? (
                <img src={uploadedImage} className="h-full w-full object-contain rounded-xl p-2" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-4xl block mb-2 opacity-30">👕</span>
                  <p className="text-sm font-bold text-gray-400">Fotoğrafı Sürükle</p>
                  <p className="text-xs text-gray-300 mt-1">veya tıklayarak seç</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. SAHNE AYARLARI */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
              <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded-full text-xs">3</span>
              Mekan & Işık
            </h3>
            <textarea 
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Örn: Paris sokaklarında, yumuşak gün ışığı, arkada flu mağaza vitrinleri..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none min-h-[120px] resize-none transition-all focus:bg-white"
            />
          </div>

        </div>

        {/* ORTA KOLON: MANKEN SEÇİMİ (Bento Kart 2) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 h-full flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-black text-white w-7 h-7 flex items-center justify-center rounded-full text-xs">2</span>
                  Cast Ajansı
                </h3>
                {activeTab === 'generated' && <Link href="/dashboard/my-models" className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full font-bold hover:bg-black">+ Yeni Üret</Link>}
                {activeTab === 'face' && <Link href="/dashboard/train-model" className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full font-bold hover:bg-black">+ Yüz Ekle</Link>}
             </div>

             {/* Modern Tabs */}
             <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-6">
                {['system', 'generated', 'face'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {tab === 'system' ? 'Hazır Havuz' : tab === 'generated' ? 'Laboratuvar' : 'Dijital İkiz'}
                  </button>
                ))}
             </div>

             {/* Manken Listesi */}
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
                <div className="grid grid-cols-3 gap-3">
                  {/* Sistem Mankenleri */}
                  {activeTab === 'system' && systemModels.map((m) => (
                    <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent hover:border-gray-200'}`}>
                      <img src={m.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <p className="text-white text-xs font-bold text-center">{m.name}</p>
                      </div>
                      {selectedModel === m.id && <div className="absolute top-2 right-2 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">✓</div>}
                    </div>
                  ))}

                  {/* Lab Mankenleri */}
                  {activeTab === 'generated' && userModels.map((m) => (
                    <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent hover:border-gray-200'}`}>
                      <img src={m.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 rounded-full">AI</div>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <p className="text-white text-xs font-bold text-center">{m.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Dijital İkizler */}
                  {activeTab === 'face' && customFaceModels.map((m) => (
                    <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent hover:border-gray-200'}`}>
                      <img src={m.cover_image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 rounded-full">İKİZ</div>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <p className="text-white text-xs font-bold text-center">{m.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Boş Durumlar */}
                {((activeTab === 'generated' && userModels.length === 0) || (activeTab === 'face' && customFaceModels.length === 0)) && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <span className="text-4xl mb-3 opacity-20">📂</span>
                    <p className="text-gray-400 text-sm mb-4">Bu kategoride mankenin yok.</p>
                    <Link href={activeTab === 'generated' ? "/dashboard/my-models" : "/dashboard/train-model"} className="text-xs font-bold text-blue-600 hover:underline">Oluşturmaya Git →</Link>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* SAĞ KOLON: AKSİYON (Bento Kart 3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-black text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
            {/* Arka plan efekti */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
            
            <div>
              <h3 className="text-xl font-bold mb-6">Prodüksiyon Özeti</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Kıyafet</span>
                  <span className={uploadedImage ? "text-green-400 font-bold" : "text-gray-600"}>{uploadedImage ? "Yüklendi" : "Bekleniyor"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Manken</span>
                  <span className={selectedModel ? "text-green-400 font-bold" : "text-gray-600"}>{selectedModel ? "Seçildi" : "Bekleniyor"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span>Maliyet</span>
                  <span className="text-white font-bold">1 Kredi</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!uploadedImage || !selectedModel || processing}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-auto"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                   <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                   Motor Çalışıyor...
                </div>
              ) : "🎬 Çekimi Başlat"}
            </button>
          </div>

          {/* Sonuç Alanı (Varsa) */}
          {resultImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-[2rem] shadow-xl border border-green-100"
            >
              <img src={resultImage} className="w-full rounded-xl shadow-sm mb-4" />
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-200">
                ⬇️ HD İndir
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}