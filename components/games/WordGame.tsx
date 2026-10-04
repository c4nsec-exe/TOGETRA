"use client";

import { useEffect, useRef, useState } from "react";

type WordGameProps = {
  roomId: string;
  connection: any;
  currentUsername: string;
  partnerName: string;
  partnerConnectionId: string;
  onClose: () => void;
};

type PlayedWordItem = {
  word: string;
  playedBy: string;
};

export default function WordGame({
  roomId,
  connection,
  currentUsername,
  partnerName,
  partnerConnectionId,
  onClose,
}: WordGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string>("");
  const [requiredLetter, setRequiredLetter] = useState<string>("");
  const [wordList, setWordList] = useState<PlayedWordItem[]>([]);
  const [inputWord, setInputWord] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scores, setScores] = useState({ me: 0, partner: 0 });

  const historyEndRef = useRef<HTMLDivElement>(null);
  const isMyTurn = connection?.connectionId === currentTurn;

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wordList]);

  useEffect(() => {
    if (!connection) return;

    const handleStarted = (data: { currentTurn: string; startingLetter: string }) => {
      setGameStarted(true);
      setCurrentTurn(data.currentTurn);
      setRequiredLetter(data.startingLetter.toUpperCase());
      setWordList([]);
      setErrorMessage(null);
      setScores({ me: 0, partner: 0 });
    };

    const handleWordAccepted = (data: {
      playedWord: string;
      nextLetter: string;
      currentTurn: string;
    }) => {
      const isMe = connection.connectionId !== data.currentTurn; // Hamleyi yapan taraf
      const sender = isMe ? currentUsername : partnerName;

      setWordList((prev) => [...prev, { word: data.playedWord, playedBy: sender }]);
      setRequiredLetter(data.nextLetter.toUpperCase());
      setCurrentTurn(data.currentTurn);
      setErrorMessage(null);
      setInputWord("");

      setScores((prev) => ({
        ...prev,
        [isMe ? "me" : "partner"]: prev[isMe ? "me" : "partner"] + data.playedWord.length,
      }));
    };

    const handleWordRejected = (reason: string) => {
      setErrorMessage(reason);
    };

    connection.on("WordGameStarted", handleStarted);
    connection.on("WordAccepted", handleWordAccepted);
    connection.on("WordRejected", handleWordRejected);

    return () => {
      connection.off("WordGameStarted", handleStarted);
      connection.off("WordAccepted", handleWordAccepted);
      connection.off("WordRejected", handleWordRejected);
    };
  }, [connection, currentUsername, partnerName]);

  const startGame = () => {
    if (connection?.state === "Connected") {
      connection.invoke("StartWordGame", roomId, partnerConnectionId).catch(console.error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim() || !isMyTurn) return;

    setErrorMessage(null);
    if (connection?.state === "Connected") {
      connection.invoke("SubmitWord", roomId, inputWord.trim()).catch(console.error);
    }
  };

  return (
    <section className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Kelime Zinciri
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">🔤 Kelime Türetmece</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 active:scale-95"
        >
          ✕ Oyunu Kapat
        </button>
      </header>

      {!gameStarted ? (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
            📚
          </div>
          <h3 className="text-xl font-bold">Harfleri Birleştir, Zinciri Kırma</h3>
          <p className="mt-2 text-xs text-white/50">
            Her oyuncu, bir önceki kelimenin son harfiyle başlayan yeni bir Türkçe kelime türetir. Sözlük geçerliliği backend tarafından denetlenir!
          </p>
          <button
            onClick={startGame}
            className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            Zinciri Başlat
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Skor & Sıra */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-white/50">{currentUsername} (Sen)</span>
                <p className="text-2xl font-black text-emerald-400">{scores.me}p</p>
              </div>
              <div className="text-xs font-bold text-white/20">VS</div>
              <div>
                <span className="text-xs text-white/50">{partnerName}</span>
                <p className="text-2xl font-black text-pink-400">{scores.partner}p</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold">
                <span className="text-white/40">Zorunlu Başlangıç Harfi:</span>
                <span className="text-lg font-black text-amber-400">{requiredLetter}</span>
              </div>
              <div className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold">
                {isMyTurn ? (
                  <span className="text-emerald-400 animate-pulse">Sıra Sende!</span>
                ) : (
                  <span className="text-white/40">{partnerName} düşünüyor...</span>
                )}
              </div>
            </div>
          </div>

          {/* Kelime Akışı */}
          <div className="h-56 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2.5">
            {wordList.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-white/30">
                Oyun başladı! İlk kelimeyi <span className="font-bold text-amber-400 mx-1">"{requiredLetter}"</span> harfi ile başlatın.
              </div>
            ) : (
              wordList.map((item, idx) => {
                const isMe = item.playedBy === currentUsername;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        isMe
                          ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200"
                          : "bg-pink-500/20 border border-pink-400/30 text-pink-200"
                      }`}
                    >
                      <span className="text-[10px] block opacity-50 mb-0.5">{item.playedBy}</span>
                      <span className="font-bold tracking-wide uppercase">{item.word}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={historyEndRef} />
          </div>

          {/* Hata Uyarısı */}
          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Giriş Alanı */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputWord}
              disabled={!isMyTurn}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder={isMyTurn ? `"${requiredLetter}" ile başlayan kelime yaz...` : "Rakibin hamlesi bekleniyor..."}
              className="h-12 flex-1 rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!isMyTurn || !inputWord.trim()}
              className="h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </section>
  );
}