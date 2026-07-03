import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, AlertTriangle } from 'lucide-react';

interface DetectaDeepfakeProps {
  onComplete: () => void;
}

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  isDeepfake: boolean;
  explanation: string;
}

const CASES: CaseStudy[] = [
  {
    id: 1,
    title: 'El Video Político',
    description: '“Observas un video de un líder de opinión dando un comunicado urgente. Al pasar en primer plano, notas que las patillas de sus anteojos se fusionan de forma asimétrica con su piel y sus lóbulos cambian de forma al girar la cabeza.”',
    isDeepfake: true,
    explanation: 'Los detalles mímicos como anteojos, pendientes, texturas de piel asimétricas o parpadeos poco naturales son el talón de Aquiles de los algoritmos de IA generativa.',
  },
  {
    id: 2,
    title: 'El Mensaje de Emergencia',
    description: '“Recibes un mensaje de voz de tu madre pidiéndote una transferencia bancaria urgente por un percance imprevisto. El timbre de voz es exacto, pero no usa sus pausas naturales ni sus palabras cotidianas, sonando extrañamente lineal.”',
    isDeepfake: true,
    explanation: 'La clonación de voz por IA imita el tono perfectamente pero falla en capturar la prosodia, los modismos personales y los matices emocionales humanos.',
  },
  {
    id: 3,
    title: 'Retrato de Estudio',
    description: '“Se publica el retrato oficial de un fotógrafo. Al analizarlo con detenimiento, las sombras proyectadas en el cuello coinciden con los focos, los reflejos en las córneas son simétricos y detallados, y ambas manos lucen dedos perfectos.”',
    isDeepfake: false,
    explanation: 'La física coherente de la luz y la representación anatómicamente perfecta de los dedos y reflejos oculares denotan un registro real libre de distorsiones de síntesis.',
  },
];

export default function DetectaDeepfake({ onComplete }: DetectaDeepfakeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const activeCase = CASES[currentIdx];

  const handleChoice = (choice: boolean) => {
    setSelectedAnswer(choice);
    if (choice === activeCase.isDeepfake) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    if (currentIdx < CASES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  const retryCase = () => {
    setSelectedAnswer(null);
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 md:p-8 rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-sans">Dificultad 3</span>
        <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase mt-1 mb-2 text-glow">
          Detecta el Deepfake
        </h3>
        <p className="text-sm md:text-base italic text-gray-300 font-serif max-w-xl mx-auto">
          Aplica tu pensamiento crítico analizando las siguientes anomalías digitales.
        </p>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-between items-center max-w-md mx-auto mb-6 border-b border-white/5 pb-4">
        <span className="text-xs text-gray-400 font-sans uppercase tracking-wider">
          Escenario {activeCase.id} de 3
        </span>
        <div className="flex gap-2">
          {CASES.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? 'bg-white scale-125 shadow-md shadow-white/30'
                  : i < currentIdx
                  ? 'bg-green-500'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Case content card */}
      <div className="bg-slate-950/40 border border-white/5 rounded-lg p-6 md:p-8 mb-6">
        <h4 className="text-lg md:text-xl font-serif text-white tracking-wider mb-4 border-l-2 border-white/30 pl-3">
          Caso {activeCase.id}: {activeCase.title}
        </h4>
        
        <p className="text-md md:text-lg italic text-gray-200 font-serif leading-relaxed text-justify bg-slate-950/60 p-4 rounded border border-white/5 mb-8">
          {activeCase.description}
        </p>

        {/* Choice buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id={`choice-real-${activeCase.id}`}
            disabled={feedback === 'correct'}
            onClick={() => handleChoice(false)}
            className={`w-full sm:w-48 py-3.5 px-6 border rounded font-serif tracking-widest uppercase text-sm cursor-pointer transition-all ${
              selectedAnswer === false
                ? feedback === 'correct'
                  ? 'bg-[#2e7d32]/80 text-white border-[#2e7d32]'
                  : 'bg-red-950/80 text-red-200 border-red-500'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            Real
          </button>

          <button
            id={`choice-deepfake-${activeCase.id}`}
            disabled={feedback === 'correct'}
            onClick={() => handleChoice(true)}
            className={`w-full sm:w-48 py-3.5 px-6 border rounded font-serif tracking-widest uppercase text-sm cursor-pointer transition-all ${
              selectedAnswer === true
                ? feedback === 'correct'
                  ? 'bg-[#2e7d32]/80 text-white border-[#2e7d32]'
                  : 'bg-red-950/80 text-red-200 border-red-500'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            Deepfake
          </button>
        </div>
      </div>

      {/* Feedback area */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-6 rounded-lg border flex flex-col md:flex-row items-start gap-4 ${
              feedback === 'correct'
                ? 'bg-green-950/60 border-green-700/60 text-green-100'
                : 'bg-red-950/60 border-red-800/60 text-red-100'
            }`}
          >
            <div className="mt-1 flex-shrink-0">
              {feedback === 'correct' ? (
                <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-slate-950">
                  <Check className="w-5 h-5 stroke-[3]" />
                </span>
              ) : (
                <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-slate-950 animate-pulse">
                  <X className="w-5 h-5 stroke-[3]" />
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <h5 className="font-serif font-bold text-base md:text-lg tracking-wider">
                {feedback === 'correct' ? '✓ CORRECTO. ¿POR QUÉ?' : '✗ INCORRECTO'}
              </h5>
              <p className="text-sm md:text-base font-serif leading-relaxed text-justify">
                {feedback === 'correct'
                  ? activeCase.explanation
                  : 'Vuelve a analizar los indicios planteados en el texto. Presta atención a las incongruencias anatómicas o comportamientos poco naturales descritos.'}
              </p>

              <div className="pt-2">
                {feedback === 'correct' ? (
                  <button
                    id="scenario-next-btn"
                    onClick={handleNext}
                    className="bg-white text-slate-950 font-serif font-bold tracking-widest text-xs py-2 px-5 rounded hover:bg-opacity-90 active:scale-95 transition-all uppercase cursor-pointer shadow-lg"
                  >
                    {currentIdx < CASES.length - 1 ? 'Siguiente Caso →' : 'Continuar al Nivel 4 →'}
                  </button>
                ) : (
                  <button
                    onClick={retryCase}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-serif tracking-widest text-xs py-2 px-5 rounded transition-all uppercase cursor-pointer"
                  >
                    Intentar de nuevo
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
