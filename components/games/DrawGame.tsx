"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type DrawGameProps = {
  roomId: string;
  connection: any;
  onClose: () => void;
  onSendMessage?: (text: string) => void;
};

type Tool = "brush" | "fill" | "circle" | "oval" | "square" | "rectangle" | "star";

type StrokeData = {
  type: "brush" | "fill" | "shape";
  shapeType?: Tool;
  rX0?: number;
  rY0?: number;
  rX1?: number;
  rY1?: number;
  rX?: number;
  rY?: number;
  color: string;
  size: number;
};

const COLORS = [
  { color: "#FF1744", icon: "❤️", name: "Kırmızı" },
  { color: "#FF6D00", icon: "🟠", name: "Turuncu" },
  { color: "#FFD600", icon: "💛", name: "Sarı" },
  { color: "#00E676", icon: "💚", name: "Yeşil" },
  { color: "#00E5FF", icon: "💎", name: "Turkuaz" },
  { color: "#2979FF", icon: "💙", name: "Mavi" },
  { color: "#651FFF", icon: "💜", name: "Mor" },
  { color: "#FF1493", icon: "💗", name: "Pembe" },
  { color: "#92400E", icon: "🟤", name: "Kahverengi" },
  { color: "#FFFFFF", icon: "⚪", name: "Beyaz" },
  { color: "#777777", icon: "⚙️", name: "Gri" },
  { color: "#111111", icon: "⚫", name: "Siyah" },
];

const TOOLS: { id: Tool; icon: string; name: string }[] = [
  { id: "brush", icon: "✏️", name: "Kalem" },
  { id: "fill", icon: "🪣", name: "Boya Kovası" },
  { id: "circle", icon: "⭕", name: "Daire" },
  { id: "oval", icon: "🥚", name: "Oval" },
  { id: "square", icon: "⬜", name: "Kare" },
  { id: "rectangle", icon: "▭", name: "Dikdörtgen" },
  { id: "star", icon: "⭐", name: "Yıldız" },
];

const BRUSH_SIZES = [
  { value: 3, icon: "·" },
  { value: 6, icon: "•" },
  { value: 10, icon: "●" },
  { value: 16, icon: "⬤" },
  { value: 24, icon: "●" },
];

const ROUND_TIME = 60;

export default function DrawGame({ roomId, connection, onClose, onSendMessage }: DrawGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0, relX: 0, relY: 0 });
  const lastPointRef = useRef({ x: 0, y: 0, relX: 0, relY: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Çizim geçmişi: Ekran boyutu değiştiğinde canvas'ın silinmesini önler
  const strokesHistoryRef = useRef<StrokeData[]>([]);

  // SignalR Oyun State'leri
  const [role, setRole] = useState<"Drawer" | "Guesser" | null>(null);
  const [word, setWord] = useState("");
  const [wordLength, setWordLength] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [guess, setGuess] = useState("");

  const [brushSize, setBrushSize] = useState(6);
  const [color, setColor] = useState("#FF1744");
  const [tool, setTool] = useState<Tool>("brush");

  // =========================================================
  // ÇİZİM MOTORU (CORE DRAWING ENGINE)
  // =========================================================
  const drawShapeOnContext = (
    ctx: CanvasRenderingContext2D,
    shape: Tool,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const width = endX - startX;
    const height = endY - startY;
    ctx.beginPath();

    if (shape === "circle") {
      const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
      ctx.arc(startX + width / 2, startY + height / 2, radius, 0, Math.PI * 2);
    } else if (shape === "oval") {
      ctx.ellipse(
        startX + width / 2,
        startY + height / 2,
        Math.abs(width) / 2,
        Math.abs(height) / 2,
        0,
        0,
        Math.PI * 2
      );
    } else if (shape === "square") {
      const size = Math.min(Math.abs(width), Math.abs(height));
      ctx.rect(width < 0 ? startX - size : startX, height < 0 ? startY - size : startY, size, size);
    } else if (shape === "rectangle") {
      ctx.rect(startX, startY, width, height);
    } else if (shape === "star") {
      const cx = startX + width / 2;
      const cy = startY + height / 2;
      const outerR = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const innerR = outerR * 0.42;
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerR : innerR;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.stroke();
  };

  const floodFill = (startX: number, startY: number, fillColorStr: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const x = Math.floor(startX);
    const y = Math.floor(startY);
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const startIndex = (y * width + x) * 4;

    const targetR = pixels[startIndex];
    const targetG = pixels[startIndex + 1];
    const targetB = pixels[startIndex + 2];
    const targetA = pixels[startIndex + 3];

    const cleanHex = fillColorStr.replace("#", "");
    const num = parseInt(cleanHex, 16);
    const fillR = (num >> 16) & 255;
    const fillG = (num >> 8) & 255;
    const fillB = num & 255;
    const fillA = 255;

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const tolerance = 24;
    const matchesTarget = (idx: number) => {
      return (
        Math.abs(pixels[idx] - targetR) <= tolerance &&
        Math.abs(pixels[idx + 1] - targetG) <= tolerance &&
        Math.abs(pixels[idx + 2] - targetB) <= tolerance &&
        Math.abs(pixels[idx + 3] - targetA) <= tolerance
      );
    };

    const visited = new Uint8Array(width * height);
    const stack: number[] = [y * width + x];
    visited[y * width + x] = 1;

    while (stack.length > 0) {
      const pos = stack.pop()!;
      const px = pos % width;
      const py = Math.floor(pos / width);
      const idx = pos * 4;

      pixels[idx] = fillR;
      pixels[idx + 1] = fillG;
      pixels[idx + 2] = fillB;
      pixels[idx + 3] = fillA;

      if (px > 0 && !visited[pos - 1] && matchesTarget((pos - 1) * 4)) {
        visited[pos - 1] = 1;
        stack.push(pos - 1);
      }
      if (px < width - 1 && !visited[pos + 1] && matchesTarget((pos + 1) * 4)) {
        visited[pos + 1] = 1;
        stack.push(pos + 1);
      }
      if (py > 0 && !visited[pos - width] && matchesTarget((pos - width) * 4)) {
        visited[pos - width] = 1;
        stack.push(pos - width);
      }
      if (py < height - 1 && !visited[pos + width] && matchesTarget((pos + width) * 4)) {
        visited[pos + width] = 1;
        stack.push(pos + width);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const renderStroke = useCallback((stroke: StrokeData, recordHistory = true) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    if (recordHistory) {
      strokesHistoryRef.current.push(stroke);
    }

    const w = canvas.width;
    const h = canvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.size * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (stroke.type === "brush" && stroke.rX0 !== undefined && stroke.rY0 !== undefined && stroke.rX1 !== undefined && stroke.rY1 !== undefined) {
      ctx.beginPath();
      ctx.moveTo(stroke.rX0 * w, stroke.rY0 * h);
      ctx.lineTo(stroke.rX1 * w, stroke.rY1 * h);
      ctx.stroke();
    } else if (stroke.type === "fill" && stroke.rX !== undefined && stroke.rY !== undefined) {
      floodFill(stroke.rX * w, stroke.rY * h, stroke.color);
    } else if (stroke.type === "shape" && stroke.shapeType && stroke.rX0 !== undefined && stroke.rY0 !== undefined && stroke.rX1 !== undefined && stroke.rY1 !== undefined) {
      drawShapeOnContext(ctx, stroke.shapeType, stroke.rX0 * w, stroke.rY0 * h, stroke.rX1 * w, stroke.rY1 * h);
    }
    ctx.restore();
  }, []);

  const redrawAllStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#11101a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokesHistoryRef.current) {
      renderStroke(stroke, false);
    }
  }, [renderStroke]);

  // =========================================================
  // SIGNALR EVENT LISTENERS
  // =========================================================
  useEffect(() => {
    if (!connection) return;

    const handleRoleAssigned = (data: { role: "Drawer" | "Guesser"; word?: string; wordLength?: number }) => {
      setRole(data.role);
      if (data.role === "Drawer") {
        setWord(data.word || "");
      } else {
        setWordLength(data.wordLength || 0);
      }
      setGameStarted(true);
      setWinnerMessage(null);
      setTimeLeft(ROUND_TIME);
      strokesHistoryRef.current = [];
      redrawAllStrokes();
    };

    const handleReceiveStroke = (data: StrokeData) => {
      renderStroke(data, true);
    };

    const handleCanvasCleared = () => {
      strokesHistoryRef.current = [];
      redrawAllStrokes();
    };

    const handleGameEnded = (data: { winner: string; word: string }) => {
      setWinnerMessage(`🎉 Tebrikler! "${data.word}" kelimesini ${data.winner} doğru bildi!`);
      setGameStarted(false);
    };

    connection.on("DrawRoleAssigned", handleRoleAssigned);
    connection.on("ReceiveDrawStroke", handleReceiveStroke);
    connection.on("CanvasCleared", handleCanvasCleared);
    connection.on("DrawGameEnded", handleGameEnded);

    return () => {
      connection.off("DrawRoleAssigned", handleRoleAssigned);
      connection.off("ReceiveDrawStroke", handleReceiveStroke);
      connection.off("CanvasCleared", handleCanvasCleared);
      connection.off("DrawGameEnded", handleGameEnded);
    };
  }, [connection, renderStroke, redrawAllStrokes]);

  // =========================================================
  // RESPONSIVE CANVAS & YENİDEN BOYUTLANDIRMA
  // =========================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(280, Math.floor(rect.width));
      const cssHeight = Math.max(300, Math.floor(Math.min(cssWidth * 0.7, 520)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      redrawAllStrokes();
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    return () => observer.disconnect();
  }, [redrawAllStrokes]);

  // =========================================================
  // GÖNDERME VE KOORDİNAT HESABI
  // =========================================================
  const broadcastStroke = (strokeData: StrokeData) => {
    renderStroke(strokeData, true);
    if (connection?.state === "Connected") {
      connection.invoke("SendDrawStroke", roomId, strokeData).catch(console.error);
    }
  };

  const getCanvasPosition = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, relX: 0, relY: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return {
      x,
      y,
      relX: Number((x / canvas.width).toFixed(4)),
      relY: Number((y / canvas.height).toFixed(4)),
    };
  };

  // =========================================================
  // POINTER ACTIONS
  // =========================================================
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!gameStarted || role !== "Drawer") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const pos = getCanvasPosition(event);

    if (tool === "fill") {
      broadcastStroke({ type: "fill", rX: pos.relX, rY: pos.relY, color, size: brushSize });
      return;
    }

    isDrawingRef.current = true;
    startPointRef.current = pos;
    lastPointRef.current = pos;

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {}

    if (tool === "brush") {
      broadcastStroke({
        type: "brush",
        rX0: pos.relX,
        rY0: pos.relY,
        rX1: pos.relX + 0.0001,
        rY1: pos.relY + 0.0001,
        color,
        size: brushSize,
      });
      return;
    }

    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || role !== "Drawer") return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const currentPos = getCanvasPosition(event);

    if (tool === "brush") {
      broadcastStroke({
        type: "brush",
        rX0: lastPointRef.current.relX,
        rY0: lastPointRef.current.relY,
        rX1: currentPos.relX,
        rY1: currentPos.relY,
        color,
        size: brushSize,
      });
      lastPointRef.current = currentPos;
      return;
    }

    // Şekil önizlemesi (Local Preview)
    if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawShapeOnContext(ctx, tool, startPointRef.current.x, startPointRef.current.y, currentPos.x, currentPos.y);
    ctx.restore();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || role !== "Drawer") return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const endPos = getCanvasPosition(event);

    if (tool !== "brush" && tool !== "fill") {
      broadcastStroke({
        type: "shape",
        shapeType: tool,
        rX0: startPointRef.current.relX,
        rY0: startPointRef.current.relY,
        rX1: endPos.relX,
        rY1: endPos.relY,
        color,
        size: brushSize,
      });
    }

    isDrawingRef.current = false;
    snapshotRef.current = null;
    if (canvas) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {}
    }
  };

  // =========================================================
  // TIMER & OYUN AKIŞI
  // =========================================================
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    if (connection?.state === "Connected") {
      connection.invoke("StartDrawGame", roomId).catch(console.error);
    }
  };

  const handleClearCanvas = () => {
    strokesHistoryRef.current = [];
    redrawAllStrokes();
    if (connection?.state === "Connected") {
      connection.invoke("ClearCanvas", roomId).catch(console.error);
    }
  };

  const sendGuess = () => {
    if (!guess.trim()) return;
    if (onSendMessage) {
      onSendMessage(`[Tahmin] ${guess.trim()}`);
    }
    if (connection?.state === "Connected") {
      connection.invoke("SubmitDrawGuess", roomId, guess.trim()).catch(console.error);
    }
    setGuess("");
  };

  return (
    <section className="mb-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-4 sm:p-6 shadow-2xl">
      {/* HEADER */}
      <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-fuchsia-400 sm:text-xs">
            Birlikte Çiz & Tahmin Et
          </div>
          <h1 className="mt-1 truncate text-xl font-black sm:text-3xl">🎨 Çizim Alanı</h1>
          {gameStarted && (
            <p className="mt-1 text-sm font-semibold text-white/70">
              {role === "Drawer" ? (
                <span>
                  Çizilecek Kelime: <strong className="text-fuchsia-400">{word}</strong>
                </span>
              ) : (
                <span>
                  Tahmin Et! İpucu: <strong className="tracking-widest text-fuchsia-400">{"_ ".repeat(wordLength)}</strong> ({wordLength} Harf)
                </span>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 active:scale-95 sm:px-4 sm:text-sm"
        >
          ✕ Oyunu Kapat
        </button>
      </header>

      {/* WINNER MESSAGE */}
      {winnerMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-4 text-center font-bold text-emerald-300">
          {winnerMessage}
        </div>
      )}

      {/* START SCREEN */}
      {!gameStarted && (
        <div className="mx-auto max-w-xl py-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-fuchsia-500/10 text-4xl">
            🎨
          </div>
          <h2 className="text-2xl font-black">Hazır mısınız?</h2>
          <p className="mx-auto mt-3 mb-6 max-w-md text-sm leading-6 text-white/50">
            Oyunculardan biri çizecek, diğeri ise tahminde bulunacak. Sırayla puanları toplayın!
          </p>
          <button
            onClick={startGame}
            className="w-full max-w-xs rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-4 text-sm font-black transition hover:opacity-90 active:scale-[0.98]"
          >
            Oyunu Başlat
          </button>
        </div>
      )}

      {/* GAMEPLAY */}
      {gameStarted && (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* CANVAS CARD */}
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${timeLeft <= 10 ? "animate-ping bg-red-500" : "bg-emerald-400"}`} />
                {timeLeft}s Kaldı
              </div>
              {role === "Drawer" && (
                <button
                  onClick={handleClearCanvas}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/10 active:scale-95"
                >
                  🧹 Tuvali Temizle
                </button>
              )}
            </div>

            <div ref={containerRef} className="relative w-full p-2 sm:p-3">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onContextMenu={(e) => e.preventDefault()}
                className={`block w-full touch-none select-none rounded-2xl border border-white/10 bg-[#11101a] ${
                  role === "Drawer" ? "cursor-crosshair" : "cursor-not-allowed"
                }`}
              />
            </div>

            {/* TOOLS (Sadece çizen görür) */}
            {role === "Drawer" && (
              <div className="border-t border-white/10 p-3 sm:p-4">
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-white/40">Araçlar</div>
                    <div className="flex flex-wrap gap-1.5">
                      {TOOLS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTool(item.id)}
                          className={`flex h-10 flex-1 items-center justify-center rounded-xl border transition ${
                            tool === item.id
                              ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                              : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                          }`}
                          title={item.name}
                        >
                          <span className="text-base">{item.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-white/40">Fırça Boyutu</div>
                    <div className="flex gap-1.5">
                      {BRUSH_SIZES.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setBrushSize(item.value)}
                          className={`flex h-10 flex-1 items-center justify-center rounded-xl border transition ${
                            brushSize === item.value
                              ? "border-fuchsia-400 bg-fuchsia-500/20"
                              : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                          }`}
                        >
                          <span
                            className="rounded-full bg-white"
                            style={{
                              width: Math.min(item.value + 2, 16),
                              height: Math.min(item.value + 2, 16),
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[10px] font-black uppercase text-white/40">Renkler</div>
                  <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                    {COLORS.map((item) => (
                      <button
                        key={item.color}
                        onClick={() => setColor(item.color)}
                        className={`relative flex aspect-square items-center justify-center rounded-lg border transition ${
                          color === item.color
                            ? "scale-105 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      >
                        {color === item.color && (
                          <span className="text-[10px] font-black text-black">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR TAHMİN BÖLÜMÜ */}
          <aside className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400">
                Rolün
              </div>
              <h2 className="mt-1 text-xl font-black">
                {role === "Guesser" ? "🔍 Tahminci" : "🖌️ Ressam"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/50">
                {role === "Guesser"
                  ? "Çizilen resmi dikkatlice izle ve kelimeyi doğru tahmin etmeye çalış!"
                  : `Kelimeyi ("${word}") sadece çizerek anlat. Yazı veya harf kullanmak yok!`}
              </p>

              {role === "Guesser" && (
                <div className="mt-6">
                  <label htmlFor="draw-guess" className="mb-2 block text-xs font-bold text-white/60">
                    Tahminin
                  </label>
                  <input
                    id="draw-guess"
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendGuess()}
                    placeholder="Kelimeyi tahmin et..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 text-sm text-white outline-none transition focus:border-fuchsia-400"
                  />
                  <button
                    onClick={sendGuess}
                    className="mt-3 h-11 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-xs font-black uppercase tracking-wider text-white transition hover:opacity-90 active:scale-95"
                  >
                    Tahmin Gönder
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-bold text-white/60 transition hover:bg-white/[0.08] active:scale-95"
            >
              🔄 Yeni Tur Başlat
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}