type GameId =
  | "xox"
  | "uno"
  | "memory"
  | "quiz"
  | "chess"
  | "checkers"
  | "draw"
  | "reaction"
  | "puzzle";

type Game = {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  active: boolean;
};

const GAMES: Game[] = [
  {
    id: "xox",
    title: "Dört Sıra",
    description: "4 taşı aynı sırada bul ve kazan.",
    icon: "⭕",
    active: true,
  },
  {
    id: "uno",
    title: "Renk Kapışması",
    description: "Kartlarını oyna ve elini ilk bitiren ol.",
    icon: "🃏",
    active: true,
  },
  {
    id: "memory",
    title: "Hafıza Eşleşmesi",
    description: "Kartları aç ve eşleşen çiftleri bul.",
    icon: "🧠",
    active: true,
  },
  {
    id: "quiz",
    title: "Bil Bakalım",
    description: "Genel kültür sorularını cevapla.",
    icon: "❓",
    active: true,
  },
  {
    id: "draw",
    title: "Birlikte Çiz",
    description: "Çiz, tahmin et ve birlikte eğlen.",
    icon: "🎨",
    active: true,
  },
  {
    id: "puzzle",
    title: "Puzzle",
    description: "Aynı görseli rakibinden önce tamamla.",
    icon: "🧩",
    active: true,
  },
  {
    id: "chess",
    title: "Tahtın Efendisi",
    description: "Klasik taşlarla hamleni yap ve rakibine üstünlük kur.",
    icon: "♟️",
    active: true,
  },
  {
    id: "checkers",
    title: "Dama",
    description: "Taşlarını ilerlet ve rakibin taşlarını al.",
    icon: "⚫",
    active: false,
  },
  {
    id: "reaction",
    title: "Refleks",
    description: "Hedefe en hızlı bas ve puan kazan.",
    icon: "⚡",
    active: true,
  },
];