"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent, type: "LOGIN" | "SIGNUP") => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (type === "SIGNUP") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: email.split("@")[0] }, // İsim olarak mailin başını al
          },
        });
        if (error) throw error;
        setMessage("✅ Kayıt başarılı! Lütfen mail kutunuza gelen onayı tıklayın.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/"); // Giriş yapınca ana sayfaya at
        router.refresh();
      }
    } catch (error: any) {
      setMessage("❌ Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-2xl">B</div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Hesabınıza Giriş Yapın
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 shadow-xl rounded-xl border border-gray-100">
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              E-posta Adresi
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Şifre
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-md ${message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={(e) => handleLogin(e, "LOGIN")}
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-black px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
            >
              {loading ? "..." : "Giriş Yap"}
            </button>
            <button
              onClick={(e) => handleLogin(e, "SIGNUP")}
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-2.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Kayıt Ol
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href="/" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            ← Ana Sayfaya Dön
          </Link>
        </p>
      </div>
    </div>
  );
}