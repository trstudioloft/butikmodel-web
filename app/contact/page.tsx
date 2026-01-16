"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white overflow-hidden relative">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">B</div>
            <span className="font-bold text-xl tracking-tight">butikmodel<span className="text-gray-400">.com</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition">
            ← Ana Sayfa
          </Link>
        </div>
      </nav>

      <div className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* BAŞLIK */}
        <div className="text-center mb-16">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
             className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900"
           >
             İletişime Geçin 💬
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
             className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
           >
             Projenizle ilgili sorularınız mı var? Ekibimiz size yardımcı olmak için hazır.
           </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
           
           {/* SOL: BİLGİ KARTLARI */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
             className="space-y-8"
           >
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Genel Merkez
                 </h3>
                 <p className="text-gray-600 leading-relaxed text-lg">
                   Pars Digital Plaza<br/>
                   Maslak Mah. Büyükdere Cad. No: 123<br/>
                   Sarıyer, İstanbul
                 </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <span className="w-2 h-6 bg-purple-600 rounded-full"></span> Doğrudan Ulaşın
                 </h3>
                 <div className="space-y-4">
                    <a href="mailto:destek@butikmodel.com" className="flex items-center gap-4 text-gray-600 hover:text-black transition p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 group">
                       <span className="text-2xl">✉️</span>
                       <span className="font-bold text-lg">destek@butikmodel.com</span>
                    </a>
                    <a href="tel:+902120000000" className="flex items-center gap-4 text-gray-600 hover:text-black transition p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 group">
                       <span className="text-2xl">📞</span>
                       <span className="font-bold text-lg">+90 (212) 000 00 00</span>
                    </a>
                 </div>
              </div>
           </motion.div>

           {/* SAĞ: FORM (GLASS) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
             className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 lg:p-12 relative"
           >
              {sent ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in">
                   <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">✓</div>
                   <h3 className="text-3xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h3>
                   <p className="text-gray-500 mb-8 text-lg">En kısa sürede size dönüş yapacağız.</p>
                   <button onClick={() => setSent(false)} className="text-sm font-bold text-black underline hover:text-blue-600">
                     Yeni Mesaj Gönder
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Adınız</label>
                         <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Soyadınız</label>
                         <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-medium" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">E-Posta</label>
                      <input required type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-medium" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Konu</label>
                      <div className="relative">
                        <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-medium appearance-none">
                           <option>Genel Bilgi</option>
                           <option>Teknik Destek</option>
                           <option>Kurumsal / Ajans</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mesajınız</label>
                      <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all resize-none font-medium"></textarea>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-black text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-gray-900 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                   >
                     {loading ? "Gönderiliyor..." : "Mesajı Gönder →"}
                   </button>
                </form>
              )}
           </motion.div>

        </div>
      </div>
    </div>
  );
}