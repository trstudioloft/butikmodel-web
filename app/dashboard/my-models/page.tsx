"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MyModelsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [myModels, setMyModels] = useState<any[]>([]);
  
  // GÜNCELLENMİŞ Manken Parametreleri (Kilo ve Boy eklendi)
  const [attributes, setAttributes] = useState({
    gender: "Kadın",
    age: "Genç (20-25)",
    ethnicity: "Türk / Akdeniz",
    hairColor: "Kahverengi",
    hairStyle: "Uzun Düz",
    eyeColor: "Ela",
    bodySize: "Fit / Atletik", // YENİ: Vücut Tipi
    height: "Orta Boy"         // YENİ: Boy
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_models")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setMyModels(data);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    
    // YENİ PROMPT MANTIĞI: Seçilen kiloya göre İngilizce çeviri
    let bodyPrompt = "fit body";
    if (attributes.bodySize === "Zayıf / İnce") bodyPrompt = "slim skinny body model";
    if (attributes.bodySize === "Balık Etli / Kıvrımlı") bodyPrompt = "curvy volumetric body shape";
    if (attributes.bodySize === "Büyük Beden (Plus Size)") bodyPrompt = "plus size full figure model";
    if (attributes.bodySize === "Kaslı / Yapılı") bodyPrompt = "muscular athletic body";

    const prompt = `Professional studio full body shot of a ${attributes.age} year old ${attributes.ethnicity} ${attributes.gender}, ${bodyPrompt}, ${attributes.height}, ${attributes.hairStyle} ${attributes.hairColor} hair, ${attributes.eyeColor} eyes, hyper realistic, 8k, fashion photography, neutral background`;
    
    console.log("Oluşturulacak Prompt:", prompt);
    
    // SİMÜLASYON (Gerçek API bağlanana kadar)
    setTimeout(() => {
      // Rastgele örnekler
      const demoImages = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=500&fit=crop"
      ];
      setGeneratedImage(demoImages[Math.floor(Math.random() * demoImages.length)]);
      setLoading(false);
    }, 2500);
  };

  const handleSave = async () => {
    if (!generatedImage || !modelName) return alert("Lütfen mankene bir isim verin!");
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("user_models").insert({
      user_id: user.id,
      name: modelName,
      image_url: generatedImage,
      attributes: attributes
    });

    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert("Manken koleksiyonuna eklendi! 🎉");
      setGeneratedImage(null);
      setModelName("");
      fetchModels();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Bu mankeni silmek istediğine emin misin?")) return;
    await supabase.from("user_models").delete().eq("id", id);
    fetchModels();
  };

  return (
    <div className="p-8 min-h-screen pb-20 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Karakter Fabrikası 🧬</h1>
        <p className="text-gray-500 mt-2">Kendi özel yapay zeka mankenini tasarla ve koleksiyonuna ekle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: AYAR PANELİ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Fiziksel Özellikler</h3>
            
            <div className="space-y-4">
              
              {/* YENİ: VÜCUT TİPİ SEÇİMİ */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 mb-1">Vücut Tipi (Kilo)</label>
                <select 
                  className="w-full p-2 bg-white rounded-lg border border-blue-200 text-sm font-medium"
                  value={attributes.bodySize}
                  onChange={(e) => setAttributes({...attributes, bodySize: e.target.value})}
                >
                  <option>Zayıf / İnce</option>
                  <option>Fit / Atletik</option>
                  <option>Balık Etli / Kıvrımlı</option>
                  <option>Kaslı / Yapılı</option>
                  <option>Büyük Beden (Plus Size)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 {/* Cinsiyet */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Cinsiyet</label>
                  <select 
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                    value={attributes.gender}
                    onChange={(e) => setAttributes({...attributes, gender: e.target.value})}
                  >
                    <option>Kadın</option>
                    <option>Erkek</option>
                  </select>
                </div>
                {/* Boy */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Boy</label>
                  <select 
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                    value={attributes.height}
                    onChange={(e) => setAttributes({...attributes, height: e.target.value})}
                  >
                    <option>Kısa</option>
                    <option>Orta Boy</option>
                    <option>Uzun</option>
                  </select>
                </div>
              </div>

              {/* Köken */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Etnik Köken</label>
                <select 
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                  value={attributes.ethnicity}
                  onChange={(e) => setAttributes({...attributes, ethnicity: e.target.value})}
                >
                  <option>Türk / Akdeniz</option>
                  <option>Kuzey Avrupa (Sarışın)</option>
                  <option>Doğu Asya</option>
                  <option>Afro-Amerikan</option>
                  <option>Latin</option>
                  <option>Arap / Orta Doğu</option>
                </select>
              </div>

              {/* Yaş */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Yaş Grubu</label>
                <select 
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                  value={attributes.age}
                  onChange={(e) => setAttributes({...attributes, age: e.target.value})}
                >
                  <option>Genç (18-24)</option>
                  <option>Yetişkin (25-35)</option>
                  <option>Olgun (35-45)</option>
                </select>
              </div>

              {/* Saç & Göz */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Saç Rengi</label>
                   <select className="w-full p-2 bg-gray-50 rounded-lg border text-sm" onChange={(e) => setAttributes({...attributes, hairColor: e.target.value})}>
                     <option>Kahverengi</option>
                     <option>Siyah</option>
                     <option>Sarı</option>
                     <option>Kızıl</option>
                     <option>Gri / Beyaz</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Göz Rengi</label>
                   <select className="w-full p-2 bg-gray-50 rounded-lg border text-sm" onChange={(e) => setAttributes({...attributes, eyeColor: e.target.value})}>
                     <option>Ela</option>
                     <option>Kahve</option>
                     <option>Mavi</option>
                     <option>Yeşil</option>
                   </select>
                </div>
              </div>

            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
            >
              {loading ? "Genetik Kod İşleniyor..." : "⚡️ Mankeni Oluştur"}
            </button>
          </div>
        </div>

        {/* ORTA: ÖNİZLEME */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center min-h-[400px] relative">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin text-4xl mb-2">🧬</div>
                <p className="text-gray-500 text-sm">Mankenin özellikleri yükleniyor...</p>
              </div>
            ) : generatedImage ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative w-full">
                  <img src={generatedImage} className="rounded-lg shadow-lg w-full h-auto object-cover max-h-[400px]" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {attributes.bodySize}
                  </div>
                </div>
                
                <div className="w-full mt-4 space-y-3">
                  <input 
                    type="text" 
                    placeholder="Mankene bir isim ver (Örn: Ece)" 
                    className="w-full p-3 border rounded-lg text-sm"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    {saving ? "Kaydediliyor..." : "💾 Koleksiyona Kaydet"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <span className="text-6xl opacity-20 block mb-2">👤</span>
                <p>Sol taraftan özellikleri seç.</p>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ: KOLEKSİYON */}
        <div className="lg:col-span-4">
          <h3 className="font-bold text-gray-900 mb-4">Kayıtlı Mankenlerim ({myModels.length})</h3>
          <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {myModels.map((model) => (
              <div key={model.id} className="relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <img src={model.image_url} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="font-bold text-sm text-gray-800 truncate">{model.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {model.attributes?.bodySize || "Standart"}, {model.attributes?.age}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(model.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {myModels.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-xl">
                Henüz mankenin yok.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}