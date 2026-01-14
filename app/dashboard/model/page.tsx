"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ModelPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. DOSYA YÜKLEME FONKSİYONU
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(true);

    try {
      // Dosya adını benzersiz yap
      const fileExt = file.name.split('.').pop();
      const fileName = `temp-${Date.now()}.${fileExt}`;

      // Supabase'e gönder
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (error) throw error;

      // Yüklenen resmin linkini al (Ekranda göstermek için)
      // Not: Normalde public URL alırız ama şimdilik local object URL ile hızlı gösterelim
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(localUrl);

      alert("✅ Kıyafet yüklendi! Şimdi manken seçimi yapabilirsiniz.");

    } catch (error: any) {
      alert("❌ Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ÜST BAR (Geri Dön Butonlu) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-black transition">
            ← Geri Dön
          </Link>
          <h1 className="font-bold text-lg">AI Manken Stüdyosu</h1>
        </div>
        <div className="text-sm text-gray-500">Adım 1/3</div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* SOL PANEL: AYARLAR VE YÜKLEME */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* 1. KUTU: KIYAFET YÜKLEME */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
              Kıyafetini Yükle
            </h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${uploadedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              
              {uploading ? (
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : uploadedImage ? (
                <div>
                   <div className="text-green-600 font-bold mb-1">✅ Yüklendi</div>
                   <p className="text-xs text-gray-500">Değiştirmek için tıkla</p>
                </div>
              ) : (
                <>
                  <span className="text-3xl mb-2">📤</span>
                  <span className="text-sm font-medium text-gray-600">Fotoğraf Seç veya Sürükle</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                </>
              )}
            </div>
          </div>

          {/* 2. KUTU: MANKEN SEÇİMİ (Şimdilik Demo) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm opacity-50 cursor-not-allowed">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Manken Seç
            </h3>
            <p className="text-sm text-gray-400">Önce kıyafet yükleyin.</p>
          </div>

          {/* OLUŞTUR BUTONU */}
          <button disabled className="w-full py-4 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed">
            Fotoğrafı Oluştur (1 Kredi)
          </button>

        </div>

        {/* SAĞ PANEL: ÖNİZLEME ALANI */}
        <div className="w-full lg:w-2/3 bg-gray-200 rounded-2xl border-2 border-gray-300 border-dashed flex items-center justify-center min-h-[500px] relative overflow-hidden">
            {uploadedImage ? (
                // Kullanıcı resim yüklediyse onu göster
                <img src={uploadedImage} alt="Yüklenen" className="max-h-full max-w-full object-contain shadow-2xl" />
            ) : (
                // Yüklemediyse boş durmasın diye mesaj göster
                <div className="text-center text-gray-400">
                    <span className="text-6xl block mb-4">👗</span>
                    <p>Sol taraftan kıyafetinizi yükleyin,<br/>sonucu burada göreceksiniz.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}