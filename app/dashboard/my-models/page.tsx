"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MyModelsPage() {
  const [user, setUser] = useState<any>(null);
  const [faces, setFaces] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 1. Sayfa açılınca verileri çek
  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      // Kayıtlı yüzleri getir
      const { data } = await supabase
        .from("user_models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setFaces(data);
      setLoading(false);
    }
    getData();
  }, [router]);

  // 2. Yeni Yüz Yükleme Fonksiyonu
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setUploading(true);

    try {
      // A. Dosyayı Storage'a Yükle
      const fileExt = file.name.split('.').pop();
      const fileName = `face-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, file);
      if (uploadError) throw uploadError;

      // B. Public Linki Al
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);

      // C. Veritabanına Kaydet
      const { data: newFace, error: dbError } = await supabase
        .from("user_models")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          name: `Yüz ${faces.length + 1}` // Otomatik isim ver
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Listeyi Güncelle (Sayfayı yenilemeden ekrana gelsin)
      setFaces([newFace, ...faces]);
      alert("✅ Yeni yüz eklendi!");

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Yüz Silme Fonksiyonu
  const handleDelete = async (id: string) => {
    if (!confirm("Bu yüzü silmek istediğine emin misin?")) return;

    try {
      const { error } = await supabase.from("user_models").delete().eq("id", id);
      if (error) throw error;

      // Listeden çıkar
      setFaces(faces.filter(face => face.id !== id));
    } catch (error: any) {
      alert("Silme hatası: " + error.message);
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mankenlerim (Yüzlerim)</h1>
          <p className="text-gray-500">Kendi fotoğraflarınızı buraya kaydedin, üretim yaparken tek tıkla kullanın.</p>
        </div>
        
        {/* Gizli Input ve Buton */}
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
        >
          {uploading ? "Yükleniyor..." : "+ Yeni Yüz Ekle"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        
        {/* Yükle Butonu (Kart Görünümlü) */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center aspect-square text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer bg-white"
        >
           <span className="text-4xl mb-2">{uploading ? "⏳" : "+"}</span>
           <span className="text-sm font-bold">{uploading ? "Kaydediliyor" : "Yeni Ekle"}</span>
        </div>

        {/* Yüklenmiş Yüzler Listesi */}
        {faces.map((face) => (
          <div key={face.id} className="group relative bg-white rounded-2xl p-2 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
               <img src={face.image_url} className="w-full h-full object-cover" />
               
               {/* Silme Butonu (Hover olunca çıkar) */}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(face.id)}
                    className="text-white text-xs bg-red-600 px-3 py-1.5 rounded-full font-bold hover:bg-red-700"
                  >
                    Sil 🗑️
                  </button>
               </div>
            </div>
            <p className="text-xs font-bold text-gray-900 text-center truncate px-2">{face.name}</p>
            <p className="text-[10px] text-gray-400 text-center">{new Date(face.created_at).toLocaleDateString()}</p>
          </div>
        ))}

      </div>

      {faces.length === 0 && !uploading && (
        <div className="mt-12 text-center py-10 bg-gray-100 rounded-2xl">
           <span className="text-4xl block mb-2">🤳</span>
           <p className="text-gray-500">Henüz hiç yüz yüklemediniz.</p>
        </div>
      )}

      {/* BİLGİ KUTUSU */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start">
        <div className="text-2xl">💡</div>
        <div>
          <h4 className="font-bold text-blue-900">İyi bir sonuç için ipuçları</h4>
          <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
            <li>Yüzün net göründüğü, aydınlık fotoğraflar kullanın.</li>
            <li>Gözlük veya şapka takmamaya çalışın.</li>
            <li>Doğrudan kameraya baktığınız pozlar en iyi sonucu verir.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}git add .