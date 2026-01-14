"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Temsili Manken Listesi (Şimdilik Demo için sabit manken linki kullanacağız)
const MODELS = [
  { id: "model-1", name: "Ayşe (Stüdyo)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" },
  { id: "model-2", name: "Burak (Sokak)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop" },
];

export default function ModelPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Kullanıcıya bilgi vermek için
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null); // Sonuç resmi
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      setUser(user);
    });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    // 1. Hızlı Önizleme
    setUploadedImage(URL.createObjectURL(file));

    // 2. Supabase'e Yükle
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`; // Basit isimlendirme
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { alert("Yükleme hatası"); }
  };

  const handleGenerate = async () => {
    if (!user || !uploadedPath || !selectedModel) return;
    setProcessing(true);
    setStatusMessage("Kredi kontrol ediliyor...");

    try {
      // 1. KREDİ DÜŞME İŞLEMİ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi!");
      
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. REPLICATE İŞLEMİNİ BAŞLAT
      setStatusMessage("Yapay zeka başlatılıyor...");
      
      // Resmin Public URL'ini al (Replicate'e göndermek için)
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          modelId: selectedModel,
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. SORGULAMA DÖNGÜSÜ (POLLING)
      setStatusMessage("Manken giydiriliyor... (Bu işlem 20sn sürebilir)");
      
      let checkCount = 0;
      const checkInterval = setInterval(async () => {
        checkCount++;
        const checkRes = await fetch(`/api/check?id=${prediction.id}`);
        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
          clearInterval(checkInterval);
          setResultImage(checkData.output); // Sonucu Göster!
          setStatusMessage("✅ İşlem Tamamlandı!");
          setProcessing(false);
          
          // Veritabanına sonucu kaydet
          await supabase.from("generations").insert({
             user_id: user.id,
             input_image: uploadedPath,
             model_id: selectedModel,
             result_image: checkData.output, // Sonuç linki
             status: 'completed'
          });

        } else if (checkData.status === "failed") {
          clearInterval(checkInterval);
          setStatusMessage("❌ İşlem başarısız oldu.");
          setProcessing(false);
          // İade yapabilirsin burada
        } else {
          setStatusMessage(`İşleniyor... (${checkCount * 2}sn)`);
        }
      }, 2000); // 2 saniyede bir sor

    } catch (error: any) {
      alert("Hata: " + error.message);
      setProcessing(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ÜST BAR */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-500 font-bold">← Geri</Link>
        <div className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
            {statusMessage || (resultImage ? "Sonuç Hazır!" : "Stüdyo")}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-8">
        
        {/* SOL PANEL */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* YÜKLEME */}
          <div onClick={() => fileInputRef.current?.click()} className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 text-center">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
             {uploadedImage ? <img src={uploadedImage} className="h-40 mx-auto object-contain" /> : "Fotoğraf Seç"}
          </div>

          {/* MANKEN SEÇİMİ */}
          <div className="grid grid-cols-2 gap-2">
            {MODELS.map(m => (
              <div key={m.id} onClick={() => setSelectedModel(m.id)} className={`border-2 rounded-xl overflow-hidden cursor-pointer ${selectedModel === m.id ? 'border-blue-600' : 'border-gray-200'}`}>
                <img src={m.url} className="h-24 w-full object-cover" />
              </div>
            ))}
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || !selectedModel || processing}
            className="w-full py-4 bg-black text-white rounded-xl font-bold disabled:bg-gray-300"
          >
            {processing ? "Lütfen Bekleyin..." : "✨ Giydir (1 Kredi)"}
          </button>
        </div>

        {/* SAĞ PANEL (SONUÇ) */}
        <div className="w-full lg:w-2/3 bg-gray-200 rounded-2xl flex items-center justify-center min-h-[500px]">
           {resultImage ? (
             <img src={resultImage} className="max-h-[600px] shadow-2xl rounded-lg animate-in fade-in" />
           ) : (
             <p className="text-gray-500">{statusMessage || "Sonuç burada görünecek..."}</p>
           )}
        </div>

      </div>
    </div>
  );
}