"use client";

import { useEffect, useState } from "react";

type MemoryGameProps = {
  roomId: string;
  connection: any;
  currentUsername: string;
  partnerName: string;
  partnerConnectionId: string;
  onClose: () => void;
};

type CardState = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryGame({
  roomId,
  connection,
  currentUsername,
  partnerName,
  partnerConnectionId,
  onClose,
}: MemoryGameProps) {
  const [cards, setCards] = useState<CardState[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>("");
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const isMyTurn = connection?.connectionId === currentTurn;

  // SignalR Event Dinleyicileri
  useEffect(() => {
    if (!connection) return;

    const handleStarted = (data: { totalCards: number; currentTurn: string }) => {
      const initialCards: CardState[] = Array.from({ length: data.totalCards }, (_, i) => ({
        id: i,
        value: "?",
        isFlipped: false,
        isMatched: false,
      }));
      setCards(initialCards);
      setCurrentTurn(data.currentTurn);
      setScores({ player1: 0, player2: 0 });
      setIsGameOver(false);
      setGameStarted(true);
    };

    const handleCardFlipped = (data: {
      cardIndex: number;
      cardValue: string;
      isMatch: boolean;
      turnSwitched: boolean;
      currentTurn: string;
      player1Score: number;
      player2Score: number;
      isGameOver: boolean;
    }) => {
      setCards((prev) =>
        prev.map((card, idx) => {
          if (idx === data.cardIndex) {
            return {
              ...card,
              value: data.cardValue,
              isFlipped: true,
              isMatched: data.isMatch ? true : card.isMatched,
            };
          }
          return card;
        })
      );

      // Eşleşme olmadıysa ve sıra değiştiyse açık kartları kısa bir süre sonra kapat
      if (data.turnSwitched && !data.isMatch) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: false, value: "?" }))
          );
        }, 900);
      }

      setCurrentTurn(data.currentTurn);
      setScores({ player1: data.player1Score, player2: data.player2Score });
      setIsGameOver(data.isGameOver);
    };

    connection.on("MemoryGameStarted", handleStarted);
    connection.on("MemoryCardFlipped", handleCardFlipped);

    return () => {
      connection.off("MemoryGameStarted", handleStarted);
      connection.off("MemoryCardFlipped", handleCardFlipped);
    };
  }, [connection]);

  const handleStart = () => {
    if (connection?.state === "Connected") {
      connection.invoke("StartMemoryGame", roomId, partnerConnectionId).catch(console.error);
    }
  };

  const handleCardClick = (index: number) => {
    if (!isMyTurn || cards[index].isFlipped || cards[index].isMatched) return;

    if (connection?.state === "Connected") {
      connection.invoke("FlipMemoryCard", roomId, index).catch(console.error);
    }
  };

  return (
    <section className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* HEADER */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
            Zihin Düellosu
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">🧠 Hafıza Eşleşmesi</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 active:scale-95"
        >
          ✕ Oyunu Kapat
        </button>
      </header>

      {/* SKOR VE SIRA GÖSTERGESİ */}
      {gameStarted && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <span className="text-xs text-white/50">{currentUsername} (P1)</span>
              <p className="text-xl font-black text-purple-400">{scores.player1}</p>
            </div>
            <div className="text-sm font-bold text-white/20">vs</div>
            <div className="text-left">
              <span className="text-xs text-white/50">{partnerName} (P2)</span>
              <p className="text-xl font-black text-pink-400">{scores.player2}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold">
            {isMyTurn ? (
              <span className="text-emerald-400">⚡ Sıra Sende!</span>
            ) : (
              <span className="text-white/40">⏳ {partnerName} oynuyor...</span>
            )}
          </div>
        </div>
      )}

      {/* BAŞLANGIÇ EKRANI */}
      {!gameStarted && (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
            🧩
          </div>
          <h3 className="text-xl font-bold">Kartları Eşleştir</h3>
          <p className="mt-2 text-xs text-white/50">
            Sırayla iki kart açarak aynı simgeleri bulmaya çalışın. En çok çifti toplayan kazanır!
          </p>
          <button
            onClick={handleStart}
            className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            Oyunu Başlat
          </button>
        </div>
      )}

      {/* KART ALANI */}
      {gameStarted && (
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-2.5 sm:gap-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              disabled={!isMyTurn || card.isFlipped || card.isMatched}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl border text-2xl sm:text-3xl font-bold transition-all duration-300 ${
                card.isMatched
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 opacity-60"
                  : card.isFlipped
                  ? "border-purple-400 bg-purple-600/30 text-white shadow-lg scale-95"
                  : "border-white/10 bg-white/[0.05] text-transparent hover:bg-white/[0.08]"
              }`}
            >
              {card.isFlipped || card.isMatched ? card.value : "❓"}
            </button>
          ))}
        </div>
      )}

      {/* OYUN SONU KAZANAN */}
      {isGameOver && (
        <div className="mt-6 rounded-2xl border border-purple-400/30 bg-purple-500/20 p-4 text-center">
          <h4 className="text-lg font-black text-white">Oyun Bitti! 🎉</h4>
          <p className="mt-1 text-sm text-white/70">
            {scores.player1 === scores.player2
              ? "Berabere bitti!"
              : scores.player1 > scores.player2
              ? `${currentUsername} kazandı!`
              : `${partnerName} kazandı!`}
          </p>
          <button
            onClick={handleStart}
            className="mt-3 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white active:scale-95"
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </section>
  );
}