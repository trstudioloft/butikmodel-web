"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudioPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Resimler
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  
  // Manken Yönetimi (3 KATEGORİ)
  const [activeTab, setActiveTab] = useState<'system' | 'generated' | 'face'>('system');
  const [systemModels, setSystemModels] = useState<any[]>([]);
  const [userModels, setUserModels] = useState<any[]>([]);
  // const [faceModels, setFaceModels] = useState<any[]>([]); // İleride eklenecek
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // 1. HAZIR HAVUZU ÇEK
      const { data: sysData } = await supabase
        .from("system_models")
        .select("*")
        .order("name");
      if (sysData) setSystemModels(sysData);

      // 2. KULLANICININ ÜRETTİKLERİNİ ÇEK
      const { data: usrData } = await supabase
        .from("user_models")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (usrData) setUserModels(usrData);
    }
    initData();
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
    // Demo upload simülasyonu
    setUploadedPath("demo_path.jpg"); 
  };

  const handleGenerate = async () => {
    if (!selectedModel) { alert("Lütfen bir manken seçin!"); return; }
    setProcessing(true);
    setStatusMessage("Senaryo oluşturuluyor...");

    try {
      // Seçilen mankenin detaylarını bul (Hangi listedeyse oradan al)
      const allModels = [...systemModels, ...userModels];
      const targetModel = allModels.find(m => m.id === selectedModel);
      
      const finalPrompt = `Professional photo of model (${targetModel?.name}) wearing the uploaded cloth. Scene: ${userPrompt || "Studio"}.`;
      console.log("🚀 KOMUT:", finalPrompt);

      setStatusMessage("Sahne kuruluyor: " + (userPrompt || "Stüdyo Ortamı"));
      
      // Kredi Düşme Simülasyonu
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);
      }

      setTimeout(() => {
        setResultImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop");
        setStatusMessage("✅ Çekim Tamamlandı!");
        setProcessing(false);
      }, 3000);

    } catch (error: any) {
      alert("Hata: " + error.message);
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 min-h-screen pb-20 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sanal Stüdyo 📸</h1>
        <p className="text-gray-500 mt-2">Kıyafetini yükle, mankenini seç ve çekimi başlat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: GİRDİLER (2 birim) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ADIM 1: KIYAFET */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              Kıyafet Fotoğrafı
            </h3>
            <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploadedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-black'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {uploadedImage ? (
                <img src={uploadedImage} className="h-48 w-full object-contain mx-auto" />
              ) : (
                <div className="py-8">
                  <span className="text-4xl">👕</span>
                  <p className="mt-2 text-sm text-gray-500">Fotoğraf seçmek için tıkla</p>
                </div>
              )}
            </div>
          </div>

          {/* ADIM 2: OYUNCU SEÇİMİ (SEKMELİ YAPI) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                  Manken Seçimi
                </h3>
                
                {activeTab === 'generated' && (
                  <Link href="/dashboard/my-models" className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold hover:bg-gray-800">
                    + Yeni Üret
                  </Link>
                )}
             </div>

             {/* SEKMELER (TABS) */}
             <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button 
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'system' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  🏢 Hazır Havuz
                </button>
                <button 
                  onClick={() => setActiveTab('generated')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'generated' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  🧬 Laboratuvar
                </button>
                <button 
                  onClick={() => setActiveTab('face')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'face' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  👤 Kendi Yüzüm
                </button>
             </div>

             {/* MANKEN LİSTESİ (DURUMA GÖRE DEĞİŞİR) */}
             <div className="min-h-[200px]">
                
                {/* 1. HAZIR HAVUZ */}
                {activeTab === 'system' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {systemModels.map((m) => (
                      <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-2 ring-blue-100 scale-105' : 'border-transparent hover:border-gray-200'}`}>
                        <img src={m.image_url} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] p-2 pt-4 text-center truncate font-medium">
                          {m.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. LABORATUVAR (KULLANICI ÜRETİMİ) */}
                {activeTab === 'generated' && (
                  userModels.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {userModels.map((m) => (
                        <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-2 ring-blue-100 scale-105' : 'border-transparent hover:border-gray-200'}`}>
                          <img src={m.image_url} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">ÖZEL</div>
                          <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] p-1 text-center truncate">{m.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-gray-500 mb-4">Henüz kendi ürettiğin bir manken yok.</p>
                      <Link href="/dashboard/my-models" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800">
                        Hemen Üretmeye Başla
                      </Link>
                    </div>
                  )
                )}

                {/* 3. KENDİ YÜZÜM (PLACEHOLDER) */}
                {activeTab === 'face' && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <div className="text-4xl mb-3">🤳</div>
                    <h4 className="font-bold text-gray-900">Yüz Yükleme Özelliği</h4>
                    <p className="text-gray-500 text-sm mb-4 max-w-xs mx-auto">
                      Kendi fotoğrafını veya bir arkadaşının fotoğrafını yükle, manken olarak kullan.
                    </p>
                    <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                      Çok Yakında
                    </button>
                  </div>
                )}
             </div>
          </div>

          {/* ADIM 3: SAHNE (PROMPT) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
              Sahne & Atmosfer
            </h3>
            <textarea 
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Örn: Paris'te yağmurlu bir sokakta, arkada flu mağaza ışıkları..."
              className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none min-h-[100px]"
            />
          </div>

        </div>

        {/* SAĞ KOLON: ÇEKİM */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="font-bold text-gray-900 mb-4">Prodüksiyon</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Kıyafet:</span>
                <span>{uploadedImage ? "✅ Hazır" : "❌ Bekleniyor"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Manken:</span>
                <span className={selectedModel ? "text-green-600 font-bold" : "text-red-500"}>
                  {selectedModel ? "✅ Seçildi" : "❌ Seçilmedi"}
                </span>
              </div>
              
              <hr className="border-gray-100"/>

              <button 
                onClick={handleGenerate}
                disabled={!uploadedImage || !selectedModel || processing}
                className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? "Motor Çalışıyor..." : "🎬 Kayıt! (1 Kredi)"}
              </button>
            </div>
          </div>

          {resultImage && (
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 animate-in fade-in zoom-in">
              <img src={resultImage} className="w-full rounded-lg shadow-sm" />
              <button className="w-full mt-3 bg-gray-100 text-gray-800 py-2 rounded-lg font-bold text-xs hover:bg-gray-200">
                Görseli İndir
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}