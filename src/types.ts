export type ActiveView = 'cover' | 'menu' | 'conoce_mas';

export type GameSubState = 
  | 'intro'                 // "¿estás listo?" animation
  | 'transition'            // Black screen showing "Nivel X"
  | 'difficulty_1'          // Sopa de letras (Word Search)
  | 'difficulty_2'          // Rompecabezas (3x3 puzzle)
  | 'difficulty_3'          // Detecta el deepfake (Scenarios)
  | 'difficulty_4'          // Laberinto (Maze)
  | 'reflection';           // Post-game reflection

export interface WordSearchCell {
  letter: string;
  row: number;
  col: number;
}

export interface PuzzleTile {
  id: number;
  correctIndex: number;
  currentIndex: number;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  isDeepfake: boolean;
  explanation: string;
}
