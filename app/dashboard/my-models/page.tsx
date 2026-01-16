"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MyModelsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [myModels, setMyModels] = useState<any[]>([]);
  
  // DNA Parametreleri
  const [attributes, setAttributes] = useState({
    gender: "Kadın",
    age: "Genç (20-25)",
    ethnicity: "Türk / Akdeniz",
    hairColor: "Kahverengi",
    hairStyle: "Uzun Düz",
    eyeColor: "Ela",
    bodySize: "Fit / Atletik",
    height: "Orta Boy"
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setMyModels(data);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    let bodyPrompt = "fit body";
    if (attributes.bodySize === "Zayıf / İnce") bodyPrompt = "slim skinny body model";
    if (attributes.bodySize === "Balık Etli / Kıvrımlı") bodyPrompt = "curvy volumetric body shape";
    if (attributes.bodySize === "Büyük Beden (Plus Size)") bodyPrompt = "plus size full figure model";
    if (attributes.bodySize === "Kaslı / Yapılı") bodyPrompt = "muscular athletic body";

    const prompt = `Professional studio full body shot of a ${attributes.age} year old ${attributes.ethnicity} ${attributes.gender}, ${bodyPrompt}, ${attributes.height}, ${attributes.hairStyle} ${attributes.hairColor} hair, ${attributes.eyeColor} eyes, hyper realistic, 8k, fashion photography, neutral background`;
    console.log("🧬 DNA Kodlanıyor:", prompt);
    
    setTimeout(() => {
      const demoImages = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=600&fit=crop"
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
      setGeneratedImage(null);
      setModelName("");
      fetchModels();
      alert("Manken koleksiyonuna eklendi! 🎉");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Bu mankeni silmek istediğine emin misin?")) return;
    await supabase.from("user_models").delete().eq("id", id);
    fetchModels();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-gray-100 pb-6">
        <div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Manken Fabrikası 🧬</h1>
           <p className="text-gray-500 mt-2 text-lg">Markana özel yapay zeka mankeni tasarla.</p>
        </div>
        <Link href="/dashboard/studio" className="mt-4 md:mt-0 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
           Stüdyoya Dön →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: DNA AYARLARI */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
              <span className="w-2 h-6 bg-black rounded-full"></span>
              DNA Profili
            </h3>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vücut Tipi</label>
                <select 
                  className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-black outline-none appearance-none"
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

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1.5">Cinsiyet</label>
                   <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" value={attributes.gender} onChange={(e) => setAttributes({...attributes, gender: e.target.value})}>
                     <option>Kadın</option>
                     <option>Erkek</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1.5">Boy</label>
                   <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" value={attributes.height} onChange={(e) => setAttributes({...attributes, height: e.target.value})}>
                     <option>Kısa</option>
                     <option>Orta Boy</option>
                     <option>Uzun</option>
                   </select>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Etnik Köken</label>
                <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" value={attributes.ethnicity} onChange={(e) => setAttributes({...attributes, ethnicity: e.target.value})}>
                  <option>Türk / Akdeniz</option>
                  <option>Kuzey Avrupa (Sarışın)</option>
                  <option>Doğu Asya</option>
                  <option>Afro-Amerikan</option>
                  <option>Latin</option>
                  <option>Arap / Orta Doğu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Yaş Grubu</label>
                <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" value={attributes.age} onChange={(e) => setAttributes({...attributes, age: e.target.value})}>
                  <option>Genç (18-24)</option>
                  <option>Yetişkin (25-35)</option>
                  <option>Olgun (35-45)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1.5">Saç</label>
                   <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" onChange={(e) => setAttributes({...attributes, hairColor: e.target.value})}>
                     <option>Kahverengi</option>
                     <option>Siyah</option>
                     <option>Sarı</option>
                     <option>Kızıl</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1.5">Göz</label>
                   <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-medium" onChange={(e) => setAttributes({...attributes, eyeColor: e.target.value})}>
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
              className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  DNA İşleniyor...
                </>
              ) : (
                <>
                  <span>⚡️ Üretimi Başlat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ORTA: LABORATUVAR SONUCU */}
        <div className="lg:col-span-4 flex flex-col">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 flex-1 flex flex-col relative h-full min-h-[500px]">
             <h3 className="font-bold text-gray-900 mb-4 text-center">Önizleme</h3>
             
             <div className="flex-1 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                {loading ? (
                   <div className="text-center">
                      <div className="text-6xl animate-bounce mb-6">🧬</div>
                      <p className="text-gray-400 font-bold text-sm">Genetik kod işleniyor...</p>
                   </div>
                ) : generatedImage ? (
                   <>
                     <img src={generatedImage} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white text-xs font-mono bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                          {attributes.ethnicity}, {attributes.bodySize}
                        </span>
                     </div>
                   </>
                ) : (
                   <div className="text-center text-gray-300 p-8">
                      <span className="text-6xl opacity-30 block mb-4">👤</span>
                      <p className="text-sm font-medium">Özellikleri seç ve<br/>üretim butonuna bas.</p>
                   </div>
                )}
             </div>

             {generatedImage && !loading && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
                  <input 
                    type="text" 
                    placeholder="Mankene İsim Ver (Örn: Leyla)" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                  >
                    {saving ? "Kaydediliyor..." : "💾 Koleksiyona Ekle"}
                  </button>
               </motion.div>
             )}
           </div>
        </div>

        {/* SAĞ: KOLEKSİYON */}
        <div className="lg:col-span-4 flex flex-col h-full">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 h-full flex flex-col max-h-[800px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 text-lg">Koleksiyonum</h3>
                 <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{myModels.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                 {myModels.map((model) => (
                   <div key={model.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group relative bg-gray-50/50">
                      <img src={model.image_url} className="w-20 h-24 rounded-xl object-cover bg-gray-200 shadow-sm" />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <h4 className="font-bold text-gray-900 truncate">{model.name}</h4>
                         <p className="text-xs text-gray-500 truncate mt-1">{model.attributes?.bodySize}</p>
                         <p className="text-[10px] text-gray-400 mt-1">{new Date(model.created_at).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(model.id)}
                        className="self-center p-2 text-gray-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                        title="Sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                   </div>
                 ))}

                 {myModels.length === 0 && (
                   <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                      <p className="text-gray-400 text-sm">Henüz manken üretmedin.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}