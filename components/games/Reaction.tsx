"use client";

import { useEffect, useState } from "react";

type ReactionGameProps = {
  roomId: string;
  connection: any;
  currentUsername: string;
  partnerName: string;
  partnerConnectionId: string;
  onClose: () => void;
};

export default function ReactionGame({
  roomId,
  connection,
  currentUsername,
  partnerName,
  partnerConnectionId,
  onClose,
}: ReactionGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [isTargetActive, setIsTargetActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [scores, setScores] = useState({ me: 0, partner: 0 });
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earlyClickWarning, setEarlyClickWarning] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const handleStarted = (data: { round: number; maxRounds: number }) => {
      setGameStarted(true);
      setCurrentRound(data.round);
      setMaxRounds(data.maxRounds);
      setScores({ me: 0, partner: 0 });
      setIsGameOver(false);
      setIsTargetActive(false);
      setRoundWinner(null);
      setLastReactionTime(null);
      setEarlyClickWarning(false);
    };

    const handleTargetSpawned = () => {
      setIsTargetActive(true);
      setEarlyClickWarning(false);
    };

    const handleRoundEnded = (data: {
      winnerConnectionId: string;
      reactionTimeMs: number;
      player1Score: number;
      player2Score: number;
      currentRound: number;
      isGameOver: boolean;
    }) => {
      setIsTargetActive(false);
      setLastReactionTime(data.reactionTimeMs);

      const wonByMe = data.winnerConnectionId === connection.connectionId;
      setRoundWinner(wonByMe ? currentUsername : partnerName);

      setScores({
        me: wonByMe ? data.player1Score : data.player2Score,
        partner: wonByMe ? data.player2Score : data.player1Score,
      });

      setCurrentRound(data.currentRound);
      setIsGameOver(data.isGameOver);
    };

    connection.on("ReactionGameStarted", handleStarted);
    connection.on("ReactionTargetSpawned", handleTargetSpawned);
    connection.on("ReactionRoundEnded", handleRoundEnded);

    return () => {
      connection.off("ReactionGameStarted", handleStarted);
      connection.off("ReactionTargetSpawned", handleTargetSpawned);
      connection.off("ReactionRoundEnded", handleRoundEnded);
    };
  }, [connection, currentUsername, partnerName]);

  const startGame = () => {
    if (connection?.state === "Connected") {
      connection.invoke("StartReactionGame", roomId, partnerConnectionId).catch(console.error);
    }
  };

  const handleClickTarget = () => {
    if (!isTargetActive) {
      setEarlyClickWarning(true);
      return;
    }

    if (connection?.state === "Connected") {
      connection.invoke("ClickReactionTarget", roomId).catch(console.error);
    }
  };

  return (
    <section className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
            Hız & Dikkat
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">⚡ Refleks Kapışması</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 active:scale-95"
        >
          ✕ Oyunu Kapat
        </button>
      </header>

      {/* SKOR VE ROUND BİLGİSİ */}
      {gameStarted && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-white/50">{currentUsername}</span>
              <p className="text-2xl font-black text-purple-400">{scores.me}</p>
            </div>
            <div className="text-xs font-bold text-white/20">VS</div>
            <div>
              <span className="text-xs text-white/50">{partnerName}</span>
              <p className="text-2xl font-black text-pink-400">{scores.partner}</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70">
            Tur: {Math.min(currentRound, maxRounds)} / {maxRounds}
          </div>
        </div>
      )}

      {/* GİRİŞ EKRANI */}
      {!gameStarted && (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-3xl">
            ⚡
          </div>
          <h3 className="text-xl font-bold">En Hızlı Olan Kazanır!</h3>
          <p className="mt-2 text-xs text-white/50">
            Ekran yeşile döndüğü ve buton belirdiği anda tıkla. Erken basarsan ceza alırsın!
          </p>
          <button
            onClick={startGame}
            className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            Düelloyu Başlat
          </button>
        </div>
      )}

      {/* OYUN SAHASI */}
      {gameStarted && !isGameOver && (
        <div className="flex flex-col items-center justify-center">
          <div
            onClick={handleClickTarget}
            className={`flex h-64 w-full cursor-pointer select-none flex-col items-center justify-center rounded-3xl border transition-all duration-150 ${
              isTargetActive
                ? "border-emerald-400 bg-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse"
                : "border-white/10 bg-black/40 hover:bg-black/50"
            }`}
          >
            {isTargetActive ? (
              <>
                <span className="text-5xl">⚡</span>
                <span className="mt-2 text-2xl font-black tracking-wider text-emerald-300">TIKLA!</span>
              </>
            ) : (
              <>
                <span className="text-3xl">⏳</span>
                <span className="mt-2 text-sm font-semibold text-white/40">Bekle... Yeşili gör ve bas!</span>
                {earlyClickWarning && (
                  <span className="mt-2 text-xs font-bold text-red-400">Erken bastın! Bekle.</span>
                )}
              </>
            )}
          </div>

          {roundWinner && lastReactionTime !== null && (
            <p className="mt-4 text-xs font-bold text-white/70">
              Son turu <span className="text-fuchsia-400">{roundWinner}</span> ({lastReactionTime} ms) kazandı.
            </p>
          )}
        </div>
      )}

      {/* OYUN BİTİŞ EKRANI */}
      {isGameOver && (
        <div className="mt-6 rounded-2xl border border-purple-400/30 bg-purple-500/20 p-5 text-center">
          <h4 className="text-xl font-black text-white">Yarışma Bitti! 🏆</h4>
          <p className="mt-2 text-sm text-white/80">
            {scores.me === scores.partner
              ? "Dostluk kazandı! Berabere."
              : scores.me > scores.partner
              ? `Tebrikler ${currentUsername}, daha hızlıydın!`
              : `${partnerName} bu sefer daha hızlı davrandı!`}
          </p>
          <button
            onClick={startGame}
            className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white active:scale-95"
          >
            Tekrar Yarış
          </button>
        </div>
      )}
    </section>
  );
}