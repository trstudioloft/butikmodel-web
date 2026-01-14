"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GhostPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
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
      const fileName = `ghost-${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { alert("Yükleme hatası"); }
  };

  const handleGenerate = async () => {
    if (!user || !uploadedPath) return;
    setProcessing(true);
    setStatusMessage("Kredi kontrol ediliyor...");

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi!");
      
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. İŞLEMİ BAŞLAT (Tip: 'ghost')
      setStatusMessage("Hayalet manken oluşturuluyor...");
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      // Not: API tarafında 'ghost' tipini henüz işlemedik ama hazırlık olsun diye gönderiyoruz.
      // Yarın API'yi güncellediğimizde bu kısım çalışacak.
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          type: 'ghost', // İşlem tipi
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. TAKİP ET
      setStatusMessage("Manken siliniyor... (Yaklaşık 15sn)");
      const checkInterval = setInterval(async () => {
        const checkRes = await fetch(`/api/check?id=${prediction.id}`);
        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
          clearInterval(checkInterval);
          setResultImage(checkData.output);
          setStatusMessage("✅ İşlem Tamamlandı!");
          setProcessing(false);
          
          await supabase.from("generations").insert({
             user_id: user.id,
             input_image: uploadedPath,
             result_image: checkData.output,
             status: 'completed',
             model_id: 'ghost-mode'
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
           <h1 className="font-bold text-lg text-gray-800">Hayalet Manken <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-2">Beta</span></h1>
        </div>
        <div className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all ${resultImage ? "bg-green-100 text-green-700" : "bg-purple-50 text-purple-700"}`}>
            {statusMessage || (resultImage ? "Sonuç Hazır" : "Hazır")}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* SOL: YÜKLEME */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-800">1. Fotoğrafı Yükle</h3>
            <p className="text-xs text-gray-400 mb-4">Manken üzerinde çekilmiş kıyafet fotoğrafı yükleyin.</p>
            
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition overflow-hidden bg-gray-50 relative group">
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
               {uploadedImage ? (
                 <img src={uploadedImage} className="w-full h-full object-contain" />
               ) : (
                 <div className="text-center">
                    <span className="text-4xl block mb-2 opacity-30">👻</span>
                    <span className="text-gray-500 font-medium">Fotoğraf Seç</span>
                 </div>
               )}
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || processing}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {processing ? "Sihir Yapılıyor..." : "👻 Hayalete Çevir (1 Kredi)"}
          </button>
        </div>

        {/* SAĞ: SONUÇ */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[500px] relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#6b21a8 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           
           {resultImage ? (
             <div className="relative z-10 text-center">
                <img src={resultImage} className="max-h-[600px] shadow-2xl rounded-lg animate-in fade-in zoom-in duration-500" />
                <a href={resultImage} download className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg font-bold text-sm hover:bg-purple-700">
                  ⬇️ İndir
                </a>
             </div>
           ) : (
             <div className="text-center text-gray-400">
               <span className="text-6xl block mb-4 opacity-20">👕</span>
               <p>{statusMessage || "Fotoğrafı yükleyin ve mankeni yok edin."}</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}