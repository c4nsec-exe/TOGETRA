"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  text: string;
  mine: boolean;
  time: string;
};

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🥰",
  "😘",
  "😎",
  "🤗",
  "🥹",
  "😭",
  "😅",
  "🤭",
  "🙈",
  "😉",
  "😜",
  "😏",
  "❤️",
  "🩷",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "💕",
  "💖",
  "💗",
  "💓",
  "💞",
  "✨",
  "🔥",
  "⭐",
  "🎉",
  "🥳",
  "👏",
  "🙌",
  "👍",
  "👎",
  "🤝",
  "💋",
  "🌸",
  "🌙",
  "☀️",
  "🫶",
];

export default function Chat({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Buradayım ❤️",
      mine: false,
      time: "Şimdi",
    },
  ]);

  const emojiRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Emoji panel dışına tıklanınca kapat */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Emoji seç */
  function addEmoji(emoji: string) {
    setMessage((current) => current + emoji);

    setShowEmojiPicker(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  /* Mesaj gönder */
  function sendMessage(event: FormEvent) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    const now = new Date();

    const time = now.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        text: cleanMessage,
        mine: true,
        time,
      },
    ]);

    setMessage("");
    setShowEmojiPicker(false);
  }

  return (
    <div className="h-full flex flex-col bg-[#0d0c16] text-white">
      {/* =========================
          CHAT HEADER
      ========================= */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <h2 className="font-bold text-lg">Sohbet</h2>

          <p className="text-xs text-white/35 mt-0.5">
            Birlikte konuşun 💜
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-white/50 hover:text-white"
            aria-label="Sohbeti kapat"
          >
            ✕
          </button>
        )}
      </div>

      {/* =========================
          MESSAGES
      ========================= */}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>

              <p className="text-white/50 text-sm">
                Henüz mesaj yok.
              </p>

              <p className="text-white/25 text-xs mt-1">
                İlk mesajı sen gönder.
              </p>
            </div>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.mine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[65%] ${
                  item.mine
                    ? "bg-gradient-to-r from-purple-600 to-pink-500"
                    : "bg-white/[0.07] border border-white/10"
                } rounded-2xl px-4 py-3`}
              >
                <p className="text-sm leading-6 break-words">
                  {item.text}
                </p>

                <p
                  className={`text-[10px] mt-1 ${
                    item.mine
                      ? "text-white/60"
                      : "text-white/25"
                  }`}
                >
                  {item.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================
          INPUT AREA
      ========================= */}

      <div className="relative border-t border-white/10 p-3 sm:p-4 bg-[#0a0910]">
        {/* =========================
            EMOJI PICKER
        ========================= */}

        {showEmojiPicker && (
          <div
            ref={emojiRef}
            className="absolute bottom-[88px] left-3 sm:left-4 w-[calc(100%-24px)] sm:w-[360px] rounded-2xl border border-white/10 bg-[#171521] shadow-2xl shadow-black/50 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white/80">
                Emoji seç
              </p>

              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-white/30 hover:text-white transition text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-8 gap-1 max-h-[220px] overflow-y-auto pr-1">
              {EMOJIS.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-white/10 active:scale-90 transition text-xl flex items-center justify-center"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================
            MESSAGE FORM
        ========================= */}

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2"
        >
          {/* Emoji Button */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowEmojiPicker((current) => !current)
              }
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition border ${
                showEmojiPicker
                  ? "bg-purple-500/20 border-purple-400/40 scale-105"
                  : "bg-white/[0.06] border-white/10 hover:bg-white/10"
              }`}
              aria-label="Emoji seç"
            >
              😊
            </button>
          </div>

          {/* Input */}

          <input
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 min-w-0 h-12 rounded-2xl bg-white/[0.06] border border-white/10 px-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-purple-400/40 focus:bg-white/[0.08] transition"
          />

          {/* Send */}

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-lg transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            aria-label="Mesaj gönder"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}