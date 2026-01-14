"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudioPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(""); // Kullanıcının hayali (Prompt)
  const [resultImage, setResultImage] = useState<string | null>(null);
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
    setUploadedImage(URL.createObjectURL(file));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `studio-${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { alert("Yükleme hatası"); }
  };

  const handleGenerate = async () => {
    if (!user || !uploadedPath || !prompt) return;
    setProcessing(true);
    setStatusMessage("Kredi kontrol ediliyor...");

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi!");
      
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. İŞLEMİ BAŞLAT
      setStatusMessage("Sahne kuruluyor...");
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          type: 'studio', // TÜR: STÜDYO
          prompt: prompt, // Kullanıcının isteği
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. TAKİP ET
      setStatusMessage("Fotoğraf çekiliyor... (Yaklaşık 20sn)");
      
      const checkInterval = setInterval(async () => {
        const checkRes = await fetch(`/api/check?id=${prediction.id}`);
        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
          clearInterval(checkInterval);
          setResultImage(checkData.output);
          setStatusMessage("✅ Stüdyo Çekimi Hazır!");
          setProcessing(false);
          
          await supabase.from("generations").insert({
             user_id: user.id,
             input_image: uploadedPath,
             result_image: checkData.output,
             status: 'completed',
             model_id: 'studio-mode'
          });

        } else if (checkData.status === "failed") {
          clearInterval(checkInterval);
          setStatusMessage("❌ İşlem başarısız.");
          setProcessing(false);
        }
      }, 3000);

    } catch (error: any) {
      alert("Hata: " + error.message);
      setProcessing(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <Link href="/dashboard" className="text-gray-500 font-bold hover:text-black">← Geri</Link>
           <h1 className="font-bold text-lg text-gray-800">AI Stüdyo <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full ml-2">Beta</span></h1>
        </div>
        <div className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all ${resultImage ? "bg-green-100 text-green-700" : "bg-orange-50 text-orange-700"}`}>
            {statusMessage || (resultImage ? "Çekim Tamamlandı" : "Hazır")}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* SOL: AYARLAR */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* 1. RESİM YÜKLE */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-800">1. Ürün Fotoğrafı</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition overflow-hidden bg-gray-50 relative group">
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
               {uploadedImage ? (
                 <img src={uploadedImage} className="w-full h-full object-contain" />
               ) : (
                 <div className="text-center">
                    <span className="text-4xl block mb-2 opacity-30">📸</span>
                    <span className="text-gray-500 font-medium">Fotoğraf Seç</span>
                 </div>
               )}
            </div>
          </div>

          {/* 2. PROMPT GİRİŞİ */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-2 text-gray-800">2. Nerede Çekilsin?</h3>
            <p className="text-xs text-gray-400 mb-3">İngilizce yazarsanız daha iyi sonuç verir.</p>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: on a white marble table, sunlight, professional photography..."
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none h-24 text-sm"
            ></textarea>
            
            {/* Hazır Öneriler */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
               <button onClick={() => setPrompt("on a wooden table, cozy atmosphere")} className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-200">🪵 Ahşap Masa</button>
               <button onClick={() => setPrompt("on a white podium, studio lighting, minimal")} className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-200">⬜️ Beyaz Podyum</button>
               <button onClick={() => setPrompt("on a rock, beach background, sunny day")} className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-200">🏖️ Sahil</button>
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || !prompt || processing}
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {processing ? "Stüdyo Hazırlanıyor..." : "📸 Fotoğrafı Çek (1 Kredi)"}
          </button>
        </div>

        {/* SAĞ: SONUÇ */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[500px] relative overflow-hidden">
           {resultImage ? (
             <div className="relative z-10 text-center">
                <img src={resultImage} className="max-h-[600px] shadow-2xl rounded-lg animate-in fade-in zoom-in duration-500" />
                <a href={resultImage} download className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg shadow-lg font-bold text-sm hover:bg-orange-700">
                  ⬇️ İndir
                </a>
             </div>
           ) : (
             <div className="text-center text-gray-400">
               <span className="text-6xl block mb-4 opacity-20">🏞️</span>
               <p>{statusMessage || "Fotoğrafı yükleyin, mekanı tarif edin."}</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}