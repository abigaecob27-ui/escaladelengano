import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface LaberintoProps {
  onComplete: () => void;
}

// 7x7 Solvable Maze Grid
// 0 = Walkable Path, 1 = Wall/Blocker
const MAZE_GRID = [
  [0, 1, 0, 0, 0, 0, 0], // Row 0
  [0, 1, 0, 1, 1, 1, 0], // Row 1
  [0, 0, 0, 1, 0, 0, 0], // Row 2
  [1, 1, 0, 1, 0, 1, 1], // Row 3
  [0, 0, 0, 0, 0, 1, 0], // Row 4
  [0, 1, 1, 1, 0, 1, 0], // Row 5
  [0, 0, 0, 1, 0, 0, 0], // Row 6
];

const GRID_SIZE = 7;

export default function Laberinto({ onComplete }: LaberintoProps) {
  // Player current coordinates: { r, c }
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [hasWon, setHasWon] = useState(false);

  // Move function with boundary & wall checks
  const movePlayer = (dr: number, dc: number) => {
    if (hasWon) return;

    setPlayerPos(prev => {
      const newR = prev.r + dr;
      const newC = prev.c + dc;

      // Check boundaries
      if (newR >= 0 && newR < GRID_SIZE && newC >= 0 && newC < GRID_SIZE) {
        // Check walls
        if (MAZE_GRID[newR][newC] === 0) {
          // Check win condition (bottom right cell)
          if (newR === GRID_SIZE - 1 && newC === GRID_SIZE - 1) {
            setHasWon(true);
          }
          return { r: newR, c: newC };
        }
      }
      return prev; // Stay in place if invalid
    });
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasWon) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(1, 0);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasWon]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-stretch">
      {/* Grid on the left */}
      <div className="flex-1 bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-serif text-white tracking-widest uppercase mb-1">
          El Laberinto del Algoritmo
        </h3>
        <p className="text-sm italic text-gray-300 font-serif mb-6 text-center max-w-md">
          Navega desde INICIO (arriba izquierda) hasta SALIDA (abajo derecha).
        </p>

        {/* Maze Area */}
        <div className="relative border border-white/20 p-2 bg-slate-950 rounded-md shadow-xl max-w-[340px] w-full aspect-square flex flex-col justify-between">
          <div className="grid grid-cols-7 gap-1 flex-1">
            {MAZE_GRID.map((row, rIdx) =>
              row.map((cellType, cIdx) => {
                const isPlayer = playerPos.r === rIdx && playerPos.c === cIdx;
                const isStart = rIdx === 0 && cIdx === 0;
                const isEnd = rIdx === GRID_SIZE - 1 && cIdx === GRID_SIZE - 1;

                // Blocker vs open space styling
                let cellStyle = "bg-slate-900/40 border border-white/5";
                if (cellType === 1) {
                  // White/glowing wall blockers
                  cellStyle = "bg-white/90 shadow-sm border-white";
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`relative rounded-sm flex items-center justify-center text-[8px] font-mono select-none ${cellStyle}`}
                  >
                    {/* Player Block */}
                    {isPlayer && (
                      <motion.div
                        layoutId="mazePlayer"
                        className="absolute inset-1 bg-sky-400 rounded-sm shadow-md shadow-sky-500/50 flex items-center justify-center font-serif text-white font-bold"
                      />
                    )}

                    {/* Start label */}
                    {isStart && !isPlayer && (
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400 font-bold tracking-tighter uppercase">
                        Inicio
                      </span>
                    )}

                    {/* Exit label */}
                    {isEnd && !isPlayer && (
                      <span className="absolute inset-0 bg-green-500/20 flex items-center justify-center text-[8px] text-green-300 font-bold tracking-tighter uppercase">
                        Salida
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Controls & Deciphered information on the right */}
      <div className="w-full lg:w-80 bg-slate-900/40 border border-white/10 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <h4 className="text-md font-serif text-white tracking-wider uppercase border-b border-white/10 pb-2 mb-4">
            Controles / Información:
          </h4>

          {/* Touch arrow buttons */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <button
              onClick={() => movePlayer(-1, 0)}
              className="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => movePlayer(0, -1)}
                className="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                className="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={() => movePlayer(1, 0)}
              className="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 font-serif text-center mb-6">
            USA LOS BOTONES O LAS FLECHAS DE TU TECLADO.
          </p>
        </div>

        {/* Algorithm solved explanation / action */}
        <div className="space-y-4">
          {hasWon ? (
            <div className="space-y-4">
              <div className="bg-green-950/40 border border-green-700/50 p-4 rounded text-green-100 font-serif text-sm text-justify leading-relaxed">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-2 text-green-300">
                  <Check className="w-4 h-4 stroke-[3]" /> Algoritmo descifrado.
                </span>
                La tecnología generativa descompone miles de imágenes y audios para reconstruir sintéticamente rostros y voces con modelos GAN. El engaño se disipa en los detalles ínfimos que tú logras examinar.
              </div>

              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onComplete}
                id="maze-finish-btn"
                className="w-full bg-white text-slate-950 font-serif font-bold tracking-widest py-3 px-6 rounded hover:bg-opacity-90 active:scale-95 transition-all text-center uppercase cursor-pointer text-sm shadow-xl"
              >
                Finalizar Dinámicas →
              </motion.button>
            </div>
          ) : (
            <div className="w-full py-4 text-center border border-dashed border-white/10 rounded text-xs italic text-gray-500 font-serif">
              Guía el bloque azul hasta la salida...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
