"use client";

import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import Chat from "../../../components/Chat";

type RoomType = "couple" | "family" | "friends";

const roomConfig = {
  couple: {
    icon: "❤️",
    title: "Çiftler Odası",
    subtitle:
      "Birlikte konuşun, oynayın ve vakit geçirin.",
    gradient:
      "from-pink-500 to-purple-500",
  },

  family: {
    icon: "👨‍👩‍👧‍👦",
    title: "Aile Odası",
    subtitle:
      "Ailenizle birlikte güzel vakit geçirin.",
    gradient:
      "from-blue-500 to-purple-500",
  },

  friends: {
    icon: "👥",
    title: "Arkadaş Odası",
    subtitle:
      "Arkadaşlarınla konuş, oyna ve eğlen.",
    gradient:
      "from-green-500 to-cyan-500",
  },
};

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = params.roomId as string;

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [micOn, setMicOn] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [chatOpen, setChatOpen] =
    useState(false);

  const [gamesOpen, setGamesOpen] =
    useState(false);

  const rawType =
    searchParams.get("type");

  const roomType: RoomType =
    rawType === "family" ||
    rawType === "friends" ||
    rawType === "couple"
      ? rawType
      : "couple";

  const config =
    roomConfig[roomType];

  const roomBackground =
    roomType === "couple"
      ? {
          backgroundColor: "#220914",
          backgroundImage: `
            radial-gradient(circle at 8% 10%, rgba(255, 70, 130, 0.58), transparent 26%),
            radial-gradient(circle at 92% 8%, rgba(202, 80, 180, 0.42), transparent 28%),
            radial-gradient(circle at 78% 62%, rgba(255, 65, 125, 0.30), transparent 30%),
            radial-gradient(circle at 22% 82%, rgba(155, 45, 105, 0.28), transparent 28%),
            linear-gradient(135deg, #3b1024 0%, #521331 28%, #351027 58%, #170a16 100%)
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : roomType === "family"
      ? {
          backgroundColor: "#0c1722",
          backgroundImage: `
            radial-gradient(circle at 10% 12%, rgba(82, 158, 225, 0.34), transparent 28%),
            radial-gradient(circle at 88% 10%, rgba(240, 185, 92, 0.24), transparent 25%),
            radial-gradient(circle at 78% 78%, rgba(75, 125, 175, 0.22), transparent 30%),
            radial-gradient(circle at 18% 88%, rgba(180, 155, 85, 0.16), transparent 28%),
            linear-gradient(135deg, #143049 0%, #183246 35%, #112432 65%, #09121b 100%)
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          backgroundColor: "#071a20",
          backgroundImage: `
            radial-gradient(circle at 10% 14%, rgba(40, 205, 190, 0.34), transparent 28%),
            radial-gradient(circle at 90% 10%, rgba(70, 125, 245, 0.30), transparent 26%),
            radial-gradient(circle at 78% 78%, rgba(35, 175, 200, 0.24), transparent 30%),
            radial-gradient(circle at 18% 86%, rgba(45, 115, 210, 0.18), transparent 28%),
            linear-gradient(135deg, #0d3440 0%, #0c2c38 38%, #0a202b 66%, #071017 100%)
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };

  /* =========================
     CAMERA
  ========================= */

  const startCamera = async () => {
    try {
      setCameraError("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;
      }

      setCameraOn(true);
      setMicOn(true);
    } catch (error) {
      console.error(error);

      setCameraError(
        "Kamera veya mikrofon erişimine izin verilmedi."
      );
    }
  };

  const toggleCamera = () => {
    if (!streamRef.current) {
      startCamera();
      return;
    }

    streamRef.current
      .getVideoTracks()
      .forEach((track) => {
        track.enabled = !track.enabled;
      });

    setCameraOn((prev) => !prev);
  };

  const toggleMic = () => {
    if (!streamRef.current) {
      startCamera();
      return;
    }

    streamRef.current
      .getAudioTracks()
      .forEach((track) => {
        track.enabled = !track.enabled;
      });

    setMicOn((prev) => !prev);
  };

  /* =========================
     END CALL
  ========================= */

  const endCall = () => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;

    setCameraOn(false);
    setMicOn(false);

    router.push("/");
  };

  /* =========================
     CLEANUP
  ========================= */

  useEffect(() => {
    return () => {
      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  /* =========================
     OPEN GAME
  ========================= */

  const openGame = (game: string) => {
    router.push(
      `/games/${game}?room=${encodeURIComponent(
        roomId
      )}&type=${roomType}`
    );
  };

  return (
    <main
      className="min-h-screen text-white px-3 py-4 sm:px-6 sm:py-6 transition-all duration-500"
      style={{
        ...roomBackground,
        minHeight: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-7">

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="min-h-10 px-3 sm:px-4 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition text-sm"
          >
            ← TOGETRA
          </button>

          <div className="px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 shrink-0">

            <span className="text-white/40 text-xs sm:text-sm">
              Oda
            </span>{" "}

            <span className="font-semibold text-xs sm:text-sm">
              {roomId}
            </span>

          </div>

        </div>

        {/* =========================
            ROOM TITLE
        ========================= */}

        <div className="mb-5 sm:mb-7">

          <div className="flex items-center gap-3">

            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl sm:text-3xl`}
            >
              {config.icon}
            </div>

            <div>

              <h1 className="text-xl sm:text-2xl font-bold">
                {config.title}
              </h1>

              <p className="text-white/40 text-xs sm:text-sm mt-1">
                {config.subtitle}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            VIDEO AREA
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">

          {/* PARTNER */}

          <div className="aspect-video rounded-2xl sm:rounded-3xl border border-white/10 bg-[#15141a] flex items-center justify-center overflow-hidden">

            <div className="text-center px-4">

              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl sm:text-3xl font-bold mb-3 sm:mb-4`}
              >
                ?
              </div>

              <p className="font-semibold text-sm sm:text-base">
                Diğer kişi bekleniyor...
              </p>

              <p className="text-white/40 text-xs sm:text-sm mt-1">
                Oda kodunu paylaş
              </p>

            </div>

          </div>

          {/* YOU */}

          <div className="aspect-video rounded-2xl sm:rounded-3xl border border-white/10 bg-black overflow-hidden relative">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${
                cameraOn
                  ? "block"
                  : "hidden"
              }`}
            />

            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4">
                    M
                  </div>

                  <p className="text-white/60 text-sm">
                    Kameran kapalı
                  </p>

                </div>

              </div>
            )}

            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs sm:text-sm">
              Sen
            </div>

          </div>

        </div>

        {/* =========================
            CAMERA ERROR
        ========================= */}

        {cameraError && (
          <div className="mt-3 sm:mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 sm:p-4 text-red-300 text-xs sm:text-sm">
            {cameraError}
          </div>
        )}

        {/* =========================
            CONTROLS
        ========================= */}

        <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3 flex-wrap">

          <button
            type="button"
            onClick={toggleMic}
            className={`min-h-11 sm:min-h-12 px-4 sm:px-6 rounded-2xl font-semibold text-sm transition ${
              micOn
                ? "bg-white/10 hover:bg-white/15"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {micOn
              ? "🎤 Açık"
              : "🔇 Kapalı"}
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className={`min-h-11 sm:min-h-12 px-4 sm:px-6 rounded-2xl font-semibold text-sm transition ${
              cameraOn
                ? "bg-white/10 hover:bg-white/15"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {cameraOn
              ? "📷 Açık"
              : "📷 Kapalı"}
          </button>

          <button
            type="button"
            onClick={() => {
              setChatOpen(
                (prev) => !prev
              );

              setGamesOpen(false);
            }}
            className={`min-h-11 sm:min-h-12 px-4 sm:px-6 rounded-2xl font-semibold text-sm transition ${
              chatOpen
                ? "bg-purple-500 text-white"
                : "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/20"
            }`}
          >
            💬 Chat
          </button>

          <button
            type="button"
            onClick={() => {
              setGamesOpen(
                (prev) => !prev
              );

              setChatOpen(false);
            }}
            className={`min-h-11 sm:min-h-12 px-4 sm:px-6 rounded-2xl font-semibold text-sm transition ${
              gamesOpen
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-white/10 hover:bg-white/15 border border-white/10"
            }`}
          >
            🎮 Oyunlar
          </button>

          <button
            type="button"
            onClick={endCall}
            className="min-h-11 sm:min-h-12 px-4 sm:px-6 rounded-2xl bg-red-500/80 hover:bg-red-500 font-semibold text-sm transition"
          >
            Görüşmeyi Bitir
          </button>

        </div>

        {/* =========================
            GAME CENTER
        ========================= */}

        {gamesOpen && (
          <section className="mt-5 sm:mt-6 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-4 sm:p-6 shadow-2xl shadow-purple-500/10">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">

              <div>

                <p className="text-purple-300 text-xs font-semibold tracking-[0.18em]">
                  OYUN MERKEZİ
                </p>

                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  Birlikte ne oynayalım? 🎮
                </h2>

                <p className="text-white/40 text-sm mt-1">
                  Oyunu seç ve başlayın.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/games")
                }
                className="text-sm text-purple-300 hover:text-purple-200 font-semibold"
              >
                Tüm oyunlar →
              </button>

            </div>

            {/* =========================
                10 GAME CARDS
            ========================= */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

              {/* 1 - DÖRT SIRA */}

              <GameCard
                icon="⭕"
                title="Dört Sıra"
                description="4'lü strateji"
                onClick={() =>
                  openGame("tictactoe")
                }
              />

              {/* 2 - RENK KAPIŞMASI */}

              <GameCard
                icon="🃏"
                title="Renk Kapışması"
                description="Kart oyunu"
                onClick={() =>
                  openGame("uno")
                }
              />

              {/* 3 - HAFIZA EŞLEŞMESİ */}

              <GameCard
                icon="🧠"
                title="Hafıza Eşleşmesi"
                description="Kartları eşleştir"
                onClick={() =>
                  openGame("memory")
                }
              />

              {/* 4 - BİL BAKALIM */}

              <GameCard
                icon="❓"
                title="Bil Bakalım"
                description="Bilgi oyunu"
                onClick={() =>
                  openGame("quiz")
                }
              />

              {/* 5 - BİRLİKTE ÇİZ */}

              <GameCard
                icon="🎨"
                title="Birlikte Çiz"
                description="Birlikte çiz ve eğlen"
                onClick={() =>
                  openGame("draw")
                }
              />

              {/* 6 - TAHTIN EFENDİSİ */}

              <GameCard
                icon="♟️"
                title="Tahtın Efendisi"
                description="Klasik strateji oyunu"
                onClick={() =>
                  openGame("chess")
                }
              />

              {/* 7 - PUZZLE */}

              <GameCard
                icon="🧩"
                title="Puzzle"
                description="Parçaları birleştir"
                onClick={() =>
                  openGame("puzzle")
                }
              />

              {/* 8 - REFLEKS */}

              <GameCard
                icon="⚡"
                title="Refleks"
                description="Ne kadar hızlısın?"
                onClick={() =>
                  openGame("reaction")
                }
              />

              {/* 9 - RPS */}

              <GameCard
                icon="✊"
                title="Taş Kağıt Makas"
                description="Hamleni seç"
                onClick={() =>
                  openGame("rps")
                }
              />

              {/* 10 - WORD */}

              <GameCard
                icon="🔤"
                title="Kelime Oyunu"
                description="Kelimeyi bul"
                onClick={() =>
                  openGame("word")
                }
              />

            </div>

          </section>
        )}

        {/* =========================
            CHAT
        ========================= */}

        {chatOpen && (
          <div className="mt-5 sm:mt-6 w-full rounded-3xl overflow-hidden border border-purple-400/20 bg-[#0d0c16] shadow-2xl shadow-purple-500/10">

            <div className="h-[600px] w-full">

              <Chat
                onClose={() =>
                  setChatOpen(false)
                }
                messages={[]}
                currentUsername="Sen"
                partnerName="Diğer kişi"
                onSendMessage={() => {}}
              />

            </div>

          </div>
        )}

        {/* =========================
            ROOM INFO
        ========================= */}

        <div className="mt-5 sm:mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-white/40 text-xs sm:text-sm">
                Özel Oda
              </p>

              <h2 className="text-lg sm:text-xl font-bold mt-1">
                {roomId}
              </h2>

              <p className="text-white/30 text-xs mt-1">
                {config.icon}{" "}
                {config.title}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard
                  .writeText(roomId)
                  .catch(() => {})
              }
              className="w-full sm:w-auto min-h-11 px-5 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/20 transition text-sm"
            >
              📋 Oda Kodunu Kopyala
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}

/* =========================
   GAME CARD
========================= */

function GameCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] hover:border-purple-400/30 transition active:scale-[0.98]"
    >

      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-105 transition">
        {icon}
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-xs text-white/35 mt-1">
        {description}
      </p>

      <p className="text-xs text-purple-300 mt-4 font-semibold">
        Oyna →
      </p>

    </button>
  );
}