"use client";

import { useEffect, useState } from "react";

type RPSChoice = "rock" | "paper" | "scissors";

type RPSGameProps = {
  roomId: string;
  connection: any;
  currentUsername: string;
  partnerName: string;
  onClose: () => void;
};

const CHOICES: { id: RPSChoice; label: string; icon: string }[] = [
  { id: "rock", label: "Taş", icon: "✊" },
  { id: "paper", label: "Kağıt", icon: "✋" },
  { id: "scissors", label: "Makas", icon: "✌️" },
];

export default function RPSGame({
  roomId,
  connection,
  currentUsername,
  partnerName,
  onClose,
}: RPSGameProps) {
  const [myChoice, setMyChoice] = useState<RPSChoice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<RPSChoice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ me: 0, partner: 0 });
  const [waitingOpponent, setWaitingOpponent] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const handleOpponentMadeChoice = () => {
      setWaitingOpponent(false);
    };

    const handleRoundResult = (data: {
      player1Choice: RPSChoice;
      player2Choice: RPSChoice;
      winner: string | null;
      scores: { [key: string]: number };
    }) => {
      setOpponentChoice(data.player2Choice);
      if (!data.winner) {
        setResult("🤝 Berabere!");
      } else if (data.winner === currentUsername) {
        setResult("🎉 Kazandın!");
      } else {
        setResult(`💔 ${partnerName} Kazandı!`);
      }

      if (data.scores) {
        setScore({
          me: data.scores[currentUsername] || 0,
          partner: data.scores[partnerName] || 0,
        });
      }
    };

    connection.on("RPSChoiceMade", handleOpponentMadeChoice);
    connection.on("RPSRoundResult", handleRoundResult);

    return () => {
      connection.off("RPSChoiceMade", handleOpponentMadeChoice);
      connection.off("RPSRoundResult", handleRoundResult);
    };
  }, [connection, currentUsername, partnerName]);

  const makeChoice = (choice: RPSChoice) => {
    if (myChoice) return;
    setMyChoice(choice);
    setWaitingOpponent(true);

    if (connection?.state === "Connected") {
      connection.invoke("SendRPSMove", roomId, choice).catch(console.error);
    }
  };

  const resetRound = () => {
    setMyChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setWaitingOpponent(false);

    if (connection?.state === "Connected") {
      connection.invoke("ResetRPSRound", roomId).catch(console.error);
    }
  };

  return (
    <section className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-5 shadow-2xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
            Hızlı Düello
          </div>
          <h2 className="text-2xl font-black text-white">Taş · Kağıt · Makas</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
        >
          ✕ Kapat
        </button>
      </header>

      {/* Skor Tablosu */}
      <div className="mb-8 flex items-center justify-around rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
        <div>
          <div className="text-xs text-white/50">{currentUsername} (Sen)</div>
          <div className="mt-1 text-3xl font-black text-purple-400">{score.me}</div>
        </div>
        <div className="text-xl font-bold text-white/20">VS</div>
        <div>
          <div className="text-xs text-white/50">{partnerName}</div>
          <div className="mt-1 text-3xl font-black text-pink-400">{score.partner}</div>
        </div>
      </div>

      {/* Sonuç Alanı */}
      {result ? (
        <div className="text-center">
          <div className="mb-4 text-2xl font-black text-white">{result}</div>
          <div className="mb-6 flex justify-center gap-8 text-4xl">
            <div>
              <div className="text-xs text-white/40 mb-1">Senin Seçimin</div>
              {CHOICES.find((c) => c.id === myChoice)?.icon}
            </div>
            <div>
              <div className="text-xs text-white/40 mb-1">{partnerName}</div>
              {CHOICES.find((c) => c.id === opponentChoice)?.icon || "❓"}
            </div>
          </div>
          <button
            onClick={resetRound}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg active:scale-95"
          >
            Sonraki Tur
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-center text-xs text-white/60">
            {waitingOpponent ? `${partnerName} hamlesi bekleniyor...` : "Hamleni seç:"}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {CHOICES.map((item) => (
              <button
                key={item.id}
                disabled={Boolean(myChoice)}
                onClick={() => makeChoice(item.id)}
                className={`flex flex-col items-center justify-center rounded-2xl border p-5 transition active:scale-95 ${
                  myChoice === item.id
                    ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                    : "border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
                } disabled:cursor-not-allowed`}
              >
                <span className="text-4xl mb-2">{item.icon}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}