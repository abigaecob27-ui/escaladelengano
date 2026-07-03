import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

interface ConoceMasProps {
  onBack: () => void;
}

export default function ConoceMas({ onBack }: ConoceMasProps) {
  return (
    <div className="max-w-4xl mx-auto bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 md:p-10 rounded-lg">
      <div className="text-center mb-8">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-sans">Sección Académica</span>
        <h3 className="text-2xl md:text-4xl font-serif text-white tracking-widest uppercase mt-1 mb-4 text-glow">
          Conoce Más
        </h3>
        <div className="h-[1px] w-24 bg-white/20 mx-auto" />
      </div>

      <div className="space-y-6 text-gray-200 font-serif text-base md:text-lg leading-relaxed text-justify max-w-3xl mx-auto">
        <p>
          Proyecto creado únicamente con fines académicos, tomando referencias acerca de “Los elementos del lenguaje audiovisual presentes en los deepfakes en crítica política en redes sociales desde enero del 2024 hasta 2026.
        </p>

        <p>
          De acuerdo con UNESCO IITE, la alfabetización mediática e informacional integra
          conocimientos, habilidades, actitudes y prácticas que permiten acceder, interpretar, evaluar
          críticamente, producir y difundir información de manera ética y responsable. En el contexto de
          la inteligencia artificial, estas competencias adquieren mayor relevancia porque ayudan a
          comprender cómo se generan los contenidos digitales, identificar posibles manipulaciones y
          utilizar las herramientas tecnológicas de forma consciente, fortaleciendo así la participación
          informada dentro de los entornos digitales contemporáneos.
        </p>

        <p>
          Cosa que en este proyecto se trata de recalcar la pregunta de investigación, ¿cómo poder distinguir estos elementos? ¿Tenemos que ser alfabetizados mediáticamente para poder hacerlo?
        </p>

        <p>
          El propósito de este proyecto, no solo como medio de entretenimiento, sino como medio de aprendizaje para poder afrontar las nuevas competencias mediáticas en el mundo digital que cada vez, vamos adquiriendo menos o restándole la importancia necesaria, ya que somos seres tecnológicos y conocer estas diferencias, según el segundo entrevistado, puede llegar a que las personas puedan razonar y analizar las situaciones que se le presentan y actuar de manera más ética poniendo a prueba los valores inculcados.
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 text-center space-y-4">
        <p className="text-sm md:text-base font-serif italic text-gray-300">
          Puedes encontrar referencias bibliográficas dando click acá abajo.
        </p>

        <a
          id="references-doc-link"
          href="https://docs.google.com/document/d/12CdTBpo_t9fBsvVP5ppEwjYmrcCTybYbYUCI5PDNFYI/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-slate-950 font-serif font-bold tracking-widest py-3 px-8 rounded hover:bg-opacity-90 active:scale-95 transition-all uppercase text-sm shadow-xl cursor-pointer"
        >
          Ver Referencias Bibliográficas
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white underline tracking-widest font-serif uppercase cursor-pointer"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
}
