import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SopaLetrasProps {
  onComplete: () => void;
}

const WORDS_TO_FIND = [
  'ROSTRO',
  'IA',
  'AUDIO',
  'ENGAÑO',
  'DEEPFAKE',
  'VIDEO',
  'FILTRO',
];

// 10x10 Grid containing the words horizontally for intuitive, engaging gameplay
const GRID_DATA = [
  ['R', 'O', 'S', 'T', 'R', 'O', 'X', 'Y', 'P', 'Q'], // Row 0: ROSTRO
  ['I', 'A', 'K', 'M', 'W', 'E', 'R', 'T', 'U', 'I'], // Row 1: IA
  ['A', 'U', 'D', 'I', 'O', 'J', 'Y', 'Z', 'W', 'X'], // Row 2: AUDIO
  ['E', 'N', 'G', 'A', 'Ñ', 'O', 'V', 'B', 'C', 'D'], // Row 3: ENGAÑO
  ['P', 'L', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'], 
  ['D', 'E', 'E', 'P', 'F', 'A', 'K', 'E', 'R', 'T'], // Row 5: DEEPFAKE
  ['V', 'I', 'D', 'E', 'O', 'M', 'N', 'O', 'P', 'Q'], // Row 6: VIDEO
  ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'], 
  ['F', 'I', 'L', 'T', 'R', 'O', 'S', 'E', 'R', 'T'], // Row 8: FILTRO
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
];

export default function SopaLetras({ onComplete }: SopaLetrasProps) {
  // Found words
  const [foundWords, setFoundWords] = useState<string[]>([]);
  // Cells that are currently selected: array of "row-col" strings
  const [selectedCoordinates, setSelectedCoordinates] = useState<string[]>([]);
  // Cells that are permanently locked (green) because they belong to a found word
  const [lockedCells, setLockedCells] = useState<string[]>([]);

  // Coordinates of the word cells to help clear them or auto-highlight them nicely
  const getWordCoordinates = (word: string): string[] => {
    switch (word) {
      case 'ROSTRO':
        return ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5'];
      case 'IA':
        return ['1-0', '1-1'];
      case 'AUDIO':
        return ['2-0', '2-1', '2-2', '2-3', '2-4'];
      case 'ENGAÑO':
        return ['3-0', '3-1', '3-2', '3-3', '3-4', '3-5'];
      case 'DEEPFAKE':
        return ['5-0', '5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7'];
      case 'VIDEO':
        return ['6-0', '6-1', '6-2', '6-3', '6-4'];
      case 'FILTRO':
        return ['8-0', '8-1', '8-2', '8-3', '8-4', '8-5'];
      default:
        return [];
    }
  };

  const handleCellClick = (r: number, c: number) => {
    const coord = `${r}-${c}`;
    
    // If already locked, ignore
    if (lockedCells.includes(coord)) return;

    let newSelected = [...selectedCoordinates];
    if (newSelected.includes(coord)) {
      // Remove if already selected
      newSelected = newSelected.filter(x => x !== coord);
    } else {
      // Add to selection
      newSelected.push(coord);
    }
    setSelectedCoordinates(newSelected);

    // Build the string based on selection order
    const selectedLetters = newSelected.map(co => {
      const [row, col] = co.split('-').map(Number);
      return GRID_DATA[row][col];
    });
    const currentWordStr = selectedLetters.join('');
    const reversedWordStr = [...selectedLetters].reverse().join('');

    // Check if it matches any unfound word
    const matchedWord = WORDS_TO_FIND.find(
      word => (word === currentWordStr || word === reversedWordStr) && !foundWords.includes(word)
    );

    if (matchedWord) {
      // We found a word!
      const wordCoords = getWordCoordinates(matchedWord);
      setFoundWords(prev => [...prev, matchedWord]);
      setLockedCells(prev => [...prev, ...wordCoords]);
      setSelectedCoordinates([]); // Clear current selection
    }
  };

  const handleClearSelection = () => {
    setSelectedCoordinates([]);
  };

  const isAllFound = foundWords.length === WORDS_TO_FIND.length;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-stretch">
      {/* Grid on the left */}
      <div className="flex-1 bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-serif text-white tracking-widest uppercase mb-1">
          Sopa de Letras
        </h3>
        <p className="text-sm italic text-gray-300 font-serif mb-6 text-center max-w-md">
          Busca conceptos básicos haciendo clic sobre las letras de cada palabra.
        </p>

        {/* Current selection display */}
        <div className="mb-4 h-8 flex items-center justify-between w-full max-w-sm px-4 bg-slate-850 border border-white/5 rounded">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-sans">Selección:</span>
          <span className="text-lg font-serif font-bold text-white tracking-widest">
            {selectedCoordinates.map(co => {
              const [r, c] = co.split('-').map(Number);
              return GRID_DATA[r][c];
            }).join(' ')}
          </span>
          {selectedCoordinates.length > 0 && (
            <button 
              onClick={handleClearSelection}
              className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
            >
              Borrar
            </button>
          )}
        </div>

        {/* The 10x10 Grid */}
        <div className="grid grid-cols-10 gap-1 md:gap-2 mb-6 max-w-md w-full">
          {GRID_DATA.map((row, rIdx) =>
            row.map((letter, cIdx) => {
              const coord = `${rIdx}-${cIdx}`;
              const isLocked = lockedCells.includes(coord);
              const isSelected = selectedCoordinates.includes(coord);

              let cellBg = "bg-white/5 text-gray-200 border-white/5 hover:bg-white/10";
              if (isLocked) {
                cellBg = "bg-[#2e7d32]/80 text-white border-[#2e7d32] shadow-lg shadow-green-900/30 font-bold";
              } else if (isSelected) {
                cellBg = "bg-white/30 text-white border-white/40 font-semibold text-glow";
              }

              return (
                <button
                  key={coord}
                  id={`sopa-cell-${coord}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={`aspect-square w-full flex items-center justify-center border text-sm md:text-lg font-serif rounded transition-all cursor-pointer ${cellBg}`}
                >
                  {letter}
                </button>
              );
            })
          )}
        </div>

        <p className="text-xs text-gray-400 text-center font-serif">
          Encuentra las 7 palabras ocultas para avanzar al siguiente nivel.
        </p>
      </div>

      {/* Target Word checklist on the right */}
      <div className="w-full lg:w-80 bg-slate-900/40 border border-white/10 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <h4 className="text-md font-serif text-white tracking-wider uppercase border-b border-white/10 pb-2 mb-4">
            Conceptos a Encontrar:
          </h4>
          <ul className="space-y-3">
            {WORDS_TO_FIND.map(word => {
              const isFound = foundWords.includes(word);
              return (
                <li
                  key={word}
                  className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                    isFound ? 'bg-green-950/40 text-green-300 border border-green-900/50' : 'text-gray-300'
                  }`}
                >
                  <span className={`font-serif tracking-widest text-sm md:text-base ${isFound ? 'line-through opacity-75' : 'font-bold'}`}>
                    {word}
                  </span>
                  {isFound ? (
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Completion action */}
        <div className="mt-8">
          {isAllFound ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onComplete}
              id="sopa-next-btn"
              className="w-full bg-white text-slate-950 font-serif font-bold tracking-widest py-3 px-6 rounded hover:bg-opacity-90 active:scale-95 transition-all text-center uppercase cursor-pointer text-sm shadow-xl"
            >
              Siguiente Nivel →
            </motion.button>
          ) : (
            <div className="w-full py-3 text-center border border-dashed border-white/10 rounded text-xs italic text-gray-500 font-serif">
              Encuentra todas las palabras...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
