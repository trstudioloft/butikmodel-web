export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gray-50">
      {/* Mor Top */}
      <div className="absolute top-0 left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      {/* Sarı Top */}
      <div className="absolute top-0 right-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      {/* Pembe Top */}
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  );
}