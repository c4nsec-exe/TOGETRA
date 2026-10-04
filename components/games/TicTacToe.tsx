"use client";

import { useEffect } from "react";

type Player = "X" | "O" | null;
const BOARD_SIZE = 5;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

interface TicTacToeProps {
  roomId: string;
  connection: any;
  gameState: any;
  partnerConnectionId: string;
  currentUsername: string;
  partnerName: string;
  makeMove: (cellIndex: number) => void;
  onClose: () => void;
}

export default function TicTacToe({ 
  roomId, 
  connection, 
  gameState, 
  makeMove, 
  partnerConnectionId, 
  currentUsername, 
  partnerName, 
  onClose 
}: TicTacToeProps) {
  
  useEffect(() => {
    if (connection && connection.state === "Connected" && partnerConnectionId) {
      if (!gameState) {
        connection.invoke("StartGame", roomId, partnerConnectionId).catch(console.error);
      }
    }
  }, [connection, roomId, partnerConnectionId, gameState]);

  const isMyTurn = connection?.connectionId && gameState?.currentTurn === connection.connectionId;
  const mySymbol = connection?.connectionId === gameState?.playerX ? "X" : "O";

  const rawBoard = gameState?.board || [];
  const board: Player[] = Array.from({ length: TOTAL_CELLS }, (_, i) => rawBoard[i] || null);

  const winner = gameState?.winner;
  const isGameOver = gameState?.isGameOver;

  // Kazananın Kimliğini Belirleme
  const isWinnerMe = winner === mySymbol;
  const winnerName = isWinnerMe ? currentUsername : partnerName;
  const winnerInitial = winnerName ? winnerName.charAt(0).toUpperCase() : "?";

const newGame = () => {
    if (connection && partnerConnectionId) {
      // DÜZELTME 2: Silinen oyunu sıfırlamak yerine yeni oyun başlatıyoruz
      connection.invoke("StartGame", roomId, partnerConnectionId).catch(console.error);
    }
  };

  const gameStatus = winner
    ? "OYUN BİTTİ"
    : isGameOver
    ? "BERABERE"
    : isMyTurn 
      ? `Sıra Sende (${mySymbol})` 
      : (gameState ? "Sıra Rakipte" : "Oyun başlatılıyor...");

  return (
    <section className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] p-4 sm:p-6 mb-5 relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h2 className="text-xl font-bold">Dört Sıra (XOX)</h2>
          <p className="text-purple-400 font-semibold text-xs mt-1 uppercase tracking-widest animate-pulse">
            {gameStatus}
          </p>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition">
          Oyunu Kapat
        </button>
      </div>

      <div className="w-full max-w-[400px] mx-auto relative">
        
        {/* OYUN TAHTASI */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 aspect-square min-h-[300px] w-full bg-black/20 rounded-2xl p-2 border border-white/5 shadow-inner">
          {board.map((cell, index) => (
            <button
              key={index}
              type="button"
              onClick={() => makeMove(index)}
              disabled={cell !== null || !isMyTurn || isGameOver}
              className={`w-full h-full aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-2xl sm:text-4xl font-black transition-all duration-300
                ${cell === null ? 'bg-white/5 hover:bg-white/10 border border-white/10' : ''}
                ${cell === 'X' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : ''}
                ${cell === 'O' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]' : ''}
                ${!isMyTurn && cell === null && !isGameOver ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* =========================
            OYUN SONU (KUTLAMA) EKRANI
        ========================= */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#08070d]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-all duration-500">
            {winner ? (
              <div className="flex flex-col items-center animate-bounce">
                {/* Kazanan Avatarı (Parlayan Efekt) */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-600 p-1 shadow-[0_0_40px_rgba(250,204,21,0.4)]">
                  <div className="w-full h-full rounded-full bg-[#15141a] flex items-center justify-center text-4xl sm:text-5xl font-black text-yellow-400">
                    {winnerInitial}
                  </div>
                  {/* Taç İkonu */}
                  <div className="absolute -top-4 -right-2 text-3xl">👑</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-lg text-center">
                  TEBRİKLER!
                </h3>
                <p className="text-white mt-2 text-base sm:text-lg font-medium text-center">
                  <span className="font-bold text-yellow-400">{winnerName}</span> kazandı
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full bg-gradient-to-tr from-gray-500 to-gray-700 p-1">
                  <div className="w-full h-full rounded-full bg-[#15141a] flex items-center justify-center text-4xl sm:text-5xl font-black text-gray-300">
                    🤝
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-300 text-center">BERABERE!</h3>
                <p className="text-white/50 mt-2 text-sm sm:text-base text-center">İkiniz de çok iyiydiniz.</p>
              </div>
            )}

            <button 
              type="button" 
              onClick={newGame} 
              className="mt-6 sm:mt-8 min-h-11 px-8 rounded-full bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              🔄 Rövanş Yap
            </button>
          </div>
        )}

      </div>
    </section>
  );
}