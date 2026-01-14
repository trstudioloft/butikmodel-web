"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Yükleniyor animasyonu için
  const fileInputRef = useRef<HTMLInputElement>(null); // Dosya seçiciyi kontrol etmek için
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (profile) setCredits(profile.credits);
      setLoading(false);
    }
    getData();
  }, [router]);

  // ÇIKIŞ YAP
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // KUTUYA TIKLAYINCA DOSYA SEÇİCİYİ AÇ
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // DOSYA SEÇİLİNCE ÇALIŞAN FONKSİYON
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(true);

    try {
      // 1. Dosya ismini benzersiz yap (çakışmasın diye tarih ekle)
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Supabase Storage'a Yükle
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      alert("✅ Fotoğraf başarıyla yüklendi!");
      
      // Buraya daha sonra veritabanına kaydetme işlemi gelecek...

    } catch (error: any) {
      alert("❌ Yükleme hatası: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl">Butikmodel Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            💰 {credits} Kredi
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black">Çıkış Yap</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hoş geldin, {user?.email?.split('@')[0]} 👋</h1>
          <p className="text-gray-500">Yeni bir çekim başlatmak için aşağıdan fotoğraf yükle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* YÜKLEME KUTUSU (TIKLANABİLİR) */}
          <div 
            onClick={handleBoxClick}
            className={`bg-white p-8 rounded-2xl border-2 border-dashed ${uploading ? 'border-yellow-400 bg-yellow-50' : 'border-blue-200 hover:border-blue-500'} flex flex-col items-center justify-center text-center transition cursor-pointer group relative`}
          >
            {/* Gizli Dosya Seçici */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg"
            />

            {uploading ? (
              // YÜKLENİYORSA DÖNEN TEKERLEK GÖSTER
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600 mb-4"></div>
            ) : (
              // NORMAL DURUM
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                <span className="text-3xl text-blue-600 group-hover:text-white transition">+</span>
              </div>
            )}
            
            <h3 className="font-bold text-lg">{uploading ? "Yükleniyor..." : "Yeni Fotoğraf Yükle"}</h3>
            <p className="text-sm text-gray-400 mt-2">{uploading ? "Lütfen bekleyin" : "JPG veya PNG"}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-50">
            <h3 className="font-bold text-gray-400">Geçmiş Çekimler</h3>
            <p className="text-sm text-gray-400 mt-2">Henüz fotoğraf yok.</p>
          </div>
        </div>
      </main>
    </div>
  );
}