export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto py-20 px-8">
        <a href="/" className="text-sm font-bold text-gray-500 hover:text-black mb-8 block">← Ana Sayfaya Dön</a>
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}