import { create } from 'zustand';

export type GameScene = 'menu' | 'game' | 'gameover' | 'towerdefense';

interface GameState {
    currentScene: GameScene;
    level: number;
    score: number;
    timeLeft: number;
    ink: number;
    isDrawing: boolean;
    capybaraAlive: boolean;
    
    // Actions
    setScene: (scene: GameScene) => void;
    setLevel: (level: number) => void;
    setScore: (score: number) => void;
    setTimeLeft: (time: number) => void;
    setInk: (ink: number) => void;
    setIsDrawing: (drawing: boolean) => void;
    setCapybaraAlive: (alive: boolean) => void;
    resetGame: () => void;
}

export const useGameState = create<GameState>((set) => ({
    currentScene: 'menu',
    level: 0, // Start with tutorial
    score: 0,
    timeLeft: 7.5, // 2.5s drawing + 5s survival
    ink: 100,
    isDrawing: false,
    capybaraAlive: true,
    
    setScene: (scene) => set({ currentScene: scene }),
    setLevel: (level) => set({ level }),
    setScore: (score) => set({ score }),
    setTimeLeft: (time) => set({ timeLeft: time }),
    setInk: (ink) => set({ ink }),
    setIsDrawing: (drawing) => set({ isDrawing: drawing }),
    setCapybaraAlive: (alive) => set({ capybaraAlive: alive }),
    
    resetGame: () => set({
        level: 0, // Reset to tutorial
        score: 0,
        timeLeft: 7.5,
        ink: 100,
        isDrawing: false,
        capybaraAlive: true
    })
}));
