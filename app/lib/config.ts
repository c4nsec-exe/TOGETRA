// Sondaki olası slash işaretini temizler ve ortam değişkeni yoksa fallback kullanır
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7269";
const cleanUrl = rawUrl.replace(/\/+$/, "");

export const API_CONFIG = {
  BASE_URL: cleanUrl,
  SIGNALR_ROOM_HUB: `${cleanUrl}/hubs/room`,
  AUTH_API: `${cleanUrl}/api/Auth`,
};

// Tarayıcı konsolunda nereye bağlandığını açıkça görmek için:
if (typeof window !== "undefined") {
  console.log("[TOGETRA CONFIG] Aktif Backend URL:", API_CONFIG.BASE_URL);
}