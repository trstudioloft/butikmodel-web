"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile) setCredits(profile.credits);
      setLoading(false);
    }
    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ÜST MENÜ */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl tracking-tight">Butikmodel<span className="text-blue-600">.ai</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-bold items-center gap-2">
            <span>💎</span> {credits} Kredi
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition">Çıkış</button>
        </div>
      </nav>

      {/* ANA İÇERİK */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Başlık */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Ne üretmek istersiniz?</h1>
          <p className="text-gray-500 mt-2">İhtiyacınıza uygun yapay zeka aracını seçin.</p>
        </div>

        {/* HİZMET KARTLARI IZGARASI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* KART 1: AI MANKEN (Aktif) */}
          <Link href="/dashboard/model" className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div className="w-14 h-14 bg-blue-5