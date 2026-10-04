"use client";

import { useRouter } from "next/navigation";

type Game = {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
};

const GAMES: Game[] = [
  {
    id: "xox",
    title: "Dört Sıra",
    description:
      "4 taşı aynı sırada birleştir ve kazan.",
    icon: "⭕",
    active: true,
  },
  {
    id: "uno",
    title: "Renk Kapışması",
    description:
      "Kartlarını oyna ve elini ilk bitiren ol.",
    icon: "🃏",
    active: true,
  },
  {
    id: "memory",
    title: "Hafıza Eşleşmesi",
    description:
      "Eşleşen kartları bul.",
    icon: "🧠",
    active: true,
  },
  {
    id: "quiz",
    title: "Bil Bakalım",
    description:
      "Soruları cevapla ve puanını yükselt.",
    icon: "❓",
    active: true,
  },
  {
    id: "draw",
    title: "Birlikte Çiz",
    description:
      "Çiz, tahmin et ve eğlen.",
    icon: "🎨",
    active: true,
  },
  {
    id: "chess",
    title: "Tahtın Efendisi",
    description:
      "Klasik satrançta hamleni yap.",
    icon: "♟️",
    active: true,
  },
  {
    id: "checkers",
    title: "Dama",
    description:
      "Taşlarını ilerlet ve rakibinin taşlarını al.",
    icon: "⚫",
    active: false,
  },
  {
    id: "reaction",
    title: "Refleks",
    description:
      "Hedefe en hızlı şekilde bas.",
    icon: "⚡",
    active: true,
  },
  {
    id: "puzzle",
    title: "Puzzle",
    description:
      "Parçaları birleştir ve resmi tamamla.",
    icon: "🧩",
    active: true,
  },
  {
    id: "rps",
    title: "Taş Kağıt Makas",
    description:
      "Hamleni seç ve rakibine karşı oyna.",
    icon: "✊",
    active: true,
  },
  {
    id: "word",
    title: "Kelime Oyunu",
    description:
      "Kelimeyi bul.",
    icon: "🔤",
    active: true,
  },
];

export default function GamesPage() {
  const router = useRouter();

  const openGame = (
    game: Game
  ) => {
    if (!game.active) {
      return;
    }

    router.push(
      `/games/${game.id}`
    );
  };

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
          >
            ← Geri
          </button>

          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-300">
              TOGETRA GAME
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Oyun Merkezi
            </h1>
          </div>

          <div className="w-[72px]" />
        </header>

        {/* AÇIKLAMA */}

        <div className="mb-8">
          <p className="max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            Bir oyun seç ve TOGETRA
            odanda eğlenceye başla.
          </p>
        </div>

        {/* OYUNLAR */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GAMES.map(
            (game) => (
              <button
                key={game.id}
                type="button"
                disabled={!game.active}
                onClick={() =>
                  openGame(game)
                }
                className={`group min-h-[220px] rounded-[28px] border p-6 text-left transition ${
                  game.active
                    ? "cursor-pointer border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.06]"
                    : "cursor-not-allowed border-white/5 bg-white/[0.015] opacity-45"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-purple-500/10 text-2xl">
                    {game.icon}
                  </div>

                  {game.active ? (
                    <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      Oyna
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/30">
                      Yakında
                    </span>
                  )}
                </div>

                <h2 className="mt-8 text-xl font-black">
                  {game.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {game.description}
                </p>

                {game.active && (
                  <div className="mt-6 text-sm font-bold text-purple-300 transition group-hover:translate-x-1">
                    Oyunu Aç →
                  </div>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </main>
  );
}