"use client";

import { useEffect, useMemo, useState } from "react";

type Color = "red" | "yellow" | "green" | "blue";

type Card = {
  id: number;
  color: Color;
  value: string;
};

const colors: Color[] = ["red", "yellow", "green", "blue"];

const colorClasses: Record<Color, string> = {
  red: "bg-gradient-to-br from-red-400 via-red-600 to-red-800 text-white border-red-200/80",
  yellow: "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-black border-yellow-100",
  green: "bg-gradient-to-br from-emerald-400 via-green-600 to-green-900 text-white border-emerald-200/80",
  blue: "bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900 text-white border-blue-200/80",
};

const colorGlow: Record<Color, string> = {
  red: "shadow-[0_0_25px_rgba(239,68,68,0.5)]",
  yellow: "shadow-[0_0_25px_rgba(250,204,21,0.5)]",
  green: "shadow-[0_0_25px_rgba(34,197,94,0.5)]",
  blue: "shadow-[0_0_25px_rgba(59,130,246,0.5)]",
};

function speakUno() {
  if (typeof window === "undefined") return;
  const speech = new SpeechSynthesisUtterance("UNO!");
  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1.1;
  speech.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function shuffle(cards: Card[]) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createDeck() {
  const deck: Card[] = [];
  let id = 0;
  colors.forEach((color) => {
    deck.push({ id: id++, color, value: "0" });
    for (let number = 1; number <= 9; number++) {
      deck.push({ id: id++, color, value: String(number) });
      deck.push({ id: id++, color, value: String(number) });
    }
    for (let i = 0; i < 2; i++) {
      deck.push({ id: id++, color, value: "Skip" });
      deck.push({ id: id++, color, value: "Reverse" });
      deck.push({ id: id++, color, value: "+2" });
    }
  });
  return shuffle(deck);
}

function cardLabel(value: string) {
  if (value === "Skip") return "⊘";
  if (value === "Reverse") return "↻";
  if (value === "+2") return "+2";
  return value;
}

export default function UnoGame({ 
  roomId, 
  connection, 
  onBack, 
  currentUsername, 
  partnerName 
}: { 
  roomId: string; 
  connection: any; 
  onBack: () => void;
  currentUsername: string;
  partnerName: string;
}) {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCardCount, setOpponentCardCount] = useState<number>(7);
  const [deck, setDeck] = useState<Card[]>([]);
  const [discard, setDiscard] = useState<Card[]>([]);
  
  // Doğrudan true/false ile sırayı yönetiyoruz
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  
  const [winner, setWinner] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const topCard = discard[discard.length - 1];

  // =========================================================
  // SIGNALR EVENT LISTENERS
  // =========================================================
  useEffect(() => {
    if (!connection) return;

    const handleSignal = (data: any) => {
      if (data.type === "UNO_START") {
        // Başlatan kişi değilsek, bize ayrılan elleri alıyoruz
        const assignedHand = data.p2Hand || [];
        setPlayerCards(assignedHand);
        setOpponentCardCount(data.p1HandCount || 7);
        setDeck(data.deck);
        setDiscard([data.topCard]);
        setIsMyTurn(false); // Başlatanın rakibi olduğu için ilk sıra onda değildir
        setWinner(null);
        setStarted(true);
      } 
      else if (data.type === "UNO_PLAY" || data.type === "UNO_DRAW") {
        setDiscard(data.discard);
        setDeck(data.deck);
        
        // Hamle yapıldığında sırayı tersine çeviriyoruz (Bize geçti)
        setIsMyTurn(true);

        if (data.updatedHand) {
          setPlayerCards(data.updatedHand);
        }

        if (data.opponentCardCount !== undefined) {
          setOpponentCardCount(data.opponentCardCount);
        }

        if (data.winner) {
          setWinner(data.winner);
        }
      }
    };

    connection.on("ReceiveSignal", handleSignal);
    return () => connection.off("ReceiveSignal", handleSignal);
  }, [connection]);

  const startGame = () => {
    const fullDeck = createDeck();
    const p1Hand = fullDeck.slice(0, 7);
    const p2Hand = fullDeck.slice(7, 14);
    const remaining = fullDeck.slice(14);
    const firstCard = remaining[0];
    const restDeck = remaining.slice(1);

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "UNO_START",
        p1Hand,
        p2Hand,
        p1HandCount: p1Hand.length,
        deck: restDeck,
        topCard: firstCard,
      }).catch(console.error);

      // Oyunu başlatan kişi ilk eli alır ve ilk sıra onda olur
      setPlayerCards(p1Hand);
      setOpponentCardCount(7);
      setDeck(restDeck);
      setDiscard([firstCard]);
      setIsMyTurn(true); // İlk sıra başlatanın
      setStarted(true);
      setWinner(null);
    }
  };

  const playableCards = useMemo(() => {
    if (!topCard || !isMyTurn) return new Set<number>();
    return new Set(
      playerCards
        .filter((card) => card.color === topCard.color || card.value === topCard.value)
        .map((card) => card.id)
    );
  }, [playerCards, topCard, isMyTurn]);

  const playerDraw = () => {
    if (!isMyTurn || winner) return;

    let workingDeck = [...deck];
    let workingDiscard = [...discard];

    if (workingDeck.length === 0 && workingDiscard.length > 1) {
      const currentTop = workingDiscard[workingDiscard.length - 1];
      const recyclable = workingDiscard.slice(0, workingDiscard.length - 1);
      workingDeck = shuffle(recyclable);
      workingDiscard = [currentTop];
    }

    if (workingDeck.length === 0) return;

    const drawnCard = workingDeck[0];
    const newDeck = workingDeck.slice(1);
    const updatedHand = [...playerCards, drawnCard];

    setPlayerCards(updatedHand);
    setDeck(newDeck);
    setDiscard(workingDiscard);
    setIsMyTurn(false); // Sıra rakibe geçti

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "UNO_DRAW",
        updatedHand: updatedHand, // Rakip için karşı tarafın eli güncellenir
        deck: newDeck,
        discard: workingDiscard,
        opponentCardCount: updatedHand.length
      }).catch(console.error);
    }
  };

  const playerPlay = (card: Card) => {
    if (!isMyTurn || winner) return;
    if (!topCard || (card.color !== topCard.color && card.value !== topCard.value)) return;

    const newHand = playerCards.filter((item) => item.id !== card.id);
    const newDiscard = [...discard, card];

    if (newHand.length === 1) speakUno();

    setPlayerCards(newHand);
    setDiscard(newDiscard);
    setIsMyTurn(false); // Sıra rakibe geçti

    const isWin = newHand.length === 0;
    if (isWin) {
      setWinner(connection.connectionId);
    }

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "UNO_PLAY",
        playedCard: card,
        discard: newDiscard,
        deck,
        updatedHand: newHand,
        opponentCardCount: newHand.length,
        winner: isWin ? connection.connectionId : null,
      }).catch(console.error);
    }
  };

  const message = winner 
    ? "Oyun Bitti" 
    : isMyTurn 
    ? "Sıra Sende!" 
    : `Sıra ${partnerName || 'Rakip'}'de`;

  const winnerName = winner === connection?.connectionId ? currentUsername : partnerName;
  const winnerInitial = winnerName ? winnerName.charAt(0).toUpperCase() : "?";

  /* =========================================================
     BAŞLANGIÇ EKRANI
  ========================================================= */
  if (!started) {
    return (
      <div className="w-full max-w-5xl mx-auto mb-5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <button onClick={onBack} className="min-h-11 px-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition text-sm">
            ← Oyun Merkezi
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-500/10 border border-purple-400/20">
            <span>🃏</span>
            <span className="text-purple-200 font-semibold text-sm">UNO</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-500/[0.08] via-white/[0.03] to-pink-500/[0.06] p-6 sm:p-10 md:p-16 text-center shadow-2xl">
          <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-[1.7rem] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_20px_60px_rgba(168,85,247,0.25)] rotate-[-4deg] animate-bounce">
            🃏
          </div>
          <p className="text-purple-300/70 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">BİRLİKTE OYNA</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mt-3">RENK KAPIŞMASI (UNO)</h1>
          <p className="text-white/40 max-w-lg mx-auto mt-4 leading-7 text-sm sm:text-base">
            Renkleri ve sayıları eşleştir, özel kartları kullan. Elindeki tüm kartları ilk bitiren sen ol!
          </p>
          <button onClick={startGame} className="mt-7 w-full sm:w-auto min-h-12 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-base sm:text-lg shadow-[0_15px_40px_rgba(168,85,247,0.2)] hover:scale-[1.03] transition">
            Oyunu Başlat →
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     OYUN EKRANI
  ========================================================= */
  return (
    <div className="w-full max-w-7xl mx-auto pb-6 relative">
      
      {/* ÜST BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <button onClick={onBack} className="min-h-11 px-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition text-sm">
          ← Oyunu Kapat
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-500/10 border border-purple-400/20">
          <span>🃏</span>
          <span className="font-semibold text-purple-200 text-sm">UNO</span>
        </div>
        <button onClick={startGame} className="min-h-11 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-semibold">
          Yeniden Başlat
        </button>
      </div>

      {/* DURUM BARI */}
      <div className="flex justify-center mb-5">
        <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border backdrop-blur shadow-lg ${isMyTurn ? "bg-purple-500/15 border-purple-400/30 text-purple-200 shadow-purple-500/10" : "bg-pink-500/15 border-pink-400/30 text-pink-200"}`}>
          <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isMyTurn ? "bg-purple-400" : "bg-pink-400"}`} />
          <span className="text-xs sm:text-sm font-bold tracking-wide">{message}</span>
        </div>
      </div>

      {/* RAKİP BİLGİSİ */}
      <div className="rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-4 sm:p-5 mb-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-pink-400">
              {partnerName ? partnerName.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-widest">Rakip</p>
              <p className="font-bold">{partnerName || "Partner"}</p>
            </div>
          </div>
          <div className="shrink-0 px-4 py-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2">
            <span className="text-xs text-white/50">Kart:</span>
            <span className="font-black text-purple-400 text-base">{opponentCardCount}</span>
          </div>
        </div>
      </div>

      {/* OYUN MASASI */}
      <div className="relative rounded-[1.8rem] sm:rounded-[2.5rem] border border-purple-400/15 bg-gradient-to-br from-[#0e0d1b] to-[#090812] p-6 sm:p-10 min-h-[340px] flex items-center justify-center overflow-hidden shadow-2xl">
        <div className="relative w-full flex items-center justify-center gap-8 sm:gap-14">
          
          {/* ÇEKME DESTESİ */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">Desteden Çek</p>
            <button
              onClick={playerDraw}
              disabled={!isMyTurn}
              className="group relative w-20 h-30 sm:w-28 sm:h-40 rounded-2xl bg-gradient-to-br from-[#6925d5] via-[#a41dc5] to-[#ee197e] border-2 border-white/25 shadow-[0_10px_30px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center transition-all hover:scale-105 hover:-translate-y-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-2 rounded-xl border border-white/20 flex items-center justify-center text-center">
                <div className="text-xl sm:text-2xl font-black italic -rotate-12 text-white drop-shadow-md">UNO</div>
              </div>
            </button>
            <span className="text-xs text-white/40 font-medium">{deck.length} kart kaldı</span>
          </div>

          {/* ORTADAKİ ATILAN KART */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">Ortadaki Kart</p>
            {topCard ? (
              <div className={`relative w-20 h-30 sm:w-28 sm:h-40 rounded-2xl border-[4px] ${colorClasses[topCard.color]} ${colorGlow[topCard.color]} flex items-center justify-center overflow-hidden shadow-2xl animate-fade-in`}>
                <span className="absolute top-2 left-3 text-xs sm:text-sm font-black opacity-80">{cardLabel(topCard.value)}</span>
                <span className="text-4xl sm:text-6xl font-black drop-shadow-lg">{cardLabel(topCard.value)}</span>
                <span className="absolute bottom-2 right-3 text-xs sm:text-sm font-black opacity-80 rotate-180">{cardLabel(topCard.value)}</span>
              </div>
            ) : (
              <div className="w-20 h-30 sm:w-28 sm:h-40 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/20 text-xs">Boş</div>
            )}
          </div>

        </div>
      </div>

      {/* OYUNCU ELİ */}
      <div className="rounded-[1.7rem] border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.06] to-pink-500/[0.025] p-5 sm:p-6 mt-4 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-md">✦</div>
            <div>
              <p className="text-purple-300 text-[9px] uppercase tracking-widest">Senin Elin</p>
              <p className="font-bold">{playerCards.length} Kart</p>
            </div>
          </div>
          <button
            onClick={playerDraw}
            disabled={!isMyTurn}
            className="min-h-11 px-5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition text-sm shadow-sm"
          >
            + Kart Çek
          </button>
        </div>

        <div className="overflow-x-auto pb-3 scrollbar-thin">
          <div className="flex justify-center sm:flex-wrap gap-3 min-w-max sm:min-w-0">
            {playerCards.map((card) => {
              const playable = playableCards.has(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => playerPlay(card)}
                  disabled={!isMyTurn || !playable}
                  className={`
                    relative shrink-0 w-16 h-24 sm:w-20 sm:h-30 rounded-xl sm:rounded-2xl border-[3px]
                    ${colorClasses[card.color]}
                    ${playable && isMyTurn ? colorGlow[card.color] : ""}
                    flex flex-col items-center justify-between p-2 overflow-hidden transition-all duration-200 active:scale-95
                    ${isMyTurn && playable ? "hover:-translate-y-3 hover:scale-105 cursor-pointer shadow-xl" : "opacity-40 cursor-not-allowed"}
                  `}
                >
                  <span className="self-start text-[10px] sm:text-xs font-black">{cardLabel(card.value)}</span>
                  <span className="text-xl sm:text-3xl font-black drop-shadow-md">{cardLabel(card.value)}</span>
                  <span className="self-end text-[10px] sm:text-xs font-black rotate-180">{cardLabel(card.value)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
           OYUN BİTİŞ KUTLAMA EKRANI (OVERLAY)
      ========================================================= */}
      {winner && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#08070d]/95 backdrop-blur-lg rounded-[2.5rem] border border-purple-400/30 shadow-2xl animate-fade-in">
          <div className="flex flex-col items-center animate-bounce">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-600 p-1.5 shadow-[0_0_50px_rgba(250,204,21,0.5)]">
              <div className="w-full h-full rounded-full bg-[#15141a] flex items-center justify-center text-4xl sm:text-5xl font-black text-yellow-400">
                {winnerInitial}
              </div>
              <div className="absolute -top-5 -right-2 text-4xl animate-spin-slow">👑</div>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-lg text-center">
              TEBRİKLER!
            </h3>
            <p className="text-white mt-2 text-lg sm:text-xl font-medium text-center">
              <span className="font-bold text-yellow-400">{winnerName}</span> oyunu kazandı!
            </p>
          </div>

          <button 
            type="button" 
            onClick={startGame} 
            className="mt-8 min-h-12 px-8 rounded-full bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            🔄 Rövanş Yap
          </button>
        </div>
      )}

    </div>
  );
}