"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("studio");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // İKONLAR (Sidebar ile aynı tasarım dili)
  const icons = {
    studio: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    ghost: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    bg: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    text: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    check: <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100 transition-all">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">B</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">butikmodel<span className="text-gray-400">.com</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
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

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Arkaplan Izgarası */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wide mb-8 border border-gray-200 hover:border-gray-300 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Yapay Zeka Destekli Prodüksiyon
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-gray-900">
            Manken Masrafına <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Son Verin.</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Kıyafetlerinizi askıda veya yerde çekin, yapay zekamız saniyeler içinde profesyonel mankenlere giydirsin. Stüdyo, ışık ve model maliyetlerini %90 düşürün.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition shadow-2xl hover:shadow-black/20 flex items-center justify-center gap-2 group">
              <span>Hemen Başla</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border border-gray-200 font-bold text-lg rounded-full hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <span>Canlı Demo</span>
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Logo Yerleri (Placeholder) */}
             <div className="text-center text-sm font-bold text-gray-400">TRENDYOL</div>
             <div className="text-center text-sm font-bold text-gray-400">HEPSİBURADA</div>
             <div className="text-center text-sm font-bold text-gray-400">SHOPIFY</div>
             <div className="text-center text-sm font-bold text-gray-400">WOOCOMMERCE</div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION (BEFORE/AFTER) */}
      <section id="demo" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Gözlerine İnanamayacaksın</h2>
             <p className="text-gray-500 mt-4 text-lg">Sıradan bir fotoğrafı saniyeler içinde satış makinesine dönüştürüyoruz.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Sol: Kontrol Paneli */}
              <div className="space-y-8">
                 <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
                       <button onClick={() => setActiveTab('studio')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'studio' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Sanal Stüdyo</button>
                       <button onClick={() => setActiveTab('ghost')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'ghost' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Hayalet Manken</button>
                    </div>
                    
                    {activeTab === 'studio' ? (
                      <div className="animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Sanal Stüdyo Çekimi</h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                          Yerde çektiğiniz bir elbiseyi yükleyin. Yapay zeka kıvrımları, gölgeleri ve dokuyu algılayarak seçtiğiniz mankene (zayıf, balık etli, fit) kusursuzca giydirsin.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                             <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">💡</span>
                             <span className="text-sm font-medium text-gray-700">Otomatik Işıklandırma</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                             <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">⚡️</span>
                             <span className="text-sm font-medium text-gray-700">4K Ultra HD Çıktı</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Hayalet Manken (Ghost)</h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                          Manken üzerinde çektiğiniz fotoğraftaki insanı siler, sadece kıyafeti bırakır. Yaka detaylarını otomatik tamamlar.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                             <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">🛍️</span>
                             <span className="text-sm font-medium text-gray-700">Pazaryeri Uyumlu (Trendyol)</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                             <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">⬜️</span>
                             <span className="text-sm font-medium text-gray-700">Şeffaf / Beyaz Arkaplan</span>
                          </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Sağ: Görsel Karşılaştırma */}
              <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                 <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-gray-200 relative">
                       <img src="https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=800&q=80" className="w-full h-full object-cover opacity-90" alt="Before" />
                       <div className="absolute top-6 left-6 bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md shadow-sm">ÖNCE</div>
                    </div>
                    <div className="w-1/2 h-full bg-blue-50 relative">
                       <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" className="w-full h-full object-cover" alt="After" />
                       <div className="absolute top-6 right-6 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">SONRA</div>
                    </div>
                 </div>
                 
                 {/* Çizgi */}
                 <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl text-gray-400 group-hover:scale-110 transition-transform">↔</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
             <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">HİZMETLERİMİZ</span>
             <h2 className="text-4xl font-extrabold text-gray-900 mt-3">Sadece Manken Değil,<br/>Tam Bir Prodüksiyon Ajansı.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* KART 1 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {icons.studio}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Sanal Stüdyo</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Kıyafetlerinizi yükleyin, veritabanımızdaki yüzlerce mankenden (Sarışın, Asyalı, Afro) birine giydirin.
                 </p>
              </div>
              
              {/* KART 2 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {icons.ghost}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Hayalet Manken</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   E-ticaret siteleri için vazgeçilmez. Mankeni siler, sadece ürünü bırakır. Dekupe derdine son.
                 </p>
              </div>

              {/* KART 3 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {icons.bg}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Atmosfer Sihirbazı</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Dükkanın ortasında çekilen fotoğrafı tek tıkla Paris sokaklarına veya profesyonel bir stüdyoya taşıyın.
                 </p>
              </div>

              {/* KART 4 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-yellow-600 mb-6 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    {icons.text}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Akıllı Yazar</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   "Ne yazsam?" diye düşünme. Fotoğrafı yükle, Instagram ve Trendyol için satış odaklı açıklaman hazır olsun.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* HOW IT WORKS (YENİ BÖLÜM) */}
      <section id="how-it-works" className="py-24 bg-black text-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-16 items-center">
               <div className="flex-1">
                  <h2 className="text-4xl font-extrabold mb-6">3 Adımda Profesyonel Çekim.</h2>
                  <p className="text-gray-400 text-lg mb-8">Karmaşık programlar yok. Fotoğrafçılık bilgisi gerekmez.</p>
                  
                  <div className="space-y-8">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">1</div>
                        <div>
                           <h4 className="font-bold text-xl mb-1">Fotoğrafı Yükle</h4>
                           <p className="text-gray-400">Ürünü askıda, yerde veya manken üzerinde çekip sisteme yükleyin.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">2</div>
                        <div>
                           <h4 className="font-bold text-xl mb-1">Ayarlarını Seç</h4>
                           <p className="text-gray-400">Hangi manken giysin? Arkaplan neresi olsun? Seçimini yap.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-lg">3</div>
                        <div>
                           <h4 className="font-bold text-xl mb-1">Sonucu İndir</h4>
                           <p className="text-gray-400">Saniyeler içinde 4K kalitesindeki görselin hazır. Paylaşmaya başla.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 relative">
                  {/* Dekoratif Görsel */}
                  <div className="aspect-[4/5] bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 relative shadow-2xl">
                     <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold">
                        UYGULAMA ARAYÜZÜ
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
             <p className="text-gray-500">Gizli ücret yok. Fotoğrafçı masrafının 10'da 1'i.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="p-8 rounded-3xl bg-white border border-gray-200 hover:border-gray-300 transition hover:shadow-lg">
                 <h3 className="text-lg font-bold text-gray-500 mb-2">Başlangıç</h3>
                 <div className="text-4xl font-extrabold text-gray-900 mb-6">₺499<span className="text-sm font-normal text-gray-400">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-600 mb-8">
                   <li className="flex gap-3">{icons.check} 50 Fotoğraf İşleme</li>
                   <li className="flex gap-3">{icons.check} Standart Mankenler</li>
                   <li className="flex gap-3">{icons.check} Normal Hız</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-gray-100 font-bold text-gray-900 hover:bg-gray-200 transition">Paketi Seç</button>
              </div>

              {/* Plan 2 (POPÜLER) */}
              <div className="p-8 rounded-3xl bg-black text-white border border-gray-800 transform md:-translate-y-4 shadow-2xl relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">EN ÇOK TERCİH EDİLEN</div>
                 <h3 className="text-lg font-bold text-gray-400 mb-2">Butik Pro</h3>
                 <div className="text-4xl font-extrabold mb-6">₺999<span className="text-sm font-normal text-gray-500">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-300 mb-8">
                   <li className="flex gap-3">{icons.check} 200 Fotoğraf İşleme</li>
                   <li className="flex gap-3">{icons.check} Tüm Premium Mankenler</li>
                   <li className="flex gap-3">{icons.check} Hayalet Manken Modu</li>
                   <li className="flex gap-3">{icons.check} Yüksek Hız & Öncelik</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition shadow-lg">Hemen Başla</button>
              </div>

              {/* Plan 3 */}
              <div className="p-8 rounded-3xl bg-white border border-gray-200 hover:border-gray-300 transition hover:shadow-lg">
                 <h3 className="text-lg font-bold text-gray-500 mb-2">Ajans / Toptan</h3>
                 <div className="text-4xl font-extrabold text-gray-900 mb-6">₺2.499<span className="text-sm font-normal text-gray-400">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-600 mb-8">
                   <li className="flex gap-3">{icons.check} 1000 Fotoğraf İşleme</li>
                   <li className="flex gap-3">{icons.check} API Erişimi</li>
                   <li className="flex gap-3">{icons.check} Özel Manken Tasarımı</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-gray-100 font-bold text-gray-900 hover:bg-gray-200 transition">İletişime Geç</button>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4 max-w-3xl mx-auto border-t border-gray-100">
         <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Sıkça Sorulan Sorular</h2>
         <div className="space-y-4">
            {[
              {q: "Fotoğrafları telefonla çeksem yeterli mi?", a: "Kesinlikle! Sistemin en büyük özelliği bu. Profesyonel kameraya gerek yok, telefonla çektiğiniz net fotoğraflar yeterlidir."},
              {q: "Mankenlerin yüzleri telifli mi?", a: "Hayır. Mankenlerimiz tamamen yapay zeka tarafından üretilmiş, gerçekte var olmayan kişilerdir. Telif sorunu yaşamadan her yerde kullanabilirsiniz."},
              {q: "Kullanılmayan krediler devrediyor mu?", a: "Evet, bir sonraki aya devreden kredi sistemimiz mevcuttur."},
              {q: "Ücretsiz deneme süresi var mı?", a: "Evet, kayıt olan herkese sistemimizi test etmeleri için 5 kredi hediye ediyoruz."}
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                 <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition">
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

      {/* CTA FOOTER */}
      <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Prodüksiyon Maliyetlerini Sıfırlayın.</h2>
            <p className="text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
              Bugün ücretsiz katılın, kredi kartı gerekmeden ilk ürününüzü 2 dakika içinde mankene giydirin.
            </p>
            <Link href="/login" className="inline-block px-12 py-5 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition shadow-2xl hover:-translate-y-1 hover:shadow-black/20">
               Ücretsiz Hesabını Oluştur 🚀
            </Link>
            
            <div className="mt-24 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
               <div className="mb-4 md:mb-0">
                  <span className="font-bold text-gray-900">butikmodel.com</span> © 2026
               </div>
               <div className="flex gap-8">
                  <a href="/legal/privacy" className="hover:text-gray-900 transition-colors">Gizlilik</a>
                  <a href="/legal/terms" className="hover:text-gray-900 transition-colors">Şartlar</a>
                  <a href="#" className="hover:text-gray-900 transition-colors">İletişim</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}