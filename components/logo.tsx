"use client";

export default function Logo({ className = "w-8 h-8", dark = false }: { className?: string, dark?: boolean }) {
  // dark prop'u true ise logo beyaz olur (Koyu zeminler için)
  const colorClass = dark ? "text-white" : "text-black";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* İKON: Askı ve Lens Birleşimi */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${colorClass}`}>
        <path d="M50 20C50 14.477 45.523 10 40 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <path d="M20 45L50 30L80 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="20" y="45" width="60" height="45" rx="4" stroke="currentColor" strokeWidth="6"/>
        <circle cx="50" cy="67.5" r="10" stroke="currentColor" strokeWidth="6"/>
        <path d="M50 20V30" stroke="currentColor" strokeWidth="6"/>
      </svg>
      {/* YAZI: Sadece büyük boyda görünürse şık olur */}
    </div>
  );
}