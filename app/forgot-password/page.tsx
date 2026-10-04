"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSent(false);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("E-posta adresini gir.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Geçerli bir e-posta adresi gir.");
      return;
    }

    setLoading(true);

    try {
      // Şimdilik demo amaçlı bekleme
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setSent(true);
    } catch (error) {
      console.error(error);
      setError(
        "İşlem sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08070d] text-white px-4 py-6 flex items-center justify-center">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-3 mx-auto mb-8"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
            T
          </div>

          <span className="text-xl font-bold">
            TOGETRA
          </span>
        </button>

        {/* CARD */}

        <section className="rounded-3xl border border-white/10 bg-[#101016] p-6 sm:p-8">

          {/* TITLE */}

          <div className="text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-2xl">
              🔐
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mt-5">
              Şifreni mi unuttun?
            </h1>

            <p className="text-white/40 text-sm mt-3 leading-6">
              Hesabına kayıtlı e-posta adresini gir.
              Şifre yenileme bağlantısı gönderilecek.
            </p>

          </div>

          {!sent ? (
            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              {/* EMAIL */}

              <label className="block text-sm font-medium text-white/60 mb-2">
                E-posta
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="ornek@email.com"
                autoComplete="email"
                className="w-full h-12 rounded-xl bg-[#17171e] border border-white/10 px-4 text-white placeholder:text-white/25 outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 transition"
              />

              {/* ERROR */}

              {error && (
                <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 mt-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 transition font-bold"
              >
                {loading
                  ? "Gönderiliyor..."
                  : "📩 Şifre Yenileme Bağlantısı Gönder"}
              </button>

            </form>
          ) : (
            /* SUCCESS */

            <div className="mt-7">

              <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-5">

                <div className="text-3xl">
                  ✅
                </div>

                <h2 className="font-bold text-lg mt-3">
                  Talebin alındı
                </h2>

                <p className="text-white/40 text-sm mt-2 leading-6">
                  Şifre yenileme bağlantısı için
                  e-posta kutunu kontrol et.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="w-full min-h-11 mt-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-semibold"
              >
                Farklı e-posta kullan
              </button>

            </div>
          )}

          {/* BACK TO LOGIN */}

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full mt-5 min-h-11 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition text-sm"
          >
            ← Giriş Yap'a Dön
          </button>

        </section>

        {/* INFO */}

        <p className="text-center text-white/20 text-xs mt-6">
          TOGETRA · Your people. Your room. Your time.
        </p>

      </div>

    </main>
  );
}