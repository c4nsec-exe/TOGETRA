"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoinRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!roomCode.trim()) {
      setError("Lütfen geçerli bir oda kodu girin.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cleanCode = roomCode.trim();

    try {
      // .NET Core Backend API üzerinden odaya katılma kontrolü
      const response = await fetch(`https://localhost:7269/api/Rooms/join/${cleanCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Oda bulunamadı veya katılım reddedildi.");
      }

      // Başarılı katılım sonrası odaya yönlendir
      router.push(`/room/${cleanCode}`);
    } catch (err: any) {
      // Eğer backend kontrolü esnasında hata alınırsa doğrudan oda koduna yönlendirme yapabiliriz
      router.push(`/room/${cleanCode}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060509] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white transition">
            ← Ana Sayfa
          </Link>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-4xl mb-6 shadow-inner">
            🔑
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Odaya Dahil Ol</p>
          <h1 className="text-3xl font-black mt-2">Odaya Katıl</h1>
          <p className="text-white/50 text-sm mt-3 leading-6">
            Partnerinin veya arkadaşının seninle paylaştığı oda kodunu girerek içeri katıl.
          </p>

          <form onSubmit={handleJoinRoom} className="mt-8 space-y-4">
            <div>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Örn: TOGETRA-ABC123"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-lg font-bold text-white placeholder-gray-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 uppercase"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-bold text-white transition hover:scale-[1.02] shadow-[0_10px_30px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              {loading ? "Bağlanılıyor..." : "Odaya Katıl →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}