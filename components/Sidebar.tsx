"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Prop ekledik: onClose (Mobilde menüyü kapatmak için)
export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [credits, setCredits] = useState<number | string>("-");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || "");
        try {
            const { data } = await supabase.from("profiles").select("credits").eq("id", session.user.id).single();
            setCredits(data ? data.credits : 0);
        } catch (e) { console.log("Profil hatası"); }
      }
    };
    initData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const icons = {
    home: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
    studio: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    ghost: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    models: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    faceScan: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>,
    text: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    bg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    profile: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
    settings: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    logout: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
  };

  const menuGroups = [
    { title: "ANA MENÜ", items: [{ name: "Genel Bakış", href: "/dashboard", icon: icons.home }] },
    { title: "ÜRETİM ARAÇLARI", items: [
        { name: "Sanal Stüdyo", href: "/dashboard/studio", icon: icons.studio },
        { name: "Hayalet Manken", href: "/dashboard/ghost", icon: icons.ghost },
        { name: "Atmosfer Sihirbazı", href: "/dashboard/background", icon: icons.bg },
        { name: "Metin Yazarı", href: "/dashboard/copywriter", icon: icons.text },
    ]},
    { title: "KÜTÜPHANE", items: [
        { name: "Mankenlerim", href: "/dashboard/my-models", icon: icons.models },
        { name: "Dijital İkiz (YENİ)", href: "/dashboard/train-model", icon: icons.faceScan },
    ]},
    { title: "HESAP", items: [
        { name: "Cüzdan & Profil", href: "/dashboard/profile", icon: icons.profile },
        { name: "Ayarlar", href: "/dashboard/settings", icon: icons.settings },
    ]}
  ];

  return (
    <div className="h-full bg-[#0a0a0a] text-gray-400 flex flex-col justify-between border-r border-gray-900 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        {/* MOBİL İÇİN KAPATMA BUTONU */}
        <div className="flex justify-between items-center mb-8 px-2">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">B</div>
             <span className="font-bold text-lg text-white tracking-tight">butikmodel.ai</span>
           </div>
           {onClose && (
             <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">✕</button>
           )}
        </div>

        <div className="space-y-6">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">{group.title}</h3>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose} // Mobilde tıklayınca menü kapansın
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive ? "bg-white text-black shadow-lg shadow-white/10" : "hover:bg-gray-900 hover:text-white"}`}
                    >
                      <span className={`${isActive ? "text-black" : "text-gray-500 group-hover:text-white"}`}>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 space-y-4 bg-[#0a0a0a] border-t border-gray-900">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><span className="text-4xl">⚡️</span></div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">BAKİYE</p>
          <div className="flex justify-between items-end">
             <span className="text-xl font-bold text-white tracking-tight">{credits}</span>
             <Link href="/dashboard/profile" className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded transition-colors" onClick={onClose}>YÜKLE</Link>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{userEmail.charAt(0).toUpperCase()}</div>
           <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-gray-600 truncate">Ücretsiz Plan</p>
           </div>
           <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Çıkış Yap">{icons.logout}</button>
        </div>
      </div>
    </div>
  );
}