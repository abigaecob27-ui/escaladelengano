import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { ActiveView, GameSubState } from './types';

// Import our modular custom components
import SopaLetras from './components/SopaLetras';
import Rompecabezas from './components/Rompecabezas';
import DetectaDeepfake from './components/DetectaDeepfake';
import Laberinto from './components/Laberinto';
import ConoceMas from './components/ConoceMas';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('cover');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Game states
  const [gameSubState, setGameSubState] = useState<GameSubState | null>(null);
  const [transitionLevel, setTransitionLevel] = useState<number>(1);
  const [introStep, setIntroStep] = useState<number>(0);

  // Handle Level transitions with elegant 1.8s black screen fades
  const startLevelTransition = (level: number, targetState: GameSubState) => {
    setGameSubState('transition');
    setTransitionLevel(level);
    const timer = setTimeout(() => {
      setGameSubState(targetState);
    }, 1800);
    return () => clearTimeout(timer);
  };

  // Triggered when user selects "Juego" from the menu
  const handleStartGameFlow = () => {
    setIsMenuOpen(false);
    setActiveView('juego');
    setGameSubState('intro');
    setIntroStep(0);

    // ¿estás listo?
    const timer1 = setTimeout(() => {
      setIntroStep(1); // shows "averiguemos de qué estás hecho"
    }, 1500);

    // Fade to level 1 transition after 3.5s total
    const timer2 = setTimeout(() => {
      startLevelTransition(1, 'difficulty_1');
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  return (
    <div className="min-h-screen bg-grid-pattern relative flex flex-col justify-between text-white font-serif select-none overflow-x-hidden">
      
      {/* Header Menu Trigger (top right) - Persistent across views except intro/transitions */}
      {gameSubState !== 'intro' && gameSubState !== 'transition' && (
        <header className="absolute top-6 right-6 z-40">
          <button
            id="global-menu-trigger"
            onClick={() => setIsMenuOpen(true)}
            className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-2"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-sans hidden sm:inline pr-1">Menú</span>
          </button>
        </header>
      )}

      {/* Main Screen Router */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          
          {/* 1. COVER SCREEN (Inicio) */}
          {activeView === 'cover' && (
            <motion.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl text-center flex flex-col items-center justify-center py-12"
            >
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-gray-300 opacity-95 mb-4 block">
                Página Informativa
              </span>
              
              {/* Giant Title acting as a hyperlink/trigger to Menu */}
              <button
                id="main-title-button"
                onClick={() => setIsMenuOpen(true)}
                className="group relative cursor-pointer block focus:outline-none py-4"
              >
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white tracking-widest uppercase transition-all duration-500 text-glow group-hover:scale-105">
                  Escala del Engaño
                </h1>
                
                {/* Visual hover hint under title */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/50 transition-all duration-500 group-hover:w-1/2" />
              </button>

              <h2 className="text-md sm:text-xl md:text-2xl italic font-serif text-gray-200 mt-4 tracking-wider max-w-xl text-center">
                "La inteligencia artificial confundida con la realidad"
              </h2>

              <div className="mt-12">
                <button
                  id="cover-enter-button"
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/15 px-6 py-3 rounded-full text-sm uppercase tracking-widest font-sans transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Explorar Menú <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. CONOCE MÁS SECTION */}
          {activeView === 'conoce_mas' && (
            <motion.div
              key="conoce_mas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <ConoceMas onBack={() => setActiveView('cover')} />
            </motion.div>
          )}

          {/* 3. GAME CONTAINER (Juego) */}
          {activeView === 'juego' && (
            <motion.div
              key="juego-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center min-h-[70vh]"
            >
              
              {/* Level Intro Sequence */}
              {gameSubState === 'intro' && (
                <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-6 text-center select-none">
                  <div className="space-y-6">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-3xl md:text-5xl font-serif tracking-widest text-white uppercase text-glow"
                    >
                      ¿ESTÁS LISTO?
                    </motion.h2>

                    {introStep >= 1 && (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-lg md:text-2xl font-serif italic text-gray-300 tracking-wider"
                      >
                        averiguemos de qué estás hecho
                      </motion.p>
                    )}
                  </div>
                </div>
              )}

              {/* Full-screen black level transitions */}
              {gameSubState === 'transition' && (
                <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1, 1, 0.95] }}
                    transition={{ duration: 1.8, times: [0, 0.25, 0.75, 1] }}
                    className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest uppercase text-glow"
                  >
                    Nivel {transitionLevel}
                  </motion.div>
                </div>
              )}

              {/* LEVEL 1: Sopa de letras */}
              {gameSubState === 'difficulty_1' && (
                <div className="w-full">
                  <SopaLetras onComplete={() => startLevelTransition(2, 'difficulty_2')} />
                </div>
              )}

              {/* LEVEL 2: Rompecabezas facial */}
              {gameSubState === 'difficulty_2' && (
                <div className="w-full">
                  <Rompecabezas onComplete={() => startLevelTransition(3, 'difficulty_3')} />
                </div>
              )}

              {/* LEVEL 3: Detecta el deepfake */}
              {gameSubState === 'difficulty_3' && (
                <div className="w-full">
                  <DetectaDeepfake onComplete={() => startLevelTransition(4, 'difficulty_4')} />
                </div>
              )}

              {/* LEVEL 4: El laberinto del algoritmo */}
              {gameSubState === 'difficulty_4' && (
                <div className="w-full">
                  <Laberinto onComplete={() => setGameSubState('reflection')} />
                </div>
              )}

              {/* GAME REFLECTION: End of game */}
              {gameSubState === 'reflection' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-3xl mx-auto bg-slate-900/60 border border-white/10 backdrop-blur-md p-8 md:p-12 rounded-lg text-center shadow-2xl"
                >
                  <span className="text-xs text-green-400 font-sans uppercase tracking-[0.2em] font-bold block mb-2">
                    Reflexión Compartida
                  </span>
                  
                  <h3 className="text-2xl md:text-4xl font-serif text-white tracking-widest uppercase mb-6 text-glow">
                    Cuestionar para Comprender
                  </h3>

                  <div className="h-[1px] w-20 bg-white/25 mx-auto mb-8" />

                  <p className="text-md md:text-xl italic text-gray-200 font-serif leading-relaxed text-justify mb-10 bg-slate-950/40 p-6 rounded border border-white/5 shadow-inner">
                    "Has completado la Escala del Engaño. La tecnología evoluciona a un ritmo sin precedentes; lo que vemos y oímos ya no es prueba inequívoca de la realidad. Tu escudo digital no es un software externo, sino tu pensamiento crítico, tu legítima duda y tu sensatez antes de compartir."
                  </p>

                  <button
                    id="finish-game-btn"
                    onClick={() => {
                      setActiveView('cover');
                      setGameSubState(null);
                    }}
                    className="inline-flex items-center gap-2 bg-white text-slate-950 font-serif font-bold tracking-widest py-3 px-8 rounded hover:bg-opacity-90 active:scale-95 transition-all uppercase text-sm shadow-xl cursor-pointer"
                  >
                    Seguir explorando
                  </button>
                </motion.div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Branding - Consistent on Cover and Reading Views */}
      {gameSubState !== 'intro' && gameSubState !== 'transition' && (
        <footer className="py-6 px-8 text-center sm:text-right border-t border-white/5 bg-slate-950/10 backdrop-blur-sm">
          <span className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase font-mono">
            TIMES NEW ROMAN font • © 2026 ESCALA DEL ENGAÑO
          </span>
        </footer>
      )}

      {/* 4. INTERACTIVE FULL-BLEED OVERLAY MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1e2c63] bg-grid-pattern z-50 flex flex-col justify-center items-center p-6 select-none"
          >
            {/* Close Button top-right */}
            <button
              id="close-menu-button"
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Menu Options List */}
            <nav className="flex flex-col items-center gap-6 md:gap-8">
              
              {/* Option 1: Inicio */}
              <button
                id="menu-opt-inicio"
                onClick={() => {
                  setActiveView('cover');
                  setGameSubState(null);
                  setIsMenuOpen(false);
                }}
                className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-widest uppercase cursor-pointer transition-all duration-300 menu-hover-glow"
              >
                Inicio
              </button>

              {/* Option 2: Juego */}
              <button
                id="menu-opt-juego"
                onClick={handleStartGameFlow}
                className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-widest uppercase cursor-pointer transition-all duration-300 menu-hover-glow flex items-center gap-2 justify-center"
              >
                Juego <Sparkles className="w-5 h-5 opacity-70" />
              </button>

              {/* Option 3: Conoce más */}
              <button
                id="menu-opt-conoce"
                onClick={() => {
                  setActiveView('conoce_mas');
                  setIsMenuOpen(false);
                }}
                className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-widest uppercase cursor-pointer transition-all duration-300 menu-hover-glow flex items-center gap-2 justify-center"
              >
                Conoce más <BookOpen className="w-5 h-5 opacity-70" />
              </button>

              {/* Option 4: Referencias (External Document link) */}
              <a
                id="menu-opt-referencias"
                href="https://docs.google.com/document/d/12CdTBpo_t9fBsvVP5ppEwjYmrcCTybYbYUCI5PDNFYI/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-widest uppercase transition-all duration-300 menu-hover-glow flex items-center gap-2 justify-center cursor-pointer"
              >
                Referencias <HelpCircle className="w-5 h-5 opacity-70" />
              </a>

              {/* Option 5: Contenido bonus (Canva link) */}
              <a
                id="menu-opt-bonus"
                href="https://canva.link/crnqog7v7292muz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl sm:text-4xl md:text-5xl font-serif text-white/95 tracking-widest uppercase transition-all duration-300 menu-hover-glow flex items-center gap-2 justify-center cursor-pointer"
              >
                Contenido bonus
              </a>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
