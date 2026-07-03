import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface RompecabezasProps {
  onComplete: () => void;
}

interface Tile {
  id: number;          // Unique ID
  correctIndex: number; // The correct 0-8 position
}

const IMAGE_PATH = '/src/assets/images/puzzle_image.jpg';

export default function Rompecabezas({ onComplete }: RompecabezasProps) {
  // Current order of tiles: an array of Tile objects
  const [tiles, setTiles] = useState<Tile[]>([]);
  // Index of the first selected tile for swapping (-1 if none selected)
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [hasWon, setHasWon] = useState(false);

  // Initialize and shuffle tiles
  const initializePuzzle = () => {
    // Create correct pieces
    const initialTiles: Tile[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      correctIndex: i,
    }));

    // Shuffle them securely (guaranteeing that it is not in the correct order initially)
    let shuffled: Tile[] = [...initialTiles];
    let isSolved = true;
    while (isSolved) {
      shuffled = [...initialTiles].sort(() => Math.random() - 0.5);
      // Check if it happens to be solved already
      isSolved = shuffled.every((tile, index) => tile.correctIndex === index);
    }

    setTiles(shuffled);
    setSelectedIdx(-1);
    setHasWon(false);
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  const handleTileClick = (index: number) => {
    if (hasWon) return;

    if (selectedIdx === -1) {
      // First selection
      setSelectedIdx(index);
    } else {
      // Second selection, perform swap!
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIdx(-1);

      // Check if solved
      const solved = newTiles.every((tile, idx) => tile.correctIndex === idx);
      if (solved) {
        setHasWon(true);
      }
    }
  };

  // Coordinates for 3x3 background slicing
  const getBgPosition = (correctIndex: number) => {
    const col = correctIndex % 3;
    const row = Math.floor(correctIndex / 3);
    // Background positions: col * 50%, row * 50%
    return `${col * 50}% ${row * 50}%`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-stretch">
      {/* Grid on the left */}
      <div className="flex-1 bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center justify-between">
        <div className="w-full text-center">
          <h3 className="text-xl md:text-2xl font-serif text-white tracking-widest uppercase mb-1">
            Rompecabezas Facial
          </h3>
          <p className="text-sm italic text-gray-300 font-serif mb-6 max-w-md mx-auto">
            La IA altera rasgos y caras. Intercambia las piezas haciendo clic para reconstruir el rostro simétrico.
          </p>
        </div>

        {/* 3x3 Puzzle board */}
        <div className="grid grid-cols-3 gap-1.5 w-full max-w-[360px] aspect-square bg-slate-950 p-2 border border-white/10 rounded-md relative overflow-hidden mb-6">
          {tiles.map((tile, index) => {
            const isCorrect = tile.correctIndex === index;
            const isSelected = selectedIdx === index;
            const bgPos = getBgPosition(tile.correctIndex);

            return (
              <button
                key={tile.id}
                id={`puzzle-tile-${index}`}
                onClick={() => handleTileClick(index)}
                className={`relative aspect-square w-full border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isSelected ? 'border-white scale-[0.97] ring-4 ring-white/30 z-10' : 'border-white/10'
                }`}
                style={{
                  backgroundImage: `url(${IMAGE_PATH})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: bgPos,
                }}
              >
                {/* Tile indicator (P1, P2...) as seen in video */}
                <div className="absolute top-1 left-1.5 bg-black/70 text-[10px] text-gray-300 font-mono px-1 rounded border border-white/5">
                  P{tile.correctIndex + 1}
                </div>

                {/* Correct piece indicator (Green Check) */}
                {isCorrect && (
                  <div className="absolute top-1 right-1.5 bg-green-500/90 text-slate-950 p-0.5 rounded-full shadow-lg">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={initializePuzzle}
            id="puzzle-mix-btn"
            className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 px-4 py-2 rounded font-serif tracking-widest uppercase cursor-pointer"
          >
            Mezclar otra vez
          </button>
        </div>
      </div>

      {/* Alignment Guide on the right */}
      <div className="w-full lg:w-80 bg-slate-900/40 border border-white/10 p-6 rounded-lg flex flex-col justify-between items-center text-center">
        <div className="w-full">
          <h4 className="text-md font-serif text-white tracking-wider uppercase border-b border-white/10 pb-2 mb-4">
            Guía de Alineación:
          </h4>
          <div className="w-40 h-40 border border-white/20 rounded mx-auto mb-4 overflow-hidden shadow-lg relative">
            <img
              src={IMAGE_PATH}
              alt="Objetivo de alineación"
              className="w-full h-full object-cover filter brightness-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
          </div>
          <p className="text-xs text-gray-400 font-serif mb-6 leading-relaxed">
            HAZ CLIC EN UNA PIEZA, LUEGO EN OTRA PARA INTERCAMBIARLAS DE LUGAR.
          </p>
          <div className="text-xs text-gray-300 italic font-serif space-y-1.5">
            <div>ALINEA TODOS LOS BLOQUES</div>
            <div>PARA REVELAR EL</div>
            <div>PROCESAMIENTO SIMÉTRICO.</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-8">
          {hasWon ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onComplete}
              id="puzzle-next-btn"
              className="w-full bg-white text-slate-950 font-serif font-bold tracking-widest py-3 px-6 rounded hover:bg-opacity-90 active:scale-95 transition-all text-center uppercase cursor-pointer text-sm shadow-xl"
            >
              Siguiente Nivel →
            </motion.button>
          ) : (
            <div className="w-full py-3 text-center border border-dashed border-white/10 rounded text-xs italic text-gray-500 font-serif">
              Ordena la estructura facial...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
