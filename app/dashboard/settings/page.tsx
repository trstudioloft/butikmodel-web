"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-8 min-h-screen font-sans max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayarlar ⚙️</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SOL MENÜ */}
        <div className="w-full lg:w-64 flex-shrink-0">
           <nav className="flex flex-col gap-2">
              {['Genel', 'Faturalandırma', 'Bildirimler', 'Güvenlik'].map((item) => {
                 const id = item.toLowerCase(); // basitleştirilmiş id
                 const isActive = activeTab === id || (activeTab === 'general' && id === 'genel');
                 return (
                   <button 
                     key={item}
                     onClick={() => setActiveTab(id === 'genel' ? 'general' : id)}
                     className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                   >
                     {item}
                   </button>
                 )
              })}
           </nav>
        </div>

        {/* SAĞ İÇERİK */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
           
           {activeTab === 'general' && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold border-b pb-4">Genel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Marka Adı</label>
                      <input type="text" placeholder="Butik İsmi" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Web Sitesi</label>
                      <input type="text" placeholder="www.siteniz.com" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2">Varsayılan Dil</label>
                   <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                      <option>Türkçe</option>
                      <option>English</option>
                   </select>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">Değişiklikleri Kaydet</button>
             </div>
           )}

           {/* Diğer sekmeler için placeholder */}
           {activeTab !== 'general' && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-4xl mb-4">🚧</span>
                <p>Bu ayar paneli yapım aşamasındadır.</p>
             </div>
           )}

        </div>

      </div>
    </div>
  );
}