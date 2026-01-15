"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Standart Mankenler
const DEMO_MODELS = [
  { id: "demo-1", name: "Stüdyo (Kadın)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", type: 'demo' },
  { id: "demo-2", name: "Sokak (Erkek)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", type: 'demo' },
];

export default function StudioPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // State'ler
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState(""); // YENİ: Kullanıcının Türkçe Tarifi
  
  const [allModels, setAllModels] = useState<any[]>(DEMO_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Verileri Çek
  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      const { data: userModels } = await supabase
        .from("user_models")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (userModels && userModels.length > 0) {
        const formattedUserModels = userModels.map((m: any) => ({
          id: m.id,
          name: m.name || "Özel Manken",
          url: m.image_url,
          attributes: m.attributes, // Mankenin özelliklerini de alıyoruz
          type: 'user'
        }));
        setAllModels([...formattedUserModels, ...DEMO_MODELS]);
      }
    }
    initData();
  }, [router]);

  // Dosya Yükleme
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `studio-${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { 
      alert("Resim yüklenirken hata oluştu."); 
    }
  };

  // Üretim Mantığı
  const handleGenerate = async () => {
    if (!user || !uploadedPath || !selectedModel) return;
    setProcessing(true);
    setStatusMessage("Senaryo oluşturuluyor...");

    try {
      // 1. MANKEN BİLGİLERİNİ AL
      const targetModel = allModels.find(m => m.id === selectedModel);
      
      // 2. PROMPT MÜHENDİSLİĞİ (TÜRKÇE -> İNGİLİZCE ÇEVİRİSİ BURADA OLACAK)
      // Mankenin fiziksel özelliklerini prompta ekliyoruz ki tutarlı olsun.
      let modelDescription = "fashion model";
      if (targetModel.attributes) {
        const a = targetModel.attributes;
        modelDescription = `${a.age} year old ${a.ethnicity} ${a.gender}, ${a.bodySize}, ${a.hairStyle} ${a.hairColor} hair`;
      }

      // Kullanıcının yazdığı Türkçe sahne tarifini "Hayali" olarak çeviriyoruz (API bağlanınca burası otomatik olacak)
      const sceneDescription = userPrompt ? userPrompt : "studio background, professional lighting";
      
      const finalPrompt = `Professional photo of a ${modelDescription} wearing the uploaded cloth. Scene: ${sceneDescription}. High quality, 8k, photorealistic.`;
      
      console.log("🚀 YAPAY ZEKAYA GİDEN SÜPER KOMUT:", finalPrompt);

      // 3. İŞLEM SİMÜLASYONU
      setStatusMessage("Sahne kuruluyor: " + (userPrompt || "Stüdyo Ortamı"));
      
      // Kredi düşme vb. işlemleri burada
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile && profile.credits > 0) {
        await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);
      }

      // 4. SONUCU BEKLE (Simüle edilmiş bekleme)
      setTimeout(() => {
        setResultImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"); // Örnek Sonuç
        setStatusMessage("✅ Çekim Tamamlandı!");
        setProcessing(false);
      }, 3000);

    } catch (error: any) {
      alert("Hata: " + error.message);
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 min-h-screen pb-20 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yönetmen Koltuğu 🎬</h1>
        <p className="text-gray-500 mt-2">Mankenini seç, kıyafetini giydir ve sahneyi tarif et.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: GİRDİLER (2 birim) */}
        <div className="lg:col-span-2 space-y-6">
          
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

          {/* ADIM 2: MANKEN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                  Oyuncu Seçimi (Manken)
                </h3>
                <Link href="/dashboard/my-models" className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold hover:bg-gray-200">
                   + Yeni Karakter Yarat
                </Link>
             </div>
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {allModels.map((m) => (
                <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedModel === m.id ? 'border-blue-600 ring-2 ring-blue-100 scale-105' : 'border-transparent hover:border-gray-200'}`}>
                  <img src={m.url} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] p-1 text-center truncate">{m.name}</div>
                  {m.type === 'user' && <div className="absolute top-1 right-1 bg-purple-600 text-white text-[8px] px-1.5 rounded">ÖZEL</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ADIM 3: SAHNE (PROMPT) - YENİ ÖZELLİK 🚀 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
              Sahne & Atmosfer (Opsiyonel)
            </h3>
            
            <textarea 
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Örn: Paris'te yağmurlu bir sokakta, arkada flu mağaza ışıkları, gün batımı tonları..."
              className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none min-h-[100px]"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">Türkçe yazabilirsin, AI anlayacaktır. ✨</p>
          </div>

        </div>

        {/* SAĞ KOLON: ÇEKİM (1 birim) */}
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
                <span>{selectedModel ? "✅ Seçildi" : "❌ Bekleniyor"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sahne:</span>
                <span className="truncate max-w-[100px] text-right">{userPrompt ? "✅ Özel" : "Stüdyo"}</span>
              </div>

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