import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-xl">B</div>
          <span className="font-bold text-xl tracking-tight">butikmodel<span className="text-blue-600">.ai</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition">Giriş Yap</Link>
          <Link href="/login" className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition">
            Ücretsiz Dene
          </Link>
        </div>
      </nav>

      {/* HERO SECTION (Ana Banner) */}
      <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Yapay Zeka Destekli
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Manken Masrafına <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Son Verin.</span>
        </h1>
        
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Kıyafetlerinizi askıda çekin, yapay zekamız saniyeler içinde profesyonel mankenlere giydirsin. Stüdyo yok, bekleme yok.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Hemen Başla (Ücretsiz)
          </Link>
          <button className="px-8 py-4 bg-gray-100 text-gray-900 font-bold text-lg rounded-xl hover:bg-gray-200 transition">
            Örnekleri Gör
          </button>
        </div>

        {/* GÖRSEL ALANI (Temsili) */}
        <div className="mt-20 w-full max-w-5xl aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl relative">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-sm">Burası Uygulama Demo Ekranı Olacak</span>
             </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-32 py-10 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>© 2024 Butikmodel. Pars Digital iştirakidir.</p>
      </footer>
    </div>
  );
}