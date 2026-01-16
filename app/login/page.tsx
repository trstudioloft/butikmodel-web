"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo"; // LOGO EKLENDİ

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Kayıt başarılı! Lütfen e-posta adresinize gelen onay linkine tıklayın.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans text-gray-900">
      
      {/* SOL: GÖRSEL ALANI */}
      <div className="hidden lg:flex flex-col justify-between bg-black text-white p-12 relative overflow-hidden">
        {/* Arkaplan Görseli */}
        <div className="absolute inset-0 z-0 opacity-60">
           <img 
             src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             alt="Fashion AI" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>

        {/* LOGO (Sol Üst - Beyaz) */}
        <div className="relative z-20 flex items-center gap-2">
           <div className="w-10 h-10">
              <Logo dark={true} />
           </div>
           <span className="font-bold text-xl tracking-tight">butikmodel.ai</span>
        </div>

        {/* Mesaj */}
        <div className="relative z-20 max-w-lg">
           <blockquote className="text-2xl font-medium leading-relaxed mb-6">
             "Fotoğraf çekimleri için harcadığım zamanı %90 azalttı. Artık sadece tasarımlarıma odaklanabiliyorum."
           </blockquote>
           <div className="flex items-center gap-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-white/20" />
              <div>
                 <p className="font-bold">Selin Yılmaz</p>
                 <p className="text-sm text-gray-400">Butik Sahibi, İstanbul</p>
              </div>
           </div>
        </div>
      </div>

      {/* SAĞ: FORM ALANI */}
      <div className="flex items-center justify-center p-8 lg:p-24 relative">
        
        {/* MOBİL HEADER (Sadece Mobilde Görünür) */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
           <div className="w-8 h-8">
              <Logo />
           </div>
           <span className="font-bold text-lg">butikmodel.ai</span>
        </div>

        <div className="w-full max-w-md space-y-8">
           
           <div className="text-center lg:text-left mt-10 lg:mt-0">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {isSignUp ? "Hesap Oluştur 🚀" : "Tekrar Hoşgeldin 👋"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {isSignUp ? "2 dakika içinde yapay zeka stüdyonu kur." : "Kaldığın yerden devam et."}
              </p>
           </div>

           {/* HATA / BAŞARI MESAJLARI */}
           {errorMsg && (
             <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
               ⚠️ {errorMsg}
             </div>
           )}
           {successMsg && (
             <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2 animate-in slide-in-from-top-2">
               📩 {successMsg}
             </div>
           )}

           <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="isim@sirketiniz.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-gray-700">Şifre</label>
                   {!isSignUp && (
                     <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Şifremi Unuttum?</Link>
                   )}
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  isSignUp ? "Hemen Kaydol" : "Giriş Yap"
                )}
              </button>
           </form>

           <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
           </div>

           <div className="text-center text-sm">
             <span className="text-gray-500">
               {isSignUp ? "Zaten hesabın var mı?" : "Henüz üye değil misin?"}
             </span>{" "}
             <button 
               onClick={() => {
                 setIsSignUp(!isSignUp);
                 setErrorMsg("");
                 setSuccessMsg("");
               }}
               className="font-bold text-black hover:underline transition-all"
             >
               {isSignUp ? "Giriş Yap" : "Şimdi Kaydol"}
             </button>
           </div>

        </div>
      </div>
    </div>
  );
}