"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// DİL KÜTÜPHANESİ
const TRANSLATIONS = {
  tr: {
    title: "Akıllı Metin Yazarı ✍️",
    desc: "Görseli yükle, yapay zeka satış odaklı açıklamanı yazsın.",
    uploadTitle: "1. Ürün Görseli",
    dropText: "Analiz Edilecek Fotoğrafı Seç",
    uploading: "Yükleniyor...",
    settingsTitle: "2. Hedef Kitle & Ton",
    platformLabel: "Platform",
    toneLabel: "Yazı Dili",
    tones: [
      { value: "samimi", label: "Samimi & Emoji Dolu 🚀" },
      { value: "kurumsal", label: "Resmi & Teknik Detaylı 👔" },
      { value: "hype", label: "Heyecanlı & Kampanya Odaklı 🔥" }
    ],
    buttonIdle: "✨ Metni Oluştur (1 Kredi)",
    buttonProcessing: "Yazar Düşünüyor...",
    copy: "Kopyala",
    placeholder: "Yapay zeka sonucu buraya yazacak...",
    analyzing: "Kelimeler seçiliyor...",
    alertUpload: "Lütfen görselin yüklenmesini bekleyin.",
    alertCopied: "Metin kopyalandı! 🎉",
    statusLoading: "Görsel analiz için yükleniyor...",
    statusReady: "✅ Görsel Hazır!",
    statusWriting: "Yapay Zeka Metni Yazıyor...",
    statusDone: "✨ Metin Hazır!"
  },
  en: {
    title: "AI Copywriter ✍️",
    desc: "Upload image, let AI write sales-focused captions.",
    uploadTitle: "1. Product Image",
    dropText: "Select Photo to Analyze",
    uploading: "Uploading...",
    settingsTitle: "2. Target & Tone",
    platformLabel: "Platform",
    toneLabel: "Tone of Voice",
    tones: [
      { value: "friendly", label: "Friendly & Emoji Rich 🚀" },
      { value: "professional", label: "Formal & Technical 👔" },
      { value: "hype", label: "Hype & Sales Focus 🔥" }
    ],
    buttonIdle: "✨ Generate Text (1 Credit)",
    buttonProcessing: "AI is Thinking...",
    copy: "Copy",
    placeholder: "AI will write the result here...",
    analyzing: "Selecting words...",
    alertUpload: "Please wait for the image to upload.",
    alertCopied: "Text copied! 🎉",
    statusLoading: "Uploading for analysis...",
    statusReady: "✅ Image Ready!",
    statusWriting: "AI is Writing...",
    statusDone: "✨ Text Ready!"
  },
  ar: {
    title: "كاتب النصوص الذكي ✍️",
    desc: "قم بتحميل الصورة، ودع الذكاء الاصطناعي يكتب وصفًا يركز على المبيعات.",
    uploadTitle: "1. صورة المنتج",
    dropText: "اختر صورة للتحليل",
    uploading: "جارٍ التحميل...",
    settingsTitle: "2. الهدف والنبرة",
    platformLabel: "المنصة",
    toneLabel: "نبرة الصوت",
    tones: [
      { value: "friendly", label: "ودود وغني بالرموز التعبيرية 🚀" },
      { value: "professional", label: "رسمي وتقني 👔" },
      { value: "hype", label: "حماسي ومركّز على المبيعات 🔥" }
    ],
    buttonIdle: "✨ إنشاء النص (1 رصيد)",
    buttonProcessing: "الذكاء الاصطناعي يفكر...",
    copy: "نسخ",
    placeholder: "سيكتب الذكاء الاصطناعي النتيجة هنا...",
    analyzing: "جاري اختيار الكلمات...",
    alertUpload: "يرجى انتظار تحميل الصورة.",
    alertCopied: "تم نسخ النص! 🎉",
    statusLoading: "جارٍ التحميل للتحليل...",
    statusReady: "✅ الصورة جاهزة!",
    statusWriting: "الذكاء الاصطناعي يكتب...",
    statusDone: "✨ النص جاهز!"
  }
};

export default function CopywriterPage() {
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // DİL AYARI (Varsayılan Türkçe)
  const [lang, setLang] = useState<'tr' | 'en' | 'ar'>('tr');
  const t = TRANSLATIONS[lang]; // Seçili dilin kelimeleri

  const [uploadedImage, setUploadedImage] = useState<string | null>(null); 
  const [publicUrl, setPublicUrl] = useState<string | null>(null); 
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState(lang === 'tr' ? 'samimi' : 'friendly');
  const [generatedText, setGeneratedText] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
    }
    getUser();
  }, [router]);

  // Dil değişince ton varsayılanını güncelle
  useEffect(() => {
    setTone(lang === 'tr' ? 'samimi' : 'friendly');
  }, [lang]);

  // --- 1. RESİM YÜKLEME ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    
    setUploadedImage(URL.createObjectURL(file));
    setGeneratedText("");
    setUploading(true);
    setStatusMessage(t.statusLoading);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `copy-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath);

      setPublicUrl(publicUrl);
      setStatusMessage(t.statusReady);

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 2. MOTORU ÇALIŞTIR ---
  const handleGenerate = async () => {
    if (!publicUrl) { alert(t.alertUpload); return; }
    
    setProcessing(true);
    setGeneratedText("");
    setStatusMessage(t.statusWriting);

    try {
      // Dil bilgisini API'ye gönderiyoruz
      const promptLanguage = lang === 'tr' ? 'Turkish' : lang === 'ar' ? 'Arabic' : 'English';

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "copywriter",
          imageUrl: publicUrl,
          // Promptu seçili dile göre dinamik oluşturuyoruz
          prompt: `Write a ${tone} caption for ${platform} in ${promptLanguage}. Use relevant emojis and hashtags.` 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed.");

      setGeneratedText(data.output);
      setStatusMessage(t.statusDone);

    } catch (error: any) {
      alert("AI Error: " + error.message);
      setStatusMessage("❌ Error");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert(t.alertCopied);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      // Arapça ise yönü sağdan sola çevir (RTL)
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="p-6 md:p-10 min-h-screen font-sans pb-20 max-w-[1600px] mx-auto"
    >
      
      {/* ÜST BAŞLIK VE DİL SEÇİMİ */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t.title}</h1>
          <p className="text-gray-500 mt-2 text-lg">{t.desc}</p>
        </div>
        
        {/* DİL DEĞİŞTİRİCİ */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
           <button onClick={() => setLang('tr')} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'tr' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>🇹🇷 TR</button>
           <button onClick={() => setLang('en')} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>🇬🇧 EN</button>
           <button onClick={() => setLang('ar')} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'ar' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>🇸🇦 AR</button>
        </div>
      </div>

      {statusMessage && (
         <div className="mb-6 text-sm font-bold bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full animate-pulse w-fit">
            ℹ️ {statusMessage}
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOL: GİRDİLER */}
        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden group">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">{t.uploadTitle}</h3>
            
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-gray-50 ${uploadedImage ? 'border-green-500' : 'border-gray-200 hover:border-yellow-500 hover:bg-yellow-50/20'} ${uploading ? 'opacity-50' : ''}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
              
              {uploading ? (
                 <div className="flex flex-col items-center">
                    <span className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></span>
                    <span className="text-xs font-bold text-yellow-600">{t.uploading}</span>
                 </div>
              ) : uploadedImage ? (
                <img src={uploadedImage} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-5xl block mb-3 opacity-30">📷</span>
                  <p className="text-sm font-bold text-gray-400">{t.dropText}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">{t.settingsTitle}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{t.platformLabel}</label>
                <div className="flex gap-3">
                  {['Instagram', 'Trendyol', 'Etsy', 'LinkedIn'].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${platform === p ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{t.toneLabel}</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-yellow-400 outline-none appearance-none"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {t.tones.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!publicUrl || processing}
              className="w-full mt-8 bg-yellow-500 text-black py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02]"
            >
              {processing ? (
                 <>
                   <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                   {t.buttonProcessing}
                 </>
              ) : t.buttonIdle}
            </button>
          </div>
        </div>

        {/* SAĞ: SONUÇ */}
        <div className="bg-[#fff9c4]/10 rounded-[2.5rem] border border-yellow-100 p-2 h-full min-h-[600px] flex flex-col relative">
           <div className="absolute inset-0 bg-yellow-50/50 rounded-[2.5rem] -z-10"></div>
           
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                 </div>
                 {generatedText && (
                   <button onClick={copyToClipboard} className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                     📋 {t.copy}
                   </button>
                 )}
              </div>

              <div className="flex-1 relative">
                 <textarea 
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   placeholder={t.placeholder}
                   // Arapça için sağa yaslı yazması için dir kontrolü
                   dir={lang === 'ar' ? 'rtl' : 'ltr'} 
                   className="w-full h-full p-2 bg-transparent border-none text-gray-700 text-lg leading-loose resize-none focus:ring-0 outline-none font-medium font-mono"
                 />
                 
                 {processing && (
                   <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                      <div className="text-5xl animate-bounce mb-4">✍️</div>
                      <p className="text-gray-500 font-bold animate-pulse">{t.analyzing}</p>
                   </div>
                 )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400 font-mono">
                 <span>{generatedText.length} Chars</span>
                 <span>AI Copywriter Global v3.0</span>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}