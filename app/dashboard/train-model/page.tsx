"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TrainModelPage() {
  const [modelName, setModelName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleTrain = async () => {
    if (!modelName || files.length < 3) {
      alert("Lütfen bir isim girin ve en az 3 fotoğraf yükleyin.");
      return;
    }
    
    setProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. SİMÜLASYON: Resimler sunucuya gidiyor ve AI eğitiliyor...
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Veritabanına kaydet (İlk resim kapak fotosu olsun)
      // Gerçekte storage'a yükleyip o linki alırdık, şimdilik blob linki demo
      const demoCoverUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"; 

      const { error } = await supabase.from("custom_face_models").insert({
        user_id: session.user.id,
        name: modelName,
        cover_image: demoCoverUrl, 
        status: 'ready'
      });

      if (error) throw error;

      alert("🎉 Dijital İkiz Başarıyla Oluşturuldu!");
      router.push("/dashboard/studio"); // Stüdyoya geri dön

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 min-h-screen font-sans max-w-4xl mx-auto">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black mb-4">← Geri Dön</button>
        <h1 className="text-3xl font-bold text-gray-900">Dijital İkiz Yarat 🧬</h1>
        <p className="text-gray-500 mt-2">Kendini veya bir başkasını sisteme manken olarak tanıt.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* SOL: YÜKLEME ALANI */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <label className="block text-sm font-bold text-gray-700 mb-2">Manken Adı</label>
             <input 
               type="text" 
               value={modelName}
               onChange={(e) => setModelName(e.target.value)}
               placeholder="Örn: Burak, Ayşe..." 
               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
             />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-2">Fotoğraflar ({files.length}/10)</h3>
             <p className="text-xs text-gray-500 mb-4">Farklı açılardan (ön, yan, boydan) çekilmiş en az 3 fotoğraf yükle.</p>
             
             <div className="grid grid-cols-3 gap-2 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                    <img src={src} className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {files.length < 10 && (
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                    <span className="text-2xl text-gray-400">+</span>
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={handleTrain}
            disabled={processing || files.length < 3 || !modelName}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? "Yapay Zeka Eğitiliyor..." : "🧠 Analizi Başlat"}
          </button>
        </div>

        {/* SAĞ: REHBER */}
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 h-fit">
           <h3 className="text-xl font-bold text-blue-900 mb-4">Nasıl İyi Sonuç Alırsın?</h3>
           <ul className="space-y-4 text-sm text-blue-800">
             <li className="flex gap-3">
               <span className="bg-blue-200 text-blue-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs">1</span>
               <span><strong>Farklı Açılar:</strong> Sadece önden değil, yan profilden ve boydan fotoğraflar da ekle.</span>
             </li>
             <li className="flex gap-3">
               <span className="bg-blue-200 text-blue-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs">2</span>
               <span><strong>İyi Işık:</strong> Yüzün gölgede kalmasın. Gün ışığı en iyisidir.</span>
             </li>
             <li className="flex gap-3">
               <span className="bg-blue-200 text-blue-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs">3</span>
               <span><strong>Tek Kişi:</strong> Fotoğrafta yanında başkası olmasın.</span>
             </li>
             <li className="flex gap-3">
               <span className="bg-blue-200 text-blue-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs">4</span>
               <span><strong>Aksesuar Yok:</strong> Güneş gözlüğü veya şapka takmamaya çalış.</span>
             </li>
           </ul>
        </div>

      </div>
    </div>
  );
}