"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/app/lib/config";

export default function LoginPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Lütfen e-posta/kullanıcı adı ve şifre alanlarını doldur.");
      return;
    }

    setLoading(true);

    const targetUrl = `${API_CONFIG.BASE_URL}/api/Auth/login`;
    console.log("[LOGIN ATTEMPT] Hedef URL:", targetUrl);

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          username: emailOrUsername.trim(),
          email: emailOrUsername.trim(),
          password: password,
        }),
      });

      console.log("[LOGIN RESPONSE STATUS]:", response.status);
      const rawText = await response.text();
      console.log("[LOGIN RESPONSE BODY]:", rawText);

      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Sunucu JSON dönmedi (HTTP ${response.status}). Yanıt: ${rawText.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Giriş başarısız. Bilgilerini kontrol et.");
      }

      // Token ve bilgileri kaydet
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("username", data.username || emailOrUsername.trim());
      if (data.id || data.userId) {
        localStorage.setItem("userId", data.id || data.userId);
      }

      console.log("[LOGIN SUCCESS] Yönlendiriliyor...");
      router.push("/");
    } catch (err: any) {
      console.error("[LOGIN CATCH]:", err);
      setError(err.message || "Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-[0.25em] text-white">
            TOGETRA
          </Link>
          <p className="text-gray-400 mt-3 text-sm">
            Your people. Your room. Your time.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold">Tekrar hoş geldin 👋</h1>
            <p className="text-gray-400 mt-2 text-sm">TOGETRA hesabına giriş yap.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-300 mb-2">
                E-posta veya Kullanıcı Adı
              </label>
              <input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="ornek@email.com veya kullanıcı adın"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white placeholder-gray-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Şifre
                </label>
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition">
                  Şifremi unuttum?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 pr-20 text-white placeholder-gray-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-400 hover:text-white transition"
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Henüz hesabın yok mu?{" "}
              <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition">
                Hesap Oluştur
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          TOGETRA özel alanlarınızı korumaya odaklanır.
        </p>
      </div>
    </main>
  );
}