"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("studio");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100/50 transition-all">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">B</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">butikmodel<span className="text-gray-400">.com</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-black transition-colors">Özellikler</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">Nasıl Çalışır?</a>
            <a href="#pricing" className="hover:text-black transition-colors">Fiyatlar</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-black transition">Giriş Yap</Link>
            <Link href="/login" className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION (AURORA) */}
      <section className="relative pt-44 pb-32 px-4 overflow-hidden">
        {/* Canlı Arka Plan Işıkları */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-200/40 via-purple-200/30 to-transparent rounded-[100%] blur-[80px] -z-10 animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-bold uppercase tracking-wide mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Yapay Zeka Destekli Prodüksiyon v2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold leading-[1.1] tracking-tight mb-6 text-gray-900"
          >
            Manken Masrafına <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">Son Verin.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Kıyafetlerinizi askıda çekin, yapay zekamız saniyeler içinde profesyonel mankenlere giydirsin. Stüdyo, ışık ve model maliyetlerini %90 düşürün.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-900 transition shadow-2xl hover:shadow-black/25 flex items-center justify-center gap-2 group">
              <span>Hemen Başla</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-10 py-4 bg-white text-gray-900 border border-gray-200 font-bold text-lg rounded-full hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <span>Canlı Demo</span>
            </a>
          </motion.div>

          {/* INFINITE LOGO SCROLL */}
          <div className="mt-24 border-y border-gray-100 py-8 overflow-hidden relative bg-white/50 backdrop-blur-sm">
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
             <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
             
             <div className="flex gap-20 animate-infinite-scroll whitespace-nowrap items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                {["TRENDYOL", "HEPSİBURADA", "AMAZON", "SHOPIFY", "WOOCOMMERCE", "ZARA", "MANGO", "H&M", "MAVİ", "KOTON", "LCW", "DEFACTO"].map((brand, i) => (
                   <span key={i} className="text-xl font-black text-gray-900 tracking-widest">{brand}</span>
                ))}
                {/* Döngü Pürüzsüzlüğü İçin Tekrar */}
                {["TRENDYOL", "HEPSİBURADA", "AMAZON", "SHOPIFY", "WOOCOMMERCE", "ZARA", "MANGO", "H&M", "MAVİ", "KOTON", "LCW", "DEFACTO"].map((brand, i) => (
                   <span key={`dup-${i}`} className="text-xl font-black text-gray-900 tracking-widest">{brand}</span>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION (INTERAKTIF & GLASS) */}
      <section id="demo" className="py-32 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Gözlerine İnanamayacaksın</h2>
             <p className="text-gray-500 text-lg">Sıradan bir fotoğrafı saniyeler içinde satış makinesine dönüştürüyoruz.</p>
           </div>

           <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-50 -z-10"></div>
              
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                 
                 {/* Sol: Kontrol */}
                 <div className="w-full lg:w-1/3 space-y-8">
                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
                       {['studio', 'ghost'].map((tab) => (
                         <button 
                           key={tab}
                           onClick={() => setActiveTab(tab)} 
                           className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                         >
                           {tab === 'studio' ? 'Sanal Stüdyo' : 'Hayalet Manken'}
                         </button>
                       ))}
                    </div>
                    
                    <div className="space-y-6">
                        <motion.div 
                          key={activeTab}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            {activeTab === 'studio' ? 'Mankenle Hayat Verin.' : 'Ürünü Ön Plana Çıkarın.'}
                          </h3>
                          <p className="text-gray-500 leading-relaxed text-lg">
                            {activeTab === 'studio' 
                              ? "Kıyafetlerinizi yükleyin, veritabanımızdaki yüzlerce mankenden (Sarışın, Asyalı, Afro) birine giydirin. Işık ve gölge otomatik ayarlanır."
                              : "Manken üzerinde çektiğiniz fotoğraftaki insanı siler, sadece kıyafeti bırakır. E-ticaret için mükemmel dekupe."
                            }
                          </p>
                        </motion.div>
                        
                        <div className="flex gap-4 items-center pt-4 border-t border-gray-100">
                           <div className="flex -space-x-3">
                              {[1,2,3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                   <img src={`https://randomuser.me/api/portraits/women/${40+i}.jpg`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                           </div>
                           <div className="flex flex-col justify-center text-xs">
                              <span className="font-bold text-gray-900 text-sm">50+ Manken</span>
                              <span className="text-gray-500">Seçimini bekliyor</span>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Sağ: Görsel (Sabit Yükseklik) */}
                 <div className="w-full lg:w-2/3 relative aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-inner group border border-gray-200/50">
                    <img 
                      src={activeTab === 'studio' 
                        ? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop" 
                        : "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=800&fit=crop"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Yüzen Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 border border-white/50">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       {activeTab === 'studio' ? 'AI Model: Sarah (Stüdyo)' : 'AI İşlemi: Hayalet Modu'}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES (YENİ TASARIM) */}
      <section id="features" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
             <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">HİZMETLERİMİZ</span>
             <h2 className="text-4xl font-extrabold text-gray-900 mt-3">Tam Donanımlı Ajans.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
              
              {/* BÜYÜK KART (Stüdyo) */}
              <div className="md:col-span-2 row-span-2 bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-4xl font-bold mb-4">Sanal Stüdyo</h3>
                      <p className="text-gray-400 max-w-md text-lg">Manken, makyöz, kuaför ve fotoğrafçı masraflarını tek kalemde silin. Kıyafeti yükleyin, gerisini bize bırakın.</p>
                    </div>
                    <div>
                      <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">Stüdyoyu İncele →</button>
                    </div>
                 </div>
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" className="absolute right-0 bottom-0 w-3/5 h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 mask-gradient-b lg:mask-gradient-l" />
              </div>

              {/* KART (Ghost) */}
              <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 hover:border-gray-200 transition hover:shadow-xl group flex flex-col justify-between relative overflow-hidden">
                 <div>
                   <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6">👻</div>
                   <h3 className="text-2xl font-bold mb-2">Hayalet Manken</h3>
                   <p className="text-gray-500">Ürünü mankenden ayırır, dekupe eder. Pazaryerleri için ideal.</p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-[50px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* KART (Atmosfer) */}
              <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 hover:border-blue-200 transition hover:shadow-xl group flex flex-col justify-between relative overflow-hidden">
                 <div>
                   <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🎨</div>
                   <h3 className="text-2xl font-bold mb-2">Atmosfer</h3>
                   <p className="text-gray-600">Dükkan çekimini Paris sokaklarına veya lüks bir kafeye taşıyın.</p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full blur-[50px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* KART (Yazar) */}
              <div className="md:col-span-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-[2.5rem] p-10 flex items-center justify-between relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">YENİ</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">Akıllı Metin Yazarı</h3>
                    <p className="text-gray-400 text-lg">Instagram ve Trendyol için SEO uyumlu açıklamalar yazar.</p>
                 </div>
                 <div className="text-8xl opacity-10 absolute right-10 rotate-12">✍️</div>
              </div>

           </div>
        </div>
      </section>

      {/* HOW IT WORKS (STEP SECTION) */}
      <section id="how-it-works" className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-20 items-center">
               <div className="flex-1">
                  <h2 className="text-4xl font-extrabold mb-6 text-gray-900">3 Adımda Profesyonel Çekim.</h2>
                  <p className="text-gray-500 text-lg mb-10">Karmaşık programlar yok. Fotoğrafçılık bilgisi gerekmez.</p>
                  
                  <div className="space-y-10">
                     {[
                       { step: 1, title: "Fotoğrafı Yükle", desc: "Ürünü askıda, yerde veya manken üzerinde çekip sisteme yükleyin." },
                       { step: 2, title: "Ayarlarını Seç", desc: "Hangi manken giysin? Arkaplan neresi olsun? Seçimini yap." },
                       { step: 3, title: "Sonucu İndir", desc: "Saniyeler içinde 4K kalitesindeki görselin hazır. Paylaşmaya başla." }
                     ].map((item) => (
                       <div key={item.step} className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-xl group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                            {item.step}
                          </div>
                          <div>
                             <h4 className="font-bold text-xl mb-1 text-gray-900">{item.title}</h4>
                             <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 relative">
                  {/* Dekoratif Görsel */}
                  <div className="aspect-[4/5] bg-gray-900 rounded-[2.5rem] overflow-hidden border-8 border-gray-100 relative shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 font-bold bg-gradient-to-b from-gray-800 to-black">
                        <span className="text-6xl mb-4">🚀</span>
                        <span className="text-gray-400">UYGULAMA ARAYÜZÜ</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-20">
             <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Şeffaf Fiyatlandırma</h2>
             <p className="text-gray-500 text-lg">Gizli ücret yok. Fotoğrafçı masrafının 10'da 1'i.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gray-200 transition hover:shadow-xl flex flex-col">
                 <h3 className="text-xl font-bold text-gray-500 mb-2">Başlangıç</h3>
                 <div className="text-5xl font-extrabold text-gray-900 mb-6">₺499<span className="text-sm font-normal text-gray-400">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                   <li className="flex gap-3">✓ 50 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ Standart Mankenler</li>
                   <li className="flex gap-3">✓ Normal Hız</li>
                 </ul>
                 <button className="w-full py-4 rounded-xl bg-gray-50 font-bold text-gray-900 hover:bg-gray-100 transition">Paketi Seç</button>
              </div>

              {/* Plan 2 (POPÜLER) */}
              <div className="p-8 rounded-[2rem] bg-black text-white border border-gray-800 transform md:-translate-y-6 shadow-2xl relative flex flex-col">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">EN ÇOK TERCİH EDİLEN</div>
                 <h3 className="text-xl font-bold text-gray-400 mb-2">Butik Pro</h3>
                 <div className="text-5xl font-extrabold mb-6">₺999<span className="text-sm font-normal text-gray-500">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-300 mb-8 flex-1">
                   <li className="flex gap-3">✓ 200 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ Tüm Premium Mankenler</li>
                   <li className="flex gap-3">✓ Hayalet Manken Modu</li>
                   <li className="flex gap-3">✓ Yüksek Hız & Öncelik</li>
                 </ul>
                 <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition shadow-lg">Hemen Başla</button>
              </div>

              {/* Plan 3 */}
              <div className="p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gray-200 transition hover:shadow-xl flex flex-col">
                 <h3 className="text-xl font-bold text-gray-500 mb-2">Ajans / Toptan</h3>
                 <div className="text-5xl font-extrabold text-gray-900 mb-6">₺2.499<span className="text-sm font-normal text-gray-400">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                   <li className="flex gap-3">✓ 1000 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ API Erişimi</li>
                   <li className="flex gap-3">✓ Özel Manken Tasarımı</li>
                 </ul>
                 <button className="w-full py-4 rounded-xl bg-gray-50 font-bold text-gray-900 hover:bg-gray-100 transition">İletişime Geç</button>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Sıkça Sorulan Sorular</h2>
         <div className="space-y-4">
            {[
              {q: "Fotoğrafları telefonla çeksem yeterli mi?", a: "Kesinlikle! Sistemin en büyük özelliği bu. Profesyonel kameraya gerek yok, telefonla çektiğiniz net fotoğraflar yeterlidir."},
              {q: "Mankenlerin yüzleri telifli mi?", a: "Hayır. Mankenlerimiz tamamen yapay zeka tarafından üretilmiş, gerçekte var olmayan kişilerdir. Telif sorunu yaşamadan her yerde kullanabilirsiniz."},
              {q: "Kullanılmayan krediler devrediyor mu?", a: "Evet, bir sonraki aya devreden kredi sistemimiz mevcuttur."},
              {q: "Ücretsiz deneme süresi var mı?", a: "Evet, kayıt olan herkese sistemimizi test etmeleri için 5 kredi hediye ediyoruz."}
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                 <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition">
                    <span className="font-bold text-gray-800">{item.q}</span>
                    <span className="text-2xl text-gray-400 font-light">{openFaq === i ? "−" : "+"}</span>
                 </button>
                 {openFaq === i && (
                   <div className="p-6 pt-0 text-gray-600 text-sm leading-relaxed bg-white">
                     {item.a}
                   </div>
                 )}
              </div>
            ))}
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Prodüksiyon Maliyetlerini Sıfırlayın.</h2>
            <p className="text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
              Bugün ücretsiz katılın, kredi kartı gerekmeden ilk ürününüzü 2 dakika içinde mankene giydirin.
            </p>
            <Link href="/login" className="inline-block px-12 py-5 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition shadow-2xl hover:-translate-y-1 hover:shadow-black/20">
               Ücretsiz Hesabını Oluştur 🚀
            </Link>
            
            <div className="mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
               <div className="mb-4 md:mb-0">
                  <span className="font-bold text-gray-900">butikmodel.com</span> © 2026
               </div>
               <div className="flex gap-8">
                  <Link href="/legal/privacy" className="hover:text-gray-900 transition-colors">Gizlilik</Link>
                  <Link href="/legal/terms" className="hover:text-gray-900 transition-colors">Şartlar</Link>
                  <Link href="/contact" className="hover:text-gray-900 transition-colors">İletişim</Link>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}