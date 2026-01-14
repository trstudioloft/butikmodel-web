"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Standart Mankenler (Herkesin göreceği)
const DEMO_MODELS = [
  { id: "demo-1", name: "Ayşe (Stüdyo)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", type: 'demo' },
  { id: "demo-2", name: "Burak (Sokak)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", type: 'demo' },
];

export default function ModelPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  
  // Tüm mankenlerin (Demo + Kullanıcı) tutulacağı liste
  const [allModels, setAllModels] = useState<any[]>(DEMO_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function initData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      // Kullanıcının yüklediği özel mankenleri çek
      const { data: userModels } = await supabase
        .from("user_models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (userModels && userModels.length > 0) {
        // Veritabanından gelenleri formatla
        const formattedUserModels = userModels.map((m: any) => ({
          id: m.id,
          name: m.name || "Özel Manken",
          url: m.image_url,
          type: 'user' // Bunların kullanıcıya ait olduğunu belirtelim
        }));

        // Listeyi birleştir: Önce Kullanıcınınkiler, Sonra Demolar
        setAllModels([...formattedUserModels, ...DEMO_MODELS]);
      }
    }
    initData();
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    setUploadedImage(URL.createObjectURL(file));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;
      setUploadedPath(fileName);
    } catch (e) { alert("Yükleme hatası"); }
  };

  const handleGenerate = async () => {
    if (!user || !uploadedPath || !selectedModel) return;
    setProcessing(true);
    setStatusMessage("Hazırlanıyor...");

    try {
      // 1. KREDİ KONTROLÜ
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (!profile || profile.credits < 1) throw new Error("Yetersiz Kredi!");
      
      await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", user.id);

      // 2. SEÇİLEN MANKENİN URL'İNİ BUL
      const targetModel = allModels.find(m => m.id === selectedModel);
      if (!targetModel) throw new Error("Manken bulunamadı");

      setStatusMessage("Yapay zeka başlatılıyor...");
      
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(uploadedPath);

      // API'ye hem kıyafeti hem de SEÇİLEN MANKENİ gönderiyoruz
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl, // Kıyafet
          modelUrl: targetModel.url, // <-- KRİTİK: Seçilen mankenin resmi
          userId: user.id
        }),
      });

      const prediction = await response.json();
      if (prediction.error) throw new Error(prediction.error);

      // 3. TAKİP SİSTEMİ
      setStatusMessage("Giydiriliyor... (Yaklaşık 20sn)");
      
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
             model_id: selectedModel,
             result_image: checkData.output,
             status: 'completed'
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
      {/* ÜST BAR */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <Link href="/dashboard" className="text-gray-500 font-bold hover:text-black">← Geri</Link>
        <div className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all ${resultImage ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}`}>
            {statusMessage || (resultImage ? "Sonuç Hazır" : "Stüdyo Modu")}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* SOL PANEL */}
        <div className="w-full lg:w-1/3 space-y-6 h-fit">
          
          {/* ADIM 1: KIYAFET */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-3 text-gray-800">1. Kıyafet Yükle</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition overflow-hidden bg-gray-50">
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
               {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-contain" /> : <span className="text-gray-400">Fotoğraf Seç +</span>}
            </div>
          </div>

          {/* ADIM 2: MANKEN SEÇİMİ (GÜNCELLENDİ) 🚀 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
               <h3 className="font-bold text-gray-800">2. Manken Seç</h3>
               <Link href="/dashboard/my-models" className="text-xs text-blue-600 font-bold hover:underline">+ Yeni Ekle</Link>
            </div>
            
            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {allModels.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedModel(m.id)} 
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${selectedModel === m.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100'}`}
                >
                  <img src={m.url} className="w-full h-full object-cover" />
                  {/* Kullanıcı Modeli Etiketi */}
                  {m.type === 'user' && (
                    <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm p-1 rounded-full">
                       <span className="text-xs text-white">👤</span>
                    </div>
                  )}
                  {/* Seçili İkonu */}
                  {selectedModel === m.id && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                       <div className="bg-white rounded-full p-1 shadow-lg"><span className="text-blue-600 font-bold">✓</span></div>
                    </div>
                  )}
                  <p className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] text-center p-1 truncate">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || !selectedModel || processing}
            className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {processing ? "İşleniyor..." : "✨ Manken Giydir (1 Kredi)"}
          </button>
        </div>

        {/* SAĞ PANEL (SONUÇ) */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[500px] relative overflow-hidden">
           {/* Arka Plan Deseni */}
           <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           
           {resultImage ? (
             <div className="relative z-10">
                <img src={resultImage} className="max-h-[600px] shadow-2xl rounded-lg animate-in fade-in zoom-in duration-500" />
                <a href={resultImage} download className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg font-bold text-sm hover:bg-gray-100">
                  ⬇️ İndir
                </a>
             </div>
           ) : (
             <div className="text-center text-gray-400">
               <span className="text-6xl block mb-4 opacity-20">📸</span>
               <p>{statusMessage || "Kıyafet ve manken seçip butona basın."}</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}