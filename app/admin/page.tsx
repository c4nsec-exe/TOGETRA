"use client";

import { useEffect, useState } from "react";
import { API_CONFIG } from "@/app/lib/config";

type TabType = "quiz" | "draw" | "puzzle" | "dictionary";

type QuizQuestionItem = {
  id?: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswerIndex: number;
  category: string;
  fact?: string;
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("quiz");
  const [token, setToken] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Tab 1: Quiz Form States
  const [quizList, setQuizList] = useState<QuizQuestionItem[]>([]);
  const [quizForm, setQuizForm] = useState<QuizQuestionItem>({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswerIndex: 0,
    category: "Genel Kültür",
    fact: "",
  });

  // Tab 2: Draw Word States
  const [drawWord, setDrawWord] = useState("");
  const [drawCategory, setDrawCategory] = useState("Nesne");
  const [drawDifficulty, setDrawDifficulty] = useState(1);

  // Tab 3: Puzzle Image States
  const [puzzleTitle, setPuzzleTitle] = useState("");
  const [puzzleFile, setPuzzleFile] = useState<File | null>(null);

  // Tab 4: Dictionary Bulk States
  const [bulkWordsText, setBulkWordsText] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (activeTab === "quiz" && token) {
      fetchQuestions();
    }
  }, [activeTab, token]);

  const showStatus = (text: string, error = false) => {
    setStatusMsg({ text, error });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // ==========================================
  // QUIZ API İŞLEMLERİ
  // ==========================================
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/quiz`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuizList(data);
      }
    } catch {
      showStatus("Sorular çekilemedi.", true);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizForm),
      });

      if (!res.ok) throw new Error();
      showStatus("Soru başarıyla eklendi.");
      setQuizForm({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswerIndex: 0,
        category: "Genel Kültür",
        fact: "",
      });
      fetchQuestions();
    } catch {
      showStatus("Soru kaydedilirken hata oluştu.", true);
    }
  };

  const handleDeleteQuestion = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/quiz/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showStatus("Soru silindi.");
      fetchQuestions();
    } catch {
      showStatus("Silme işlemi başarısız.", true);
    }
  };

  // ==========================================
  // DRAW KELİME EKLEME
  // ==========================================
  const handleAddDrawWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawWord.trim()) return;

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/draw-word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word: drawWord.trim(),
          category: drawCategory,
          difficulty: drawDifficulty,
        }),
      });

      if (!res.ok) throw new Error();
      showStatus(`"${drawWord}" kelimesi çizim havuzuna eklendi.`);
      setDrawWord("");
    } catch {
      showStatus("Kelime eklenirken hata oluştu.", true);
    }
  };

  // ==========================================
  // PUZZLE GÖRSEL YÜKLEME
  // ==========================================
  const handleUploadPuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzleFile) {
      showStatus("Lütfen bir resim dosyası seçin.", true);
      return;
    }

    const formData = new FormData();
    formData.append("file", puzzleFile);

    try {
      const uploadRes = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/puzzle/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error();
      const uploadData = await uploadRes.json();

      const saveRes = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/puzzle-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: puzzleTitle || "Sistem Yapbozu",
          imageUrl: uploadData.imageUrl,
          isSystemImage: true,
        }),
      });

      if (!saveRes.ok) throw new Error();
      showStatus("Yapboz görseli başarıyla kaydedildi.");
      setPuzzleTitle("");
      setPuzzleFile(null);
    } catch {
      showStatus("Yapboz görseli kaydedilemedi.", true);
    }
  };

  // ==========================================
  // TOPLU SÖZLÜK YÜKLEME
  // ==========================================
  const handleBulkDictionary = async (e: React.FormEvent) => {
    e.preventDefault();
    const words = bulkWordsText
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 1);

    if (words.length === 0) {
      showStatus("Lütfen geçerli kelimeler girin.", true);
      return;
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/admin/content/dictionary/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(words),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      showStatus(`${data.inserted} adet kelime sözlüğe başarıyla aktarıldı.`);
      setBulkWordsText("");
    } catch {
      showStatus("Toplu sözlük aktarımı başarısız oldu.", true);
    }
  };

  return (
    <main className="min-h-screen bg-[#07060b] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-400">
              Yönetim Merkezi
            </div>
            <h1 className="text-3xl font-black mt-1">Platform İçerik Yönetimi</h1>
            <p className="text-sm text-white/50 mt-1">
              Oyunların veritabanındaki kelime, soru ve görsel havuzlarını dinamik olarak yönetin.
            </p>
          </div>

          <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
            <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} label="🧠 Quiz Soruları" />
            <TabButton active={activeTab === "draw"} onClick={() => setActiveTab("draw")} label="🎨 Çizim Kelimeleri" />
            <TabButton active={activeTab === "puzzle"} onClick={() => setActiveTab("puzzle")} label="🧩 Yapboz Görselleri" />
            <TabButton active={activeTab === "dictionary"} onClick={() => setActiveTab("dictionary")} label="📖 Sözlük Aktarımı" />
          </div>
        </header>

        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm font-semibold transition ${
              statusMsg.error
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* 1. QUIZ SORULARI SEKMESİ */}
        {activeTab === "quiz" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddQuestion} className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <h2 className="text-lg font-bold">Yeni Soru Ekle</h2>
              <div>
                <label className="text-xs text-white/50 block mb-1">Kategori</label>
                <input
                  type="text"
                  value={quizForm.category}
                  onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Soru Metni</label>
                <textarea
                  rows={3}
                  value={quizForm.questionText}
                  onChange={(e) => setQuizForm({ ...quizForm, questionText: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["A", "B", "C", "D"] as const).map((opt, idx) => (
                  <div key={opt}>
                    <label className="text-xs text-white/50 block mb-1">{opt} Şıkkı</label>
                    <input
                      type="text"
                      value={quizForm[`option${opt}` as keyof QuizQuestionItem] as string}
                      onChange={(e) =>
                        setQuizForm({ ...quizForm, [`option${opt}`]: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Doğru Cevap</label>
                <select
                  value={quizForm.correctAnswerIndex}
                  onChange={(e) => setQuizForm({ ...quizForm, correctAnswerIndex: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  <option value={0}>A Şıkkı</option>
                  <option value={1}>B Şıkkı</option>
                  <option value={2}>C Şıkkı</option>
                  <option value={3}>D Şıkkı</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Açıklayıcı Bilgi (Fact)</label>
                <input
                  type="text"
                  value={quizForm.fact}
                  onChange={(e) => setQuizForm({ ...quizForm, fact: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Cevap sonrası oyuncuya gösterilecek not..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold text-sm shadow-md active:scale-98"
              >
                Soruyu Kaydet
              </button>
            </form>

            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <h2 className="text-lg font-bold mb-4">Kayıtlı Sorular ({quizList.length})</h2>
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                {quizList.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10">
                        {q.category}
                      </span>
                      <p className="font-semibold text-sm mt-1">{q.questionText}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-white/60">
                        <span className={q.correctAnswerIndex === 0 ? "text-emerald-400 font-bold" : ""}>A) {q.optionA}</span>
                        <span className={q.correctAnswerIndex === 1 ? "text-emerald-400 font-bold" : ""}>B) {q.optionB}</span>
                        <span className={q.correctAnswerIndex === 2 ? "text-emerald-400 font-bold" : ""}>C) {q.optionC}</span>
                        <span className={q.correctAnswerIndex === 3 ? "text-emerald-400 font-bold" : ""}>D) {q.optionD}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs hover:bg-red-500/20"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ÇİZİM KELİMELERİ SEKMESİ */}
        {activeTab === "draw" && (
          <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-bold mb-4">Çizim Oyunu Kelime Havuzu</h2>
            <form onSubmit={handleAddDrawWord} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">Çizilecek Kelime</label>
                <input
                  type="text"
                  value={drawWord}
                  onChange={(e) => setDrawWord(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-400"
                  placeholder="Örn: Denizaltı, Helikopter, Gitar"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 block mb-1">Kategori</label>
                  <input
                    type="text"
                    value={drawCategory}
                    onChange={(e) => setDrawCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1">Zorluk Seviyesi</label>
                  <select
                    value={drawDifficulty}
                    onChange={(e) => setDrawDifficulty(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value={1}>Kolay (1)</option>
                    <option value={2}>Orta (2)</option>
                    <option value={3}>Zor (3)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold text-sm shadow-md active:scale-98"
              >
                Kelimeyi Havuza Ekle
              </button>
            </form>
          </div>
        )}

        {/* 3. PUZZLE GÖRSELLERİ SEKMESİ */}
        {activeTab === "puzzle" && (
          <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-bold mb-4">Sistem Yapboz Görseli Yükle</h2>
            <form onSubmit={handleUploadPuzzle} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">Görsel Başlığı / Açıklaması</label>
                <input
                  type="text"
                  value={puzzleTitle}
                  onChange={(e) => setPuzzleTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
                  placeholder="Örn: Gün Batımı Manzarası"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Dosya Seç (JPG / PNG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPuzzleFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl font-bold text-sm shadow-md active:scale-98"
              >
                Görseli Kaydet
              </button>
            </form>
          </div>
        )}

        {/* 4. SÖZLÜK TOPLU AKTARIM SEKMESİ */}
        {activeTab === "dictionary" && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-bold mb-2">Toplu Sözlük Kelimesi Yükleme</h2>
            <p className="text-xs text-white/40 mb-4">
              Kelimeleri virgülle veya alt alta satır bırakarak yapıştırın. Sistem yinelenenleri temizleyip sözlüğe ekleyecektir.
            </p>
            <form onSubmit={handleBulkDictionary} className="space-y-4">
              <textarea
                rows={8}
                value={bulkWordsText}
                onChange={(e) => setBulkWordsText(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono outline-none focus:border-emerald-400"
                placeholder="elma&#10;armut&#10;bilgisayar&#10;yazılım..."
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-xl font-bold text-sm shadow-md active:scale-98"
              >
                Kelimeleri İçe Aktar
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
        active
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}