"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

// Temsili Manken Listesi (Şimdilik internetten rastgele örnekler)
const MODELS = [
  { id: "model-1", name: "Ayşe (Stüdyo)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" },
  { id: "model-2", name: "Burak (Sokak)", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop" },
  { id: "model-3", name: "Elif (Ofis)", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop" },
  { id: "model-4", name: "Can (Spor)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop" },
];

export default function ModelPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `temp-${Date.now()}.${fileExt}`;

      // Gerçek yükleme yerine hızlı önizleme (Hız kazandırmak için)
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(localUrl);

      // Arka planda sessizce Supabase'e de atalım
      supabase.storage.from('uploads').upload(fileName, file);

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ÜST BAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-black transition flex items-center gap-1">
            <span>←</span> Geri
          </Link>
          <h1 className="font-bold text-lg">AI Manken Stüdyosu</h1>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {selectedModel ? "3. Adım: Başlat" : uploadedImage ? "2. Adım: Manken Seç" : "1. Adım: Yükle"}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        
        {/* SOL PANEL: İŞLEMLER */}
        <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto h-full pb-20">
          
          {/* 1. ADIM: KIYAFET YÜKLEME */}
          <div className={`bg-white p-6 rounded-2xl border transition-all duration-300 ${uploadedImage ? 'border-green-500 shadow-md ring-1 ring-green-100' : 'border-blue-500 shadow-lg ring-2 ring-blue-100'}`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${uploadedImage ? 'bg-green-600' : 'bg-black'}`}>1</span>
              Kıyafetini Yükle
            </h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer transition ${uploadedImage ? 'border-green-200 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              
              {uploading ? (
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : uploadedImage ? (
                <div className="flex items-center gap-3">
                   <img src={uploadedImage} className="w-12 h-12 rounded object-cover border border-green-200" />
                   <div className="text-left">
                     <div className="text-green-700 font-bold text-sm">Seçildi</div>
                     <p className="text-xs text-green-600">Değiştirmek için tıkla</p>
                   </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-2xl block mb-1">📤</span>
                  <span className="text-sm font-bold text-gray-600">Fotoğraf Seç</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. ADIM: MANKEN SEÇİMİ */}
          <div className={`bg-white p-6 rounded-2xl border transition-all duration-300 ${!uploadedImage ? 'opacity-50 pointer-events-none border-gray-200' : selectedModel ? 'border-green-500 ring-1 ring-green-100' : 'border-blue-500 shadow-lg ring-2 ring-blue-100'}`}>
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${selectedModel ? 'bg-green-600' : 'bg-black'}`}>2</span>
              Manken Seç
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {MODELS.map((model) => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedModel === model.id ? 'border-blue-600 ring-2 ring-blue-200 scale-105' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={model.url} alt={model.name} className="w-full h-32 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2">
                    <p className="text-white text-xs font-bold text-center">{model.name}</p>
                  </div>
                  {selectedModel === model.id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. ADIM: OLUŞTUR BUTONU */}
          <button 
            disabled={!uploadedImage || !selectedModel}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${
              uploadedImage && selectedModel 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-200 cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {uploadedImage && selectedModel ? "✨ Manken Giydir (1 Kredi)" : "Önce Seçimleri Tamamla"}
          </button>

        </div>

        {/* SAĞ PANEL: CANLI ÖNİZLEME */}
        <div className="w-full lg:w-2/3 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
            
            {/* Arka Plan Deseni */}
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

            {uploadedImage && selectedModel ? (
               <div className="relative z-10 text-center animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <img src={uploadedImage} className="w-24 h-24 object-contain rounded-lg border-2 border-white shadow-lg bg-white" />
                    <span className="text-2xl">➡️</span>
                    <img src={MODELS.find(m => m.id === selectedModel)?.url} className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Hazır mısın?</h3>
                  <p className="text-gray-500">Seçtiğin kıyafet, bu mankene giydirilecek.</p>
               </div>
            ) : uploadedImage ? (
                <div className="text-center text-gray-400 animate-pulse">
                    <span className="text-4xl block mb-2">👆</span>
                    <p>Şimdi sol taraftan bir manken seç.</p>
                </div>
            ) : (
                <div className="text-center text-gray-400">
                    <span className="text-6xl block mb-4">👗</span>
                    <p>Sol taraftan kıyafetini yükle,<br/>sihri başlat.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}