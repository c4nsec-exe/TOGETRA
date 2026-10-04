"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_CONFIG } from "../../lib/config";

export default function CreateRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || "couple";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roomConfigMap: Record<string, { title: string; icon: string; subtitle: string }> = {
    couple: { title: "Çiftler Odası", icon: "❤️", subtitle: "Sadece ikinize özel şifreli alan." },
    friends: { title: "Arkadaş Grubu", icon: "👥", subtitle: "Eğlence ve rekabet dolu oda." },
    family: { title: "Aile Buluşması", icon: "👨‍👩‍👧‍👦", subtitle: "Uzakları yakın eden sıcak buluşma." },
  };

  const currentConfig = roomConfigMap[rawType] || roomConfigMap.couple;

  async function handleCreateRoom() {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: rawType === "couple" ? 1 : rawType === "friends" ? 2 : 3
        }),
      });

      if (!response.ok) {
        throw new Error("Oda oluşturulamadı.");
      }

      const data = await response.json();
      const roomId = data.roomCode || data.code || "TOGETRA-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      router.push(`/room/${roomId}?type=${rawType}`);
    } catch (err: any) {
      const fallbackRoomId = "TOGETRA-" + Math.floor(100000 + Math.random() * 900000);
      router.push(`/room/${fallbackRoomId}?type=${rawType}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060509] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white transition">
            ← Ana Sayfa
          </Link>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-4xl mb-6 shadow-inner">
            {currentConfig.icon}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Oda Kurulumu</p>
          <h1 className="text-3xl font-black mt-2">{currentConfig.title}</h1>
          <p className="text-white/50 text-sm mt-3 leading-6">{currentConfig.subtitle}</p>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-bold text-white transition hover:scale-[1.02] shadow-[0_10px_30px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              {loading ? "Oda Oluşturuluyor..." : "Odayı Hemen Başlat →"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}