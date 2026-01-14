"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Temsili Manken Listesi
const MODELS = [
  { id: "model-1", name: "Ayşe (Stüdyo)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" },
  { id: "model-2", name: "Burak (Sokak)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop" },
  { id: "model-3", name: "Elif (Ofis)", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop" },
  { id: "model-4", name: "Can (Spor)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop" },
];

export default function ModelPage() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false); // Kredi düşme işlemi sürerken
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null); // Veritabanına gidecek dosya yolu
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Kullanıcıyı tanı
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      setUser(user);
    });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Supabase'e yükle
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) throw error;

      // Ekranda göstermek için
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(localUrl);
      setUploadedPath(fileName); // Kayıt için dosya yolunu sakla

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 🚀 SİHİRLİ FONKSİYON: SİPARİŞİ OLUŞTUR
  const handleGenerate = async () => {
    if (!user || !uploadedPath || !selectedModel) return;
    setProcessing(true);

    try {
      // 1. Krediyi Kontrol Et
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      
      if (!profile || profile.credits < 1) {
        alert("❌ Yetersiz Kredi! Lütfen kredi yükleyin.");
        setProcessing(false);
        return;
      }

      // 2. Krediyi Düş
      const { error: creditError } = await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", user.id);

      if (creditError) throw creditError;

      // 3. Siparişi Kaydet (Generations Tablosuna)
      const { error: genError } = await supabase.from("generations").insert({
        user_id: user.id,
        input_image: uploadedPath,
        model_id: selectedModel,
        status: 'processing' // İşlemde olarak işaretle
      });

      if (genError) throw genError;

      alert("✅ Sipariş alındı! Krediniz düştü. İşlem başlatılıyor...");
      
      // (Burada ileride kullanıcıyı sonuç sayfasına yönlendireceğiz)
      // Şimdilik sayfayı yenileyelim ki kredi düştüğünü görsün
      window.location.reload();

    } catch (error: any) {
      alert("❌ Bir hata oluştu: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-black transition flex items-center gap-1">
            <span>←</span> Geri
          </Link>
          <h1 className="font-bold text-lg">AI Manken Stüdyosu</h1>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {processing ? "İşleniyor..." : selectedModel ? "Hazır" : "Bekleniyor"}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        
        {/* SOL PANEL */}
        <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto h-full pb-20">
          
          {/* KIYAFET YÜKLEME */}
          <div className={`bg-white p-6 rounded-2xl border transition-all ${uploadedImage ? 'border-green-500 ring-1 ring-green-100' : 'border-blue-500 shadow-lg'}`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
              Kıyafetini Yükle
            </h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-50">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> : 
               uploadedImage ? <img src={uploadedImage} className="w-12 h-12 rounded object-cover" /> : 
               <span className="text-sm font-bold text-gray-600">Fotoğraf Seç 📤</span>}
            </div>
          </div>

          {/* MANKEN SEÇİMİ */}
          <div className={`bg-white p-6 rounded-2xl border transition-all ${!uploadedImage ? 'opacity-50 pointer-events-none' : selectedModel ? 'border-green-500 ring-1 ring-green-100' : 'border-blue-500 shadow-lg'}`}>
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">2</span>
              Manken Seç
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {MODELS.map((model) => (
                <div key={model.id} onClick={() => setSelectedModel(model.id)} className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedModel === model.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-100'}`}>
                  <img src={model.url} className="w-full h-32 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1"><p className="text-white text-[10px] text-center">{model.name}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* SİPARİŞ BUTONU */}
          <button 
            onClick={handleGenerate}
            disabled={!uploadedImage || !selectedModel || processing}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${
              uploadedImage && selectedModel && !processing
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-200 cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {processing ? "Sipariş Oluşturuluyor..." : "✨ Manken Giydir (1 Kredi)"}
          </button>

        </div>

        {/* SAĞ PANEL: ÖNİZLEME */}
        <div className="w-full lg:w-2/3 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[500px]">
             {uploadedImage && selectedModel ? (
               <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <img src={uploadedImage} className="w-24 h-24 object-contain rounded-lg border-2 border-white shadow-lg bg-white" />
                    <span className="text-2xl">➡️</span>
                    <img src={MODELS.find(m => m.id === selectedModel)?.url} className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Her şey hazır!</h3>
                  <p className="text-gray-500">Butona bastığında 1 kredin düşecek ve işlem başlayacak.</p>
               </div>
            ) : <p className="text-gray-400">Seçimleri tamamla...</p>}
        </div>

      </div>
    </div>
  );
}