"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const KVKK_STORAGE_KEY = "togetra_kvkk_read";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     KVKK DURUMUNU KONTROL ET
  ========================= */
  useEffect(() => {
    function checkKvkkStatus() {
      const read = localStorage.getItem(KVKK_STORAGE_KEY) === "true";
      if (read) {
        setKvkkAccepted(true);
      }
    }

    checkKvkkStatus();

    function handleStorage(event: StorageEvent) {
      if (event.key === KVKK_STORAGE_KEY && event.newValue === "true") {
        setKvkkAccepted(true);
      }
    }

    function handleFocus() {
      checkKvkkStatus();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  function openKvkk() {
    window.open("/kvkk?from=register", "_blank");
  }

  /* =========================
     REGISTER (API ENTEGRE)
  ========================= */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Kullanıcı adı alanını doldurmalısın.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Geçerli bir e-posta adresi girmelisin.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (!kvkkAccepted) {
      setError("Kayıt olabilmek için KVKK metnini onaylamanız gerekmektedir.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://localhost:7269/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
          kvkkApproved: kvkkAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kayıt işlemi başarısız oldu. Bilgilerini kontrol et.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username || username);
        localStorage.setItem("userId", data.id || "");
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08070d] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-100px] top-[-100px] h-[320px] w-[320px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute right-[-100px] top-[15%] h-[320px] w-[320px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[-120px] left-[25%] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-[0.25em] text-white sm:text-2xl">
            TOGETRA
          </Link>
          <Link href="/login" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
            Giriş Yap
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section className="px-5 py-10 sm:py-16">
        <div className="mx-auto w-full max-w-xl">
          {/* TITLE */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-2xl">
              ✦
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
              TOGETRA
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Hesap Oluştur
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/45">
              Kendi hesabını oluştur ve TOGETRA&apos;da birlikte vakit geçirmeye başla.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {/* KULLANICI ADI */}
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/70">
                  Kullanıcı adı
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="kullaniciadi"
                  autoComplete="off"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-400/40 focus:bg-black/30"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ornek@mail.com"
                  autoComplete="off"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-400/40 focus:bg-black/30"
                />
              </div>

              {/* ŞİFRE */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/70">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="En az 6 karakter"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-400/40 focus:bg-black/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2.5 py-2 text-xs font-medium text-white/45 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              {/* ŞİFRE TEKRAR */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-white/70">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Şifreni tekrar yaz"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-400/40 focus:bg-black/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2.5 py-2 text-xs font-medium text-white/45 transition hover:bg-white/5 hover:text-white"
                  >
                    {showConfirmPassword ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              {/* KVKK */}
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-start gap-3">
                  <input
                    id="kvkkAccepted"
                    type="checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setKvkkAccepted(checked);
                      if (checked) {
                        localStorage.setItem(KVKK_STORAGE_KEY, "true");
                      } else {
                        localStorage.removeItem(KVKK_STORAGE_KEY);
                      }
                    }}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-purple-500"
                  />
                  <label htmlFor="kvkkAccepted" className="cursor-pointer text-sm leading-6 text-white/55">
                    <button
                      type="button"
                      onClick={openKvkk}
                      className="text-left text-purple-300 underline underline-offset-2 transition hover:text-purple-200"
                    >
                      KVKK Aydınlatma Metni
                    </button>{" "}
                    &apos;ni okudum ve bilgi edindim.
                  </label>
                </div>

                {!kvkkAccepted && (
                  <p className="mt-3 ml-8 text-xs leading-5 text-white/30">
                    Kutucuğu işaretleyerek veya metni inceleyerek onay verebilirsin.
                  </p>
                )}

                {kvkkAccepted && (
                  <p className="mt-3 ml-8 text-xs font-medium text-emerald-300/80">
                    ✓ KVKK Aydınlatma Metni onaylandı.
                  </p>
                )}
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
              </button>
            </form>

            {/* LOGIN */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-white/40">Zaten hesabın var mı?</p>
              <Link href="/login" className="mt-2 inline-block text-sm font-semibold text-purple-300 transition hover:text-purple-200">
                Giriş Yap →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}