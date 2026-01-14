"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CopywriterPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  
  // Sonuç bu sefer resim değil, metin olacak
  const [resultText, setResultText] = useState<string | null>(null);
  
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
      const fileName = `copy-${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { alert("Yükleme hatası"); }
  };

  const handleGenerate = async () => {
    if (!user || !uploadedPath) return;
    setProcessing(true);
    setStatusMessage("Kredi kontrol ediliyor...");
    setResultText(null);

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi!");
      
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. İŞLEMİ BAŞLAT
      setStatusMessage("Yapay zeka ürünü inceliyor...");
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          type: 'copywriter', // TÜR: METİN YAZARI
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. TAKİP ET
      setStatusMessage("Metin yazılıyor... (Yaklaşık 10sn)");
      
      const checkInterval = setInterval(async () => {
        const checkRes = await fetch(`/api/check?id=${prediction.id}`);
        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
          clearInterval(checkInterval);
          
          // LLaVA modeli çıktıyı dizi (array) olarak döndürür, birleştiriyoruz.
          const textOutput = Array.isArray(checkData.output) ? checkData.output.join("") : checkData.output;
          
          setResultText(textOutput);
          setStatusMessage("✅ Açıklama Hazır!");
          setProcessing(false);
          
          // Veritabanına kaydet (Not: result_image sütununa metin kaydediyoruz şimdilik, sorun olmaz)
          await supabase.from("generations").insert({
             user_id: user.id,
             input_image: uploadedPath,
             result_image: "metin-cikti", // Metin olduğu için temsili
             status: 'completed',
             model_id: 'copywriter'
          });

        } else if (checkData.status === "failed") {
          clearInterval(checkInterval);
          setStatusMessage("❌ İşlem başarısız.");
          setProcessing(false);
        }
      }, 2000);

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
           <h1 className="font-bold text-lg text-gray-800">Metin Yazarı <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">Beta</span></h1>
        </div>
        <div className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all ${resultText ? "bg-green-100 text-green-700" : "bg-green-50 text-green-700"}`}>
            {statusMessage || (resultText ? "Yazı Hazır" : "Hazır")}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* SOL: YÜKLEME */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-800">1. Ürün Fotoğrafı</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition overflow-hidden bg-gray-50 relative group">
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
               {uploadedImage ? (
                 <img src={uploadedImage} className="w-full h-full object-contain" />
               ) : (
                 <div className="text-center">
                    <span className="text-4xl block mb-2 opacity-30">✍️</span>
                    <span className="text-gray-500 font-medium">Fotoğraf Seç</span>
                 </div>
               )}
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || processing}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {processing ? "İnceleniyor..." : "📝 Açıklama Yaz (1 Kredi)"}
          </button>
        </div>

        {/* SAĞ: SONUÇ (METİN KUTUSU) */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col p-6 min-h-[500px]">
           <h3 className="font-bold text-gray-800 mb-4">Ürün Açıklaması</h3>
           
           {resultText ? (
             <div className="flex-1 flex flex-col">
                <textarea 
                  className="w-full h-full flex-1 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
                  value={resultText}
                  readOnly
                ></textarea>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => navigator.clipboard.writeText(resultText)}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 flex items-center gap-2"
                  >
                    📋 Kopyala
                  </button>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
               <div>
                 <span className="text-6xl block mb-4 opacity-20">📄</span>
                 <p>{statusMessage || "Fotoğrafı yükleyin, satış açıklamasını yapay zeka yazsın."}</p>
               </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}