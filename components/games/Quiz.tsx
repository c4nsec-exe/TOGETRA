"use client";

import { useEffect, useMemo, useState, useRef } from "react";

export type QuizGameProps = {
  roomId: string;
  connection: any;
  currentUsername?: string;
  partnerName?: string;
  onClose?: () => void;
  onBack?: () => void;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  category: string;
  fact: string;
};

const QUESTION_POOL: Question[] = [
  {
    id: 1,
    question: "Dünya'nın en büyük okyanusu hangisidir?",
    options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
    answer: 2,
    category: "🌍 Coğrafya",
    fact: "Pasifik Okyanusu, Dünya'nın yüzölçümü bakımından en büyük okyanusudur.",
  },
  {
    id: 2,
    question: "Güneş Sistemi'ndeki en büyük gezegen hangisidir?",
    options: ["Dünya", "Jüpiter", "Satürn", "Mars"],
    answer: 1,
    category: "🔬 Bilim",
    fact: "Jüpiter, Güneş Sistemi'ndeki diğer tüm gezegenlerin toplamından 2.5 kat daha ağırdır.",
  },
  {
    id: 3,
    question: "Suyun deniz seviyesindeki kaynama sıcaklığı yaklaşık kaç °C'dir?",
    options: ["50°C", "75°C", "100°C", "125°C"],
    answer: 2,
    category: "🔬 Fizik",
    fact: "Saf su deniz seviyesinde 100°C'de kaynarken, rakım yükseldikçe atmosfer basıncı azaldığı için kaynama noktası düşer.",
  },
  {
    id: 4,
    question: "Japonya'nın başkenti neresidir?",
    options: ["Kyoto", "Osaka", "Tokyo", "Hiroşima"],
    answer: 2,
    category: "🌍 Coğrafya",
    fact: "Tokyo, dünyanın en kalabalık metropolitan alanlarından biridir.",
  },
  {
    id: 5,
    question: "İnsan kalbinin kaç odacığı vardır?",
    options: ["2", "3", "4", "5"],
    answer: 2,
    category: "🧬 Biyoloji",
    fact: "İnsan kalbi iki kulakçık (atrium) ve iki karıncık (ventrikül) olmak üzere toplam 4 odacıktan oluşur.",
  },
  {
    id: 6,
    question: "Fotosentez sırasında bitkiler temel olarak hangi gazı absorbe eder?",
    options: ["Oksijen", "Azot", "Karbondioksit", "Helyum"],
    answer: 2,
    category: "🌿 Doğa",
    fact: "Bitkiler klorofil yardımıyla karbondioksiti şekere ve oksijene dönüştürür.",
  },
  {
    id: 7,
    question: "Yazılım dünyasında 'HTTP 404' durum kodu ne anlama gelir?",
    options: ["Yetkisiz Giriş", "Sayfa Bulunamadı", "Sunucu Çöktü", "İstek Zaman Aşımı"],
    answer: 1,
    category: "💻 Teknoloji",
    fact: "404 Not Found, istemcinin sunucuyla iletişim kurabildiğini ancak istenen kaynağın bulunamadığını belirtir.",
  },
  {
    id: 8,
    question: "Periyodik tabloda 'Au' sembolü hangi elemente aittir?",
    options: ["Gümüş", "Bakır", "Altın", "Demir"],
    answer: 2,
    category: "⚗️ Kimya",
    fact: "Au sembolü, Latince 'parlayan şafak' anlamına gelen 'Aurum' kelimesinden türetilmiştir.",
  },
  {
    id: 9,
    question: "1984 adlı distopik romanın yazarı kimdir?",
    options: ["George Orwell", "Aldous Huxley", "Franz Kafka", "Ray Bradbury"],
    answer: 0,
    category: "📚 Edebiyat",
    fact: "George Orwell romanı 1948 yılında tamamlamış ve son iki rakamın yerini değiştirerek kitaba '1984' adını vermiştir.",
  },
  {
    id: 10,
    question: "Mona Lisa tablosu hangi ünlü ressam tarafından yapılmıştır?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    answer: 1,
    category: "🎨 Sanat",
    fact: "Leonardo da Vinci bu eseri 16. yüzyılın başında Floransa'da yapmaya başlamıştır.",
  },
];

const QUESTION_TIMER_SECONDS = 20;

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizGame({
  roomId,
  connection,
  currentUsername = "Sen",
  partnerName = "Partnerin",
  onClose,
  onBack,
}: QuizGameProps) {
  const handleExit = onClose || onBack || (() => {});

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [partnerAnswered, setPartnerAnswered] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);

  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex] || QUESTION_POOL[0];

  const progressText = useMemo(() => {
    if (!questions.length) return "1 / 5";
    return `${currentIndex + 1} / ${questions.length}`;
  }, [currentIndex, questions.length]);

  // =========================================================
  // SIGNALR EVENT LISTENERS
  // =========================================================
  useEffect(() => {
    if (!connection) return;

    const handleSignal = (data: any) => {
      if (data.type === "QUIZ_START") {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setPartnerAnswered(false);
        setRevealAnswer(false);
        setScore(0);
        setOpponentScore(0);
        setFinished(false);
        setGameStarted(true);
        setTimeLeft(QUESTION_TIMER_SECONDS);
      } else if (data.type === "QUIZ_PARTNER_ANSWERED") {
        setPartnerAnswered(true);
        if (data.isCorrect) {
          setOpponentScore((prev) => prev + 1);
        }
      } else if (data.type === "QUIZ_NEXT_QUESTION") {
        setCurrentIndex(data.nextIndex);
        setSelectedAnswer(null);
        setPartnerAnswered(false);
        setRevealAnswer(false);
        setTimeLeft(QUESTION_TIMER_SECONDS);
      } else if (data.type === "QUIZ_FINISHED") {
        setFinished(true);
      }
    };

    connection.on("ReceiveSignal", handleSignal);
    return () => connection.off("ReceiveSignal", handleSignal);
  }, [connection]);

  // =========================================================
  // ZAMAN SAYACI (TIMER)
  // =========================================================
  useEffect(() => {
    if (!gameStarted || finished || revealAnswer) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, finished, revealAnswer, currentIndex]);

  const handleTimeExpired = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Boş bırakıldı
      setRevealAnswer(true);

      if (connection?.state === "Connected") {
        connection.invoke("SendSignal", roomId, {
          type: "QUIZ_PARTNER_ANSWERED",
          isCorrect: false,
        }).catch(console.error);
      }
    }
  };

  // =========================================================
  // OYUN AKSİYONLARI
  // =========================================================
  const startGame = () => {
    const selected = shuffleArray(QUESTION_POOL).slice(0, 5);
    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setPartnerAnswered(false);
    setRevealAnswer(false);
    setScore(0);
    setOpponentScore(0);
    setFinished(false);
    setGameStarted(true);
    setTimeLeft(QUESTION_TIMER_SECONDS);

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "QUIZ_START",
        questions: selected,
      }).catch(console.error);
    }
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null || revealAnswer) return;

    setSelectedAnswer(optionIdx);
    setRevealAnswer(true);

    const isCorrect = optionIdx === currentQuestion.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "QUIZ_PARTNER_ANSWERED",
        isCorrect,
      }).catch(console.error);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      if (connection?.state === "Connected") {
        connection.invoke("SendSignal", roomId, { type: "QUIZ_FINISHED" }).catch(console.error);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setPartnerAnswered(false);
    setRevealAnswer(false);
    setTimeLeft(QUESTION_TIMER_SECONDS);

    if (connection?.state === "Connected") {
      connection.invoke("SendSignal", roomId, {
        type: "QUIZ_NEXT_QUESTION",
        nextIndex,
      }).catch(console.error);
    }
  };

  // =========================================================
  // GİRİŞ EKRANI
  // =========================================================
  if (!gameStarted) {
    return (
      <main className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <header className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExit}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 active:scale-95"
          >
            ← Oyun Merkezi
          </button>
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
            Dinamik Bilgi Düellosu
          </span>
        </header>

        <div className="mx-auto max-w-xl py-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-4xl shadow-inner">
            🧠
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Bil Bakalım</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
            Genel kültürden bilime 5 soruluk eşzamanlı yarışma! Süre bitmeden en çok doğruyu yapan kazanır.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="mt-8 w-full max-w-xs rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90 active:scale-98"
          >
            Yarışmayı Başlat ⚡
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // BİTİŞ & SKOR EKRANI
  // =========================================================
  if (finished) {
    const isWinner = score > opponentScore;
    const isDraw = score === opponentScore;

    return (
      <main className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-6 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto max-w-lg py-6">
          <div className="text-6xl mb-4">{isDraw ? "🤝" : isWinner ? "👑" : "👏"}</div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Yarışma Tamamlandı</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            {isDraw ? "Dostluk Kazandı!" : isWinner ? `${currentUsername} Kazandı!` : `${partnerName} Kazandı!`}
          </h2>

          <div className="my-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-5">
              <span className="text-xs font-semibold text-purple-300">{currentUsername}</span>
              <p className="mt-2 text-4xl font-black text-white">{score}</p>
            </div>
            <div className="rounded-2xl border border-pink-400/30 bg-pink-500/10 p-5">
              <span className="text-xs font-semibold text-pink-300">{partnerName}</span>
              <p className="mt-2 text-4xl font-black text-white">{opponentScore}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-sm text-white shadow-md active:scale-95"
            >
              🔄 Yeniden Oyna
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-sm text-white/70 hover:bg-white/10 active:scale-95"
            >
              ✕ Odadan Çık
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // SORU VE CEVAP ALANI
  // =========================================================
  return (
    <main className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={handleExit}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 active:scale-95"
        >
          ← Çıkış
        </button>

        {/* Skor & Canlı Durum */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-bold">
            <span className="text-purple-300">{currentUsername}:</span>
            <span className="text-white">{score}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-pink-400/20 bg-pink-500/10 px-3 py-1.5 text-xs font-bold">
            <span className="text-pink-300">{partnerName}:</span>
            <span className="text-white">{opponentScore}</span>
            {partnerAnswered && <span className="ml-1 text-[10px] text-emerald-400">✓ Cevapladı</span>}
          </div>
        </div>

        {/* Sayaç */}
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${timeLeft <= 5 ? "animate-ping bg-red-500" : "bg-purple-400"}`} />
          <span className="font-mono text-sm font-bold text-white">{timeLeft}s</span>
        </div>
      </header>

      {/* Soru Başlığı */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300">
            {currentQuestion.category}
          </span>
          <span className="text-xs font-semibold text-white/40">Soru {progressText}</span>
        </div>
        <h2 className="mt-3 text-xl font-black text-white sm:text-2xl md:text-3xl leading-snug">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Şıklar */}
      <div className="grid gap-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === currentQuestion.answer;

          let btnStyle = "border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]";

          if (revealAnswer) {
            if (isCorrect) {
              btnStyle = "border-emerald-500/50 bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
            } else if (isSelected && !isCorrect) {
              btnStyle = "border-red-500/50 bg-red-500/20 text-red-200";
            } else {
              btnStyle = "border-white/5 bg-white/[0.02] text-white/30";
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={revealAnswer}
              onClick={() => handleSelectAnswer(idx)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-98 disabled:cursor-not-allowed ${btnStyle}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  revealAnswer && isCorrect
                    ? "bg-emerald-400 text-black font-black"
                    : revealAnswer && isSelected && !isCorrect
                    ? "bg-red-400 text-white font-black"
                    : "bg-white/10 text-white"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-sm font-medium sm:text-base">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Bilgi Kutusu ve Sonraki Soru Butonu */}
      {revealAnswer && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{selectedAnswer === currentQuestion.answer ? "💡" : "📌"}</span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Biliyor muydunuz?</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm leading-relaxed">{currentQuestion.fact}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNextQuestion}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-98"
          >
            {currentIndex + 1 >= questions.length ? "Yarışmayı Tamamla 🏆" : "Sonraki Soruya Geç →"}
          </button>
        </div>
      )}
    </main>
  );
}