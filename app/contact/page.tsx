"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // SİMÜLASYON: Mesaj gönderme işlemi
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      
      {/* NAVBAR (Basitleştirilmiş) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">B</div>
            <span className="font-bold text-xl tracking-tight">butikmodel<span className="text-gray-400">.com</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* BAŞLIK */}
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">İletişime Geçin 💬</h1>
           <p className="text-gray-500 text-lg max-w-2xl mx-auto">
             Projenizle ilgili sorularınız mı var? Ekibimiz size yardımcı olmak için hazır.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
           
           {/* SOL: BİLGİLER */}
           <div className="space-y-10">
              
              <div>
                 <h3 className="text-xl font-bold mb-4">Genel Merkez</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Pars Digital Plaza<br/>
                   Maslak Mah. Büyükdere Cad. No: 123<br/>
                   Sarıyer, İstanbul
                 </p>
              </div>

              <div>
                 <h3 className="text-xl font-bold mb-4">Doğrudan Ulaşın</h3>
                 <div className="space-y-3">
                    <a href="mailto:destek@butikmodel.com" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 group">
                       <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">✉️</span>
                       <span className="font-medium">destek@butikmodel.com</span>
                    </a>
                    <a href="tel:+902120000000" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition p-3 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-100 group">
                       <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg group-hover:bg-green-600 group-hover:text-white transition-colors">📞</span>
                       <span className="font-medium">+90 (212) 000 00 00</span>
                    </a>
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">SOSYAL MEDYA</h3>
                 <div className="flex gap-4">
                    {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                      <a key={social} href="#" className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-black hover:text-white transition-colors">
                        {social}
                      </a>
                    ))}
                 </div>
              </div>

           </div>

           {/* SAĞ: FORM */}
           <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-10">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h3>
                   <p className="text-gray-500 mb-8">En kısa sürede size dönüş yapacağız.</p>
                   <button onClick={() => setSent(false)} className="text-sm font-bold text-gray-900 underline hover:text-blue-600">
                     Yeni Mesaj Gönder
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Adınız</label>
                         <input required type="text" placeholder="Ad" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Soyadınız</label>
                         <input required type="text" placeholder="Soyad" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">E-Posta Adresi</label>
                      <input required type="email" placeholder="isim@sirket.com" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Konu</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all">
                         <option>Genel Bilgi</option>
                         <option>Teknik Destek</option>
                         <option>Kurumsal / Ajans İşbirliği</option>
                         <option>Ödeme Sorunu</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Mesajınız</label>
                      <textarea required rows={4} placeholder="Size nasıl yardımcı olabiliriz?" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all resize-none"></textarea>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-900 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {loading ? (
                       <>
                         <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                         Gönderiliyor...
                       </>
                     ) : (
                       "Mesajı Gönder"
                     )}
                   </button>
                </form>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}