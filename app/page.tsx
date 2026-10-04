"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LegalFooter from "../components/LegalFooter";

export default function HomePage() {
  const router = useRouter();

  const [username, setUsername] =
    useState<string | null>(null);

  /*
  ==========================================
  KULLANICIYI YÜKLE
  ==========================================
  */

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username");

    const token =
      localStorage.getItem("token");

    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  /*
  ==========================================
  ÇIKIŞ
  ==========================================
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setUsername(null);

    router.push("/");
  };

  /*
  ==========================================
  ODA TÜRLERİ
  ==========================================
  */

  const roomTypes = [
    {
      type: "couple",
      icon: "❤️",
      title: "Çiftler Odası",
      tag: "Özel & Romantik",
      description:
        "Sadece ikinize özel odada görüntülü konuşun, mesajlaşın ve oyunlar oynayın.",
      colors:
        "from-pink-500/20 via-purple-500/10 to-pink-500/5 border-pink-400/20 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    },
    {
      type: "friends",
      icon: "👥",
      title: "Arkadaş Grubu",
      tag: "Eğlence & Rekabet",
      description:
        "Arkadaşlarınla odanı kur, strateji oyunlarında yarış ve doyasıya eğlen.",
      colors:
        "from-emerald-500/20 via-cyan-500/10 to-emerald-500/5 border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
    {
      type: "family",
      icon: "👨‍👩‍👧‍👦",
      title: "Aile Buluşması",
      tag: "Sıcak & Güvenli",
      description:
        "Uzakta olsanız bile mesafeleri kapatın, birlikte vakit geçirin ve hatıralar biriktirin.",
      colors:
        "from-blue-500/20 via-purple-500/10 to-blue-500/5 border-blue-400/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    },
  ];

  /*
  ==========================================
  ÖZELLİKLER
  ==========================================
  */

  const features = [
    {
      icon: "📹",
      title: "Kesintisiz Görüntülü Arama",
      description:
        "WebRTC tabanlı yüksek kaliteli ve düşük gecikmeli eşzamanlı görüşme.",
    },
    {
      icon: "🎮",
      title: "10+ Gerçek Zamanlı Oyun",
      description:
        "TicTacToe, Uno, Çizim, Hafıza ve çok daha fazlası SignalR ile anlık senkronize.",
    },
    {
      icon: "🔒",
      title: "Tamamen Size Özel",
      description:
        "Yabancılarla eşleşme yok. Yalnızca davet ettiğiniz kişilerle güvenli alan.",
    },
  ];

  /*
  ==========================================
  ODA OLUŞTUR
  ==========================================
  */

  function selectRoom(type: string) {
    router.push(
      `/room/create?type=${type}`
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#060509] text-white selection:bg-purple-500 selection:text-white">

      {/* ====================================
          ARKA PLAN
      ==================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[140px]" />

        <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-pink-500/10 blur-[140px]" />

        <div className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      </div>

      {/* ====================================
          NAVBAR
      ==================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060509]/85 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-[0.25em] text-white sm:text-2xl"
          >
            <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_14px_rgba(168,85,247,0.5)]" />

            <span>
              TOGETRA
            </span>
          </Link>

          {/* SAĞ MENÜ */}

          <div className="flex items-center gap-2 sm:gap-3">

            {username ? (
              <>
                {/* PROFİL */}

                <Link
                  href="/profile"
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-purple-400/25 bg-purple-500/10 px-4 text-sm font-semibold text-purple-200 transition hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white"
                >
                  <span>👤</span>

                  <span>
                    Profil
                  </span>
                </Link>

                {/* KULLANICI */}

                <div className="hidden sm:flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4">

                  <span className="text-base">
                    ✨
                  </span>

                  <span className="max-w-[150px] truncate text-sm font-semibold text-white">
                    {username}
                  </span>

                </div>

                {/* ÇIKIŞ */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="min-h-11 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                {/* GİRİŞ */}

                <Link
                  href="/login"
                  className="min-h-11 flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Giriş Yap
                </Link>

                {/* KAYIT */}

                <Link
                  href="/register"
                  className="min-h-11 flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition hover:opacity-90"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

          </div>

        </div>

      </header>

      {/* ====================================
          HERO
      ==================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:pb-32 sm:pt-28">

        <div className="mx-auto max-w-4xl text-center">

          {/* WELCOME */}

          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md">

            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />

            {username
              ? `Hoş geldin, ${username}! Özel odan seni bekliyor.`
              : "Sevdiklerinizle buluşmanın en eğlenceli yolu"}

          </div>

          {/* BAŞLIK */}

          <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">

            Aynı odada değil misiniz?

            <span className="mt-2 block bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Fark etmez, buradayız.
            </span>

          </h1>

          {/* AÇIKLAMA */}

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Özel odanızı oluşturun,
            kameranızı açın, sohbet edin ve
            eşzamanlı oyun motorlarımızla
            vakit geçirmeyi unutulmaz kılın.
          </p>

          {/* ANA BUTONLAR */}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/room/create?type=couple"
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
            >
              Hemen Oda Kur →
            </Link>

            <Link
              href="/join"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              Odaya Katıl
            </Link>

            {!username && (
              <Link
                href="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
              >
                Hesabına Giriş Yap
              </Link>
            )}

          </div>

        </div>

      </section>

      {/* ====================================
          ROOM TYPES
      ==================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-20">

        <div className="mb-12 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
            Özel Alanlar
          </p>

          <h2 className="mt-3 text-2xl font-black sm:text-4xl">
            Kiminle vakit geçirmek istiyorsun?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
            Size uygun oda konseptini seçin
            ve saniyeler içinde bağlantı kurun.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {roomTypes.map(
            (room) => (
              <button
                key={room.type}
                type="button"
                onClick={() =>
                  selectRoom(
                    room.type
                  )
                }
                className={`group relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 ${room.colors}`}
              >

                <div className="absolute right-0 top-0 p-6 text-6xl opacity-10 transition group-hover:opacity-20">
                  {room.icon}
                </div>

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-2xl shadow-md">
                    {room.icon}
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {room.tag}
                  </span>

                </div>

                <h3 className="text-2xl font-black">
                  {room.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {room.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-purple-300 transition group-hover:translate-x-1">

                  <span>
                    Odayı Oluştur
                  </span>

                  <span>
                    →
                  </span>

                </div>

              </button>
            )
          )}

        </div>

      </section>

      {/* ====================================
          FEATURES
      ==================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-20">

        <div className="mb-12 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
            Üstün Özellikler
          </p>

          <h2 className="mt-3 text-2xl font-black sm:text-4xl">
            Aynı odada olmasanız bile hep birlikte
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {features.map(
            (feature, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition hover:border-purple-400/30 hover:bg-white/[0.05]"
              >

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-purple-500/10 text-2xl shadow-inner">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  {feature.description}
                </p>

              </div>
            )
          )}

        </div>

      </section>

      {/* ====================================
          GİZLİLİK
      ==================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-20">

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-purple-900/20 via-black/40 to-blue-900/20 p-8 backdrop-blur-2xl sm:p-14">

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
                Gizlilik Odaklı Mimari
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-4xl">
                Yabancılarla değil,
                tanıdıklarınızla.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
                Platformumuz rastgele
                eşleştirme sistemleri barındırmaz.
                Sadece davet kodunu paylaştığınız
                sevdiklerinizle izole ve şifrelenmiş
                odalarda buluşursunuz.
              </p>

            </div>

            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              Gizlilik Politikası →
            </Link>

          </div>

        </div>

      </section>

      {/* ====================================
          FOOTER
      ==================================== */}

      <LegalFooter />

    </main>
  );
}