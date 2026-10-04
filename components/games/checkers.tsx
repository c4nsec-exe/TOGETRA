"use client";

import { useMemo, useState } from "react";

type Player = "black" | "red";

type Piece = {
  player: Player;
  king: boolean;
};

type Board = (Piece | null)[][];

type CheckersGameProps = {
  onBack?: () => void;
};

type Position = {
  row: number;
  col: number;
};

const BOARD_SIZE = 8;

function createInitialBoard(): Board {
  const board: Board = Array.from(
    { length: BOARD_SIZE },
    () =>
      Array<Piece | null>(
        BOARD_SIZE
      ).fill(null)
  );

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          player: "black",
          king: false,
        };
      }
    }
  }

  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          player: "red",
          king: false,
        };
      }
    }
  }

  return board;
}

function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((piece) =>
      piece
        ? {
            ...piece,
          }
        : null
    )
  );
}

function inside(
  row: number,
  col: number
) {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE
  );
}

function getDirections(
  piece: Piece
): [number, number][] {
  if (piece.king) {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
  }

  if (piece.player === "black") {
    return [
      [1, -1],
      [1, 1],
    ];
  }

  return [
    [-1, -1],
    [-1, 1],
  ];
}

function getSimpleMoves(
  board: Board,
  row: number,
  col: number
): Position[] {
  const piece = board[row][col];

  if (!piece) {
    return [];
  }

  const moves: Position[] = [];

  for (const [dr, dc] of getDirections(piece)) {
    const nextRow = row + dr;
    const nextCol = col + dc;

    if (
      inside(nextRow, nextCol) &&
      board[nextRow][nextCol] === null
    ) {
      moves.push({
        row: nextRow,
        col: nextCol,
      });
    }
  }

  return moves;
}

function getCaptureMoves(
  board: Board,
  row: number,
  col: number
): Position[] {
  const piece = board[row][col];

  if (!piece) {
    return [];
  }

  const moves: Position[] = [];

  for (const [dr, dc] of getDirections(piece)) {
    const middleRow = row + dr;
    const middleCol = col + dc;

    const landingRow = row + dr * 2;
    const landingCol = col + dc * 2;

    if (
      !inside(
        middleRow,
        middleCol
      ) ||
      !inside(
        landingRow,
        landingCol
      )
    ) {
      continue;
    }

    const middlePiece =
      board[middleRow][middleCol];

    const landingPiece =
      board[landingRow][landingCol];

    if (
      middlePiece &&
      middlePiece.player !==
        piece.player &&
      landingPiece === null
    ) {
      moves.push({
        row: landingRow,
        col: landingCol,
      });
    }
  }

  return moves;
}

function hasAnyCapture(
  board: Board,
  player: Player
) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (
      let col = 0;
      col < BOARD_SIZE;
      col++
    ) {
      const piece =
        board[row][col];

      if (
        piece &&
        piece.player === player &&
        getCaptureMoves(
          board,
          row,
          col
        ).length > 0
      ) {
        return true;
      }
    }
  }

  return false;
}

function hasAnyMove(
  board: Board,
  player: Player
) {
  const forcedCapture =
    hasAnyCapture(
      board,
      player
    );

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (
      let col = 0;
      col < BOARD_SIZE;
      col++
    ) {
      const piece =
        board[row][col];

      if (
        !piece ||
        piece.player !== player
      ) {
        continue;
      }

      if (
        forcedCapture
      ) {
        if (
          getCaptureMoves(
            board,
            row,
            col
          ).length > 0
        ) {
          return true;
        }
      } else if (
        getSimpleMoves(
          board,
          row,
          col
        ).length > 0
      ) {
        return true;
      }
    }
  }

  return false;
}

function countPieces(
  board: Board,
  player: Player
) {
  let count = 0;

  for (const row of board) {
    for (const piece of row) {
      if (
        piece?.player ===
        player
      ) {
        count++;
      }
    }
  }

  return count;
}

export default function CheckersGame({
  onBack,
}: CheckersGameProps) {
  const [
    board,
    setBoard,
  ] = useState<Board>(
    createInitialBoard()
  );

  const [
    currentPlayer,
    setCurrentPlayer,
  ] = useState<Player>(
    "black"
  );

  const [
    selected,
    setSelected,
  ] = useState<Position | null>(
    null
  );

  const [
    winner,
    setWinner,
  ] = useState<Player | null>(
    null
  );

  const [
    mustContinueCapture,
    setMustContinueCapture,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "Siyah taşlar başlar."
  );

  const forcedCapture = useMemo(
    () =>
      hasAnyCapture(
        board,
        currentPlayer
      ),
    [
      board,
      currentPlayer,
    ]
  );

  const legalMoves = useMemo(() => {
    if (!selected) {
      return [];
    }

    if (
      mustContinueCapture
    ) {
      return getCaptureMoves(
        board,
        selected.row,
        selected.col
      );
    }

    if (forcedCapture) {
      return getCaptureMoves(
        board,
        selected.row,
        selected.col
      );
    }

    return getSimpleMoves(
      board,
      selected.row,
      selected.col
    );
  }, [
    board,
    selected,
    forcedCapture,
    mustContinueCapture,
  ]);

  const resetGame = () => {
    setBoard(
      createInitialBoard()
    );

    setCurrentPlayer(
      "black"
    );

    setSelected(null);

    setWinner(null);

    setMustContinueCapture(
      false
    );

    setMessage(
      "Siyah taşlar başlar."
    );
  };

  const promoteIfNeeded = (
    piece: Piece,
    row: number
  ): Piece => {
    if (piece.king) {
      return piece;
    }

    if (
      piece.player ===
        "black" &&
      row === 7
    ) {
      return {
        ...piece,
        king: true,
      };
    }

    if (
      piece.player ===
        "red" &&
      row === 0
    ) {
      return {
        ...piece,
        king: true,
      };
    }

    return piece;
  };

  const makeMove = (
    from: Position,
    to: Position
  ) => {
    const nextBoard =
      cloneBoard(board);

    const movingPiece =
      nextBoard[from.row][from.col];

    if (!movingPiece) {
      return;
    }

    nextBoard[from.row][from.col] =
      null;

    let wasCapture =
      false;

    if (
      Math.abs(
        to.row - from.row
      ) === 2 &&
      Math.abs(
        to.col - from.col
      ) === 2
    ) {
      wasCapture = true;

      const middleRow =
        (from.row +
          to.row) /
        2;

      const middleCol =
        (from.col +
          to.col) /
        2;

      nextBoard[middleRow][
        middleCol
      ] = null;
    }

    nextBoard[to.row][to.col] =
      promoteIfNeeded(
        movingPiece,
        to.row
      );

    setBoard(nextBoard);

    if (wasCapture) {
      const moreCaptures =
        getCaptureMoves(
          nextBoard,
          to.row,
          to.col
        );

      if (
        moreCaptures.length > 0
      ) {
        setSelected({
          row: to.row,
          col: to.col,
        });

        setMustContinueCapture(
          true
        );

        setMessage(
          "Devam eden taş alma hamlesini tamamla."
        );

        return;
      }
    }

    const opponent =
      currentPlayer === "black"
        ? "red"
        : "black";

    const opponentPieces =
      countPieces(
        nextBoard,
        opponent
      );

    if (
      opponentPieces === 0 ||
      !hasAnyMove(
        nextBoard,
        opponent
      )
    ) {
      setWinner(
        currentPlayer
      );

      setSelected(null);

      setMustContinueCapture(
        false
      );

      setMessage(
        currentPlayer ===
          "black"
          ? "Siyah kazandı! 🎉"
          : "Kırmızı kazandı! 🎉"
      );

      return;
    }

    setCurrentPlayer(
      opponent
    );

    setSelected(null);

    setMustContinueCapture(
      false
    );

    setMessage(
      opponent === "black"
        ? "Sıra siyah taşlarda."
        : "Sıra kırmızı taşlarda."
    );
  };

  const handleSquareClick = (
    row: number,
    col: number
  ) => {
    if (winner) {
      return;
    }

    const piece =
      board[row][col];

    if (selected) {
      const targetIsLegal =
        legalMoves.some(
          (move) =>
            move.row === row &&
            move.col === col
        );

      if (targetIsLegal) {
        makeMove(
          selected,
          {
            row,
            col,
          }
        );

        return;
      }
    }

    if (
      piece &&
      piece.player ===
        currentPlayer
    ) {
      const captureMoves =
        getCaptureMoves(
          board,
          row,
          col
        );

      const simpleMoves =
        getSimpleMoves(
          board,
          row,
          col
        );

      if (
        forcedCapture &&
        captureMoves.length ===
          0
      ) {
        setMessage(
          "Bu turda taş almak zorundasın."
        );

        return;
      }

      if (
        captureMoves.length ===
          0 &&
        simpleMoves.length ===
          0
      ) {
        setMessage(
          "Bu taşla geçerli bir hamle yok."
        );

        return;
      }

      setSelected({
        row,
        col,
      });

      return;
    }

    if (
      !mustContinueCapture
    ) {
      setSelected(null);
    }
  };

  const blackCount =
    countPieces(
      board,
      "black"
    );

  const redCount =
    countPieces(
      board,
      "red"
    );

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-300">
              TOGETRA · OYUN
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Dama
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Klasik dama tahtasında
              rakibine karşı oyna.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                resetGame
              }
              className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Yeni Oyun
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 text-sm font-bold text-white transition hover:opacity-90"
              >
                ← Geri
              </button>
            )}
          </div>
        </div>

        {/* SCORE / STATUS */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/30">
              Siyah
            </p>

            <p className="mt-1 text-2xl font-black">
              {blackCount}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.06] p-4">
            <p className="text-xs text-white/30">
              Durum
            </p>

            <p className="mt-1 text-sm font-bold text-purple-200">
              {winner
                ? "Oyun bitti"
                : currentPlayer ===
                  "black"
                  ? "Sıra siyah"
                  : "Sıra kırmızı"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/30">
              Kırmızı
            </p>

            <p className="mt-1 text-2xl font-black">
              {redCount}
            </p>
          </div>
        </div>

        {/* GAME AREA */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,720px)_300px]">
          {/* BOARD */}

          <section className="rounded-[28px] border border-white/10 bg-[#111018] p-3 sm:p-5">
            <div className="mx-auto w-full max-w-[660px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <div
                className="grid aspect-square grid-cols-8"
                style={{
                  background:
                    "#d6a15d",
                }}
              >
                {board.map(
                  (row, rowIndex) =>
                    row.map(
                      (
                        piece,
                        colIndex
                      ) => {
                        const dark =
                          (rowIndex +
                            colIndex) %
                            2 ===
                          1;

                        const selectedSquare =
                          selected?.row ===
                            rowIndex &&
                          selected?.col ===
                            colIndex;

                        const legalSquare =
                          legalMoves.some(
                            (move) =>
                              move.row ===
                                rowIndex &&
                              move.col ===
                                colIndex
                          );

                        return (
                          <button
                            key={`${rowIndex}-${colIndex}`}
                            type="button"
                            onClick={() =>
                              handleSquareClick(
                                rowIndex,
                                colIndex
                              )
                            }
                            className={`relative flex aspect-square items-center justify-center ${
                              dark
                                ? "bg-[#623f2d]"
                                : "bg-[#e7c38d]"
                            }`}
                          >
                            {selectedSquare && (
                              <span className="absolute inset-1 rounded-md border-2 border-purple-400" />
                            )}

                            {legalSquare && (
                              <span className="absolute h-4 w-4 rounded-full bg-purple-400/80 shadow-[0_0_16px_rgba(168,85,247,0.75)] sm:h-5 sm:w-5" />
                            )}

                            {piece && (
                              <span
                                className={`relative z-10 flex h-[68%] w-[68%] items-center justify-center rounded-full border-2 shadow-lg transition ${
                                  piece.player ===
                                  "black"
                                    ? "border-white/10 bg-gradient-to-br from-[#30333b] to-[#08090d]"
                                    : "border-white/10 bg-gradient-to-br from-[#ff708f] to-[#a91f4d]"
                                } ${
                                  selectedSquare
                                    ? "scale-110 ring-2 ring-purple-300/70"
                                    : ""
                                }`}
                              >
                                <span className="h-[58%] w-[58%] rounded-full bg-black/10" />

                                {piece.king && (
                                  <span className="absolute text-sm font-black text-yellow-200 sm:text-base">
                                    ♛
                                  </span>
                                )}
                              </span>
                            )}
                          </button>
                        );
                      }
                    )
                )}
              </div>
            </div>
          </section>

          {/* SIDE PANEL */}

          <aside className="rounded-[28px] border border-white/10 bg-[#111018] p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
              OYUN DURUMU
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {winner
                ? "Oyun tamamlandı"
                : "Hamleni yap"}
            </h2>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm leading-6 text-white/60">
                {message}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/30">
                Kurallar
              </p>

              <div className="mt-3 space-y-2 text-xs leading-5 text-white/45">
                <p>
                  • Kırmızı taşlar yukarı,
                  siyah taşlar aşağı
                  hareket eder.
                </p>

                <p>
                  • Rakibin taşının
                  üzerinden atlayarak
                  taş alabilirsin.
                </p>

                <p>
                  • Taşın son sıraya
                  ulaşırsa kral olur.
                </p>

                <p>
                  • Taş alma mümkünse
                  taş almak zorunludur.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                resetGame
              }
              className="mt-5 min-h-12 w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-bold text-white transition hover:opacity-90"
            >
              Yeni Oyun Başlat
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}