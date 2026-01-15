"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Supabase ayar dosyanın burada olduğunu varsayıyorum
import Link from "next/link";
import { useRouter } from "next/navigation";

// Standart Mankenler
const DEMO_MODELS = [
  { id: "demo-1", name: "Stüdyo (Kadın)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", type: 'demo' },
  { id: "demo-2", name: "Sokak (Erkek)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", type: 'demo' },
  { id: "demo-3", name: "Moda (Kadın)", url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop", type: 'demo' },
  { id: "demo-4", name: "Casual (Erkek)", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop", type: 'demo' },
];

export default function StudioPage() {
  // --- MANTIK KISMI (ESKİ KODUNDAN ALINDI) ---
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Dosyalar
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Mankenler
  const [allModels, setAllModels] = useState<any[]>(DEMO_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Başlangıç Verilerini Çek
  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);

      // Kullanıcının özel mankenlerini çek (Varsa)
      const { data: userModels } = await supabase
        .from("user_models") // NOT: Bu tablo veritabanında yoksa hata vermez, boş döner.
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (userModels && userModels.length > 0) {
        const formattedUserModels = userModels.map((m: any) => ({
          id: m.id,
          name: m.name || "Özel Manken",
          url: m.image_url,
          type: 'user'
        }));
        setAllModels([...formattedUserModels, ...DEMO_MODELS]);
      }
    }
    initData();
  }, [router]);

  // Dosya Yükleme Fonksiyonu
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    // Ekranda hemen göster
    setUploadedImage(URL.createObjectURL(file));

    try {
      // Supabase'e Gerçek Yükleme
      const fileExt = file.name.split('.').pop();
      const fileName = `studio-${Math.random()}.${fileExt}`;
      
      // DİKKAT: Burada 'uploads' bucket'ı şart!
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      
      if (error) {
        console.error("Yükleme hatası:", error);
        alert("Resim yüklenemedi! Lütfen Supabase'de 'uploads' bucket'ının açık olduğundan emin olun.");
        return;
      }
      
      setUploadedPath(fileName);
    } catch (e) { 
      console.error(e);
      alert("Yükleme sırasında bir hata oluştu."); 
    }
  };

  // Üretim Fonksiyonu
  const handleGenerate = async () => {
    if (!user || !uploadedPath || !selectedModel) return;
    setProcessing(true);
    setStatusMessage("Kredi kontrol ediliyor...");

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi! Lütfen kredi yükleyin.");
      
      // Krediyi düş (Şimdilik API çağrısından önce düşüyoruz)
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. MANKENİ VE KIYAFETİ HAZIRLA
      const targetModel = allModels.find(m => m.id === selectedModel);
      if (!targetModel) throw new Error("Seçilen manken bulunamadı.");

      setStatusMessage("Yapay zeka motoru çalışıyor...");
      
      // Kıyafetin Public Linkini Al
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      // API'ye İstek At (API rotasının var olduğunu varsayıyoruz)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl, // Kıyafet
          modelUrl: targetModel.url, // Manken
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. SONUCU BEKLE (Polling)
      setStatusMessage("Fotoğraf işleniyor... (Ort. 20sn)");
      
      const checkInterval = setInterval(async () => {
        const checkRes = await fetch(`/api/check?id=${prediction.id}`);
        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
          clearInterval(checkInterval);
          setResultImage(checkData.output);
          setStatusMessage("✅ İşlem Başarılı!");
          setProcessing(false);
          
          // Kayıt
          await supabase.from("generations").insert({
             user_id: user.id,
             input_image: uploadedPath,
             model_id: selectedModel,
             result_image: checkData.output,
             status: 'completed'
          });
        } else if (checkData.status === "failed") {
          clearInterval(checkInterval);
          setStatusMessage("❌ İşlem başarısız oldu.");
          setProcessing(false);
          // Krediyi iade etme mantığı buraya eklenebilir
        }
      }, 3000);

    } catch (error: any) {
      alert("Hata: " + error.message);
      setProcessing(false);
      setStatusMessage("");
    }
  };

  // --- GÖRÜNÜM KISMI (YENİ TASARIM) ---
  return (
    <div className="p-8 min-h-screen pb-20 font-sans">
      
      {/* BAŞLIK & DURUM */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Manken Stüdyosu ✨</h1>
          <p className="text-gray-500 mt-2">Kıyafet fotoğrafını yükle, modelini seç, gerisini yapay zekaya bırak.</p>
        </div>
        {statusMessage && (
           <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
             {statusMessage}
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: İŞLEM ALANI (2 birim) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ADIM: Kıyafet Yükleme */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              Kıyafet Fotoğrafı
            </h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${uploadedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
                className="hidden"
                accept="image/*"
              />
              
              {uploadedImage ? (
                <div className="relative h-64 w-full">
                  <img src={uploadedImage} alt="Yüklenen Kıyafet" className="h-full w-full object-contain rounded-lg shadow-sm" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold shadow">Yüklendi</div>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">👕</div>
                  <p className="text-gray-600 font-medium">Kıyafet Fotoğrafını Seç</p>
                  <p className="text-gray-400 text-xs mt-2">Net ve aydınlık çekimler daha iyi sonuç verir.</p>
                </>
              )}
            </div>
          </div>

          {/* 2. ADIM: Manken Seçimi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                  Manken Seçimi
                </h3>
                <Link href="/dashboard/my-models" className="text-xs text-blue-600 font-bold hover:underline">+ Yeni Yüz Ekle</Link>
             </div>
             
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allModels.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`aspect-[3/4] rounded-xl cursor-pointer relative overflow-hidden border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-4 ring-blue-50 shadow-lg scale-105' : 'border-transparent hover:border-gray-300 bg-gray-100'}`}
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  
                  {/* Model İsmi */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2">
                    <p className="text-white text-xs text-center font-medium truncate">{m.name}</p>
                  </div>

                  {/* Seçildi İşareti */}
                  {selectedModel === m.id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">✓</div>
                  )}
                  
                  {/* Kullanıcı Modeli Rozeti */}
                  {m.type === 'user' && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md">Özel</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: KONTROL VE SONUÇ (1 birim) */}
        <div className="space-y-6">
          
          {/* Kontrol Paneli */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Üretim Paneli</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Durum:</span>
                <span className={`font-bold ${uploadedImage && selectedModel ? 'text-green-600' : 'text-orange-500'}`}>
                  {uploadedImage && selectedModel ? 'Hazır ✅' : 'Seçim Bekleniyor ⏳'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                 <span>Maliyet:</span>
                 <span className="font-bold text-gray-900">1 Kredi</span>
              </div>
              
              <button 
                onClick={handleGenerate}
                disabled={!uploadedImage || !selectedModel || processing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                   <>Processing...</>
                ) : (
                   <><span>✨</span> Manken Üret</>
                )}
              </button>
            </div>
          </div>
          
          {/* SONUÇ KUTUSU (Varsa Göster) */}
          {resultImage && (
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">🎉 Sonuç Hazır!</h3>
              <img src={resultImage} className="w-full rounded-lg shadow-sm mb-3" />
              <a href={resultImage} download className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                ⬇️ İndir
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}