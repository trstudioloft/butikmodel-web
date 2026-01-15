"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("studio");

  // SSS Açılır Kapanır Mantığı
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">B</div>
            <span className="font-bold text-xl tracking-tight">butikmodel<span className="text-blue-600">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-black transition">Özellikler</a>
            <a href="#demo" className="hover:text-black transition">Nasıl Çalışır?</a>
            <a href="#pricing" className="hover:text-black transition">Fiyatlar</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition">Giriş Yap</Link>
            <Link href="/login" className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Arkaplan Efektleri */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Butikler İçin Yapay Zeka Devrimi
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Manken Masrafına <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">Son Verin.</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Kıyafetlerinizi askıda veya yerde çekin, yapay zekamız saniyeler içinde profesyonel mankenlere giydirsin. Stüdyo, ışık ve model maliyetlerini %90 düşürün.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
              <span>Hemen Başla</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold text-lg rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <span>Örnekleri Gör</span>
              <span className="text-xl">👇</span>
            </a>
          </div>

          <div className="mt-12 text-sm text-gray-500 font-medium">
             <span className="text-yellow-500">★★★★★</span> 500+ Butik Sahibi Tarafından Güvenle Kullanılıyor
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER DEMO SECTION */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900">Sonuçlara İnanamayacaksınız</h2>
             <p className="text-gray-500 mt-2">Sıradan bir fotoğrafı saniyeler içinde satış makinesine dönüştürüyoruz.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Sol: Açıklama */}
              <div className="space-y-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
                       <button onClick={() => setActiveTab('studio')} className={`pb-2 text-sm font-bold transition ${activeTab === 'studio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Manken Çekimi</button>
                       <button onClick={() => setActiveTab('ghost')} className={`pb-2 text-sm font-bold transition ${activeTab === 'ghost' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Hayalet Manken</button>
                    </div>
                    
                    {activeTab === 'studio' ? (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sanal Stüdyo Çekimi</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Yerde çektiğiniz bir elbiseyi yükleyin. Yapay zeka kıvrımları, gölgeleri ve dokuyu algılayarak seçtiğiniz mankene (zayıf, balık etli, fit) kusursuzca giydirsin.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2">✅ İnsan teni ve ışık uyumu</li>
                          <li className="flex items-center gap-2">✅ Yüksek çözünürlük (4K)</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hayalet Manken (Ghost)</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Manken üzerinde çektiğiniz fotoğraftaki insanı siler, sadece kıyafeti bırakır. Yaka detaylarını otomatik tamamlar.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2">✅ Trendyol & Hepsiburada uyumlu</li>
                          <li className="flex items-center gap-2">✅ Beyaz veya şeffaf arkaplan</li>
                        </ul>
                      </div>
                    )}
                 </div>
              </div>

              {/* Sağ: Görsel */}
              <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                 <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-gray-200 relative">
                       <img src="https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=800&q=80" className="w-full h-full object-cover opacity-80" alt="Before" />
                       <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm">ÖNCE (Sizin Çekiminiz)</div>
                    </div>
                    <div className="w-1/2 h-full bg-blue-50 relative">
                       <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" className="w-full h-full object-cover" alt="After" />
                       <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">SONRA (Yapay Zeka)</div>
                    </div>
                 </div>
                 
                 {/* Ortadaki çizgi */}
                 <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-400">↔</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <span className="text-blue-600 font-bold tracking-wide uppercase text-sm">HİZMETLERİMİZ</span>
             <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Sadece Manken Değil, Tam Bir Ajans.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* KART 1 */}
              <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition duration-300">
                 <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl mb-6">📸</div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Sanal Stüdyo</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Kıyafetlerinizi yükleyin, veritabanımızdaki yüzlerce mankenden (Sarışın, Asyalı, Afro) birine giydirin.
                 </p>
              </div>
              
              {/* KART 2 */}
              <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition duration-300">
                 <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-3xl mb-6">👻</div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Hayalet Manken</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   E-ticaret siteleri için vazgeçilmez. Mankeni siler, sadece ürünü bırakır. Dekupe derdine son.
                 </p>
              </div>

              {/* KART 3 */}
              <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition duration-300">
                 <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl mb-6">🗼</div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Atmosfer Sihirbazı</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Dükkanın ortasında çekilen fotoğrafı tek tıkla Paris sokaklarına veya profesyonel bir stüdyoya taşıyın.
                 </p>
              </div>

              {/* KART 4 */}
              <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition duration-300">
                 <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-3xl mb-6">✍️</div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Akıllı Yazar</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   "Ne yazsam?" diye düşünme. Fotoğrafı yükle, Instagram ve Trendyol için satış odaklı açıklaman hazır olsun.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-extrabold mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
             <p className="text-gray-400">Gizli ücret yok. Fotoğrafçı masrafının 10'da 1'i.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="p-8 rounded-3xl bg-gray-800 border border-gray-700 hover:border-gray-500 transition">
                 <h3 className="text-lg font-bold text-gray-400 mb-2">Başlangıç</h3>
                 <div className="text-4xl font-extrabold mb-6">₺499<span className="text-sm font-normal text-gray-500">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-300 mb-8">
                   <li className="flex gap-3">✓ 50 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ Standart Mankenler</li>
                   <li className="flex gap-3">✓ Normal Hız</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-gray-700 font-bold hover:bg-gray-600 transition">Seç</button>
              </div>

              {/* Plan 2 (POPÜLER) */}
              <div className="p-8 rounded-3xl bg-blue-600 border border-blue-500 transform md:-translate-y-4 shadow-2xl relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">EN POPÜLER</div>
                 <h3 className="text-lg font-bold text-blue-100 mb-2">Butik Pro</h3>
                 <div className="text-4xl font-extrabold mb-6">₺999<span className="text-sm font-normal text-blue-200">/ay</span></div>
                 <ul className="space-y-4 text-sm text-white mb-8">
                   <li className="flex gap-3">✓ 200 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ Tüm Premium Mankenler</li>
                   <li className="flex gap-3">✓ Hayalet Manken Modu</li>
                   <li className="flex gap-3">✓ Yüksek Hız & Öncelik</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition shadow-lg">Hemen Başla</button>
              </div>

              {/* Plan 3 */}
              <div className="p-8 rounded-3xl bg-gray-800 border border-gray-700 hover:border-gray-500 transition">
                 <h3 className="text-lg font-bold text-gray-400 mb-2">Ajans / Toptan</h3>
                 <div className="text-4xl font-extrabold mb-6">₺2.499<span className="text-sm font-normal text-gray-500">/ay</span></div>
                 <ul className="space-y-4 text-sm text-gray-300 mb-8">
                   <li className="flex gap-3">✓ 1000 Fotoğraf İşleme</li>
                   <li className="flex gap-3">✓ API Erişimi</li>
                   <li className="flex gap-3">✓ Özel Manken Tasarımı</li>
                 </ul>
                 <button className="w-full py-3 rounded-xl bg-gray-700 font-bold hover:bg-gray-600 transition">İletişime Geç</button>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Aklınızda Soru İşareti Kalmasın</h2>
         <div className="space-y-4">
            {[
              {q: "Fotoğrafları telefonla çeksem yeterli mi?", a: "Kesinlikle! Sistemin en büyük özelliği bu. Profesyonel kameraya gerek yok, telefonla çektiğiniz net fotoğraflar yeterlidir."},
              {q: "Mankenlerin yüzleri telifli mi?", a: "Hayır. Mankenlerimiz tamamen yapay zeka tarafından üretilmiş, gerçekte var olmayan kişilerdir. Telif sorunu yaşamadan her yerde kullanabilirsiniz."},
              {q: "Kullanılmayan krediler devrediyor mu?", a: "Evet, bir sonraki aya devreden kredi sistemimiz mevcuttur."},
              {q: "Ücretsiz deneme süresi var mı?", a: "Evet, kayıt olan herkese sistemimizi test etmeleri için 5 kredi hediye ediyoruz."}
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                 <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition">
                    <span className="font-bold text-gray-800">{item.q}</span>
                    <span className="text-2xl text-gray-400">{openFaq === i ? "−" : "+"}</span>
                 </button>
                 {openFaq === i && (
                   <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-100">
                     {item.a}
                   </div>
                 )}
              </div>
            ))}
         </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Manken Çekimlerine Servet Ödemeyin.</h2>
            <p className="text-gray-500 mb-8">Bugün ücretsiz katılın, ilk ürününüzü 2 dakika içinde mankene giydirin.</p>
            <Link href="/login" className="inline-block px-10 py-5 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition shadow-xl hover:-translate-y-1">
               Ücretsiz Hesabını Oluştur 🚀
            </Link>
            
            <div className="mt-20 pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
               <div className="mb-4 md:mb-0">
                  <span className="font-bold text-gray-900">butikmodel.ai</span> © 2026. Tüm hakları saklıdır.
               </div>
               <div className="flex gap-6">
                  <a href="#" className="hover:text-gray-900">Gizlilik Sözleşmesi</a>
                  <a href="#" className="hover:text-gray-900">Kullanım Şartları</a>
                  <a href="#" className="hover:text-gray-900">Pars Digital</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}