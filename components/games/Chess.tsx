"use client";

import { useState } from "react";
import { Chess, Square } from "chess.js";

type ChessGameProps = {
  onBack?: () => void;
};

const pieceSymbols: Record<string, string> = {
  wp: "♙",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  wq: "♕",
  wk: "♔",

  bp: "♟",
  br: "♜",
  bn: "♞",
  bb: "♝",
  bq: "♛",
  bk: "♚",
};

type PromotionPiece = "q" | "r" | "b" | "n";

export default function ChessGame({
  onBack,
}: ChessGameProps) {
  const [game, setGame] = useState(
    () => new Chess()
  );

  const [selectedSquare, setSelectedSquare] =
    useState<Square | null>(null);

  const [promotionSquare, setPromotionSquare] =
    useState<Square | null>(null);

  const board = game.board();

  const currentTurn = game.turn();

  const gameOver = game.isGameOver();

  const legalMoves = selectedSquare
    ? game
        .moves({
          square: selectedSquare,
          verbose: true,
        })
        .map((move) => move.to as Square)
    : [];

  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setPromotionSquare(null);
  };

  const statusText = () => {
    if (game.isCheckmate()) {
      return currentTurn === "w"
        ? "Siyah kazandı."
        : "Beyaz kazandı.";
    }

    if (game.isStalemate()) {
      return "Pat oldu. Beraberlik.";
    }

    if (game.isThreefoldRepetition()) {
      return "Üçlü tekrar. Beraberlik.";
    }

    if (game.isInsufficientMaterial()) {
      return "Yetersiz materyal. Beraberlik.";
    }

    if (game.isDraw()) {
      return "Beraberlik.";
    }

    if (game.inCheck()) {
      return currentTurn === "w"
        ? "Beyaz şah tehdit altında."
        : "Siyah şah tehdit altında.";
    }

    return currentTurn === "w"
      ? "Beyazın sırası."
      : "Siyahın sırası.";
  };

  const isLastMoveSquare = (
    square: Square
  ) => {
    const history = game.history({
      verbose: true,
    });

    if (history.length === 0) {
      return false;
    }

    const lastMove =
      history[history.length - 1];

    return (
      lastMove.from === square ||
      lastMove.to === square
    );
  };

  const handleSquareClick = (
    square: Square
  ) => {
    if (gameOver) {
      return;
    }

    const piece = game.get(square);

    /*
     * Eğer zaten bir taş seçiliyse
     * ve tıklanan kare legal hamleyse
     */
    if (
      selectedSquare &&
      legalMoves.includes(square)
    ) {
      const movingPiece =
        game.get(selectedSquare);

      const reachesLastRank =
        movingPiece?.type === "p" &&
        (
          (
            movingPiece.color === "w" &&
            square[1] === "8"
          ) ||
          (
            movingPiece.color === "b" &&
            square[1] === "1"
          )
        );

      /*
       * Piyon terfisi
       */
      if (reachesLastRank) {
        setPromotionSquare(square);
        return;
      }

      try {
        const nextGame =
          new Chess(game.fen());

        nextGame.move({
          from: selectedSquare,
          to: square,
        });

        setGame(nextGame);
        setSelectedSquare(null);
      } catch (error) {
        console.error(error);
        setSelectedSquare(null);
      }

      return;
    }

    /*
     * Kendi taşına tıklanırsa onu seç
     */
    if (
      piece &&
      piece.color === currentTurn
    ) {
      setSelectedSquare(square);
      return;
    }

    /*
     * Boş veya rakibin taşına
     * yanlış tıklandıysa seçimi kaldır
     */
    setSelectedSquare(null);
  };

  const promotePawn = (
    promotion: PromotionPiece
  ) => {
    if (
      !selectedSquare ||
      !promotionSquare
    ) {
      return;
    }

    try {
      const nextGame =
        new Chess(game.fen());

      nextGame.move({
        from: selectedSquare,
        to: promotionSquare,
        promotion,
      });

      setGame(nextGame);
      setSelectedSquare(null);
      setPromotionSquare(null);
    } catch (error) {
      console.error(error);

      setSelectedSquare(null);
      setPromotionSquare(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#08070d] text-white px-4 py-6 sm:px-6 sm:py-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <button
              type="button"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  window.history.back();
                }
              }}
              className="text-white/40 hover:text-white transition text-sm mb-3"
            >
              ← Geri
            </button>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                ♟️
              </div>

              <div>

                <p className="text-xs text-purple-300 font-semibold tracking-[0.18em]">
                  TAHTA DÜELLOSU
                </p>

                <h1 className="text-2xl sm:text-3xl font-black">
                  Tahtın Efendisi
                </h1>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={resetGame}
            className="min-h-11 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] transition text-sm font-semibold"
          >
            ↻ Yeni Oyun
          </button>

        </div>

        {/* STATUS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>

              <p className="text-xs text-white/30">
                DURUM
              </p>

              <p className="font-bold mt-1">
                {statusText()}
              </p>

            </div>

            <div className="text-sm text-white/40">

              Hamle:{" "}

              <span className="text-white font-semibold">
                {game.history().length}
              </span>

            </div>

          </div>

        </div>

        {/* CHESS BOARD */}
        <div className="w-full max-w-[720px] mx-auto">

          <div className="aspect-square grid grid-cols-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">

            {board.map((row, rowIndex) =>
              row.map((square, colIndex) => {

                const file =
                  String.fromCharCode(
                    97 + colIndex
                  );

                const rank =
                  String(8 - rowIndex);

                const squareName =
                  `${file}${rank}` as Square;

                const piece =
                  square?.color &&
                  square.type
                    ? pieceSymbols[
                        `${square.color}${square.type}`
                      ]
                    : null;

                const dark =
                  (rowIndex + colIndex) %
                    2 ===
                  1;

                const selected =
                  selectedSquare ===
                  squareName;

                const legal =
                  legalMoves.includes(
                    squareName
                  );

                const lastMove =
                  isLastMoveSquare(
                    squareName
                  );

                return (
                  <button
                    key={squareName}
                    type="button"
                    onClick={() =>
                      handleSquareClick(
                        squareName
                      )
                    }
                    aria-label={`Satranç karesi ${squareName}`}
                    className={`
                      relative
                      flex
                      items-center
                      justify-center
                      aspect-square
                      select-none
                      transition
                      hover:brightness-110
                      ${
                        dark
                          ? "bg-[#626c77]"
                          : "bg-[#d9dde2]"
                      }
                      ${
                        lastMove
                          ? "ring-2 ring-inset ring-yellow-300/30"
                          : ""
                      }
                      ${
                        selected
                          ? "ring-4 ring-inset ring-purple-400"
                          : ""
                      }
                    `}
                  >

                    {/* TAŞ */}
                    {piece && (
                      <span
                        className={`
                          relative
                          z-10
                          leading-none
                          text-[clamp(28px,7vw,64px)]
                          ${
                            square?.color === "w"
                              ? "text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]"
                              : "text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]"
                          }
                        `}
                      >
                        {piece}
                      </span>
                    )}

                    {/* LEGAL HAMLE */}
                    {legal && (
                      <span
                        className={`
                          absolute
                          z-20
                          rounded-full
                          bg-purple-400/70
                          ${
                            piece
                              ? "w-[28%] h-[28%]"
                              : "w-[18%] h-[18%]"
                          }
                        `}
                      />
                    )}

                    {/* RANK */}
                    {colIndex === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] sm:text-xs font-bold opacity-50">
                        {rank}
                      </span>
                    )}

                    {/* FILE */}
                    {rowIndex === 7 && (
                      <span className="absolute bottom-1 right-1 text-[10px] sm:text-xs font-bold opacity-50">
                        {file}
                      </span>
                    )}

                  </button>
                );
              })
            )}

          </div>

        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="text-xs text-white/30">
              SIRA
            </p>

            <p className="font-bold mt-1">
              {currentTurn === "w"
                ? "♙ Beyaz"
                : "♟ Siyah"}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="text-xs text-white/30">
              TAHTA
            </p>

            <p className="font-bold mt-1">
              8 × 8
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <p className="text-xs text-white/30">
              OYUN
            </p>

            <p className="font-bold mt-1">
              Tahtın Efendisi
            </p>

          </div>

        </div>

      </div>

      {/* PROMOTION */}
      {promotionSquare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111019] p-6 shadow-2xl">

            <p className="text-xs text-purple-300 font-semibold tracking-[0.18em]">
              PİYON TERFİSİ
            </p>

            <h2 className="text-2xl font-black mt-2">
              Taşını seç
            </h2>

            <p className="text-white/40 text-sm mt-2">
              Piyonunu hangi taşa dönüştürmek istiyorsun?
            </p>

            <div className="grid grid-cols-4 gap-3 mt-6">

              {(
                [
                  ["q", "Vezir"],
                  ["r", "Kale"],
                  ["b", "Fil"],
                  ["n", "At"],
                ] as [
                  PromotionPiece,
                  string
                ][]
              ).map(
                ([value, name]) => {

                  const color =
                    currentTurn === "w"
                      ? "w"
                      : "b";

                  const symbol =
                    pieceSymbols[
                      `${color}${value}`
                    ];

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        promotePawn(value)
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] transition p-4"
                    >

                      <div className="text-5xl">
                        {symbol}
                      </div>

                      <div className="text-xs text-white/40 mt-2">
                        {name}
                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>

        </div>
      )}

    </main>
  );
}