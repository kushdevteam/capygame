import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { GameOverScene } from '../scenes/GameOverScene';
import { TowerDefenseScene } from '../scenes/TowerDefenseScene';
import { GameUI } from './GameUI';
import { BackgroundMusic } from './BackgroundMusic';
import LevelMapUI from './LevelMapUI';
import { useGameState } from '../lib/stores/useGameState';

export const Game: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { currentScene } = useGameState();
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);
    const [showLevelMap, setShowLevelMap] = useState(false);
    const [selectedGameMode, setSelectedGameMode] = useState<'drawing' | 'tower-defense' | null>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: containerRef.current,
            backgroundColor: '#87CEEB', // Sky blue background
            render: {
                premultipliedAlpha: true // Better alpha blending
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            },
            scene: [MenuScene, GameScene, GameOverScene, TowerDefenseScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            input: {
                activePointers: 3 // Support multi-touch
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;
        setGameInstance(game);
        
        // Make game instance available globally for menu navigation
        (window as any).gameInstance = game;

        // Handle window resize
        const handleResize = () => {
            if (game) {
                game.scale.resize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (game) {
                game.destroy(true);
                gameRef.current = null;
                setGameInstance(null);
            }
        };
    }, []);

    const handleModeSelect = (mode: 'drawing' | 'tower-defense') => {
        setSelectedGameMode(mode);
        setShowLevelMap(true);
    };

    const handleLevelSelect = (level: number) => {
        useGameState.getState().setLevel(level);
        setShowLevelMap(false);
        
        // Start the appropriate scene based on the selected mode
        if (selectedGameMode === 'drawing') {
            gameInstance?.scene.start('GameScene');
        } else if (selectedGameMode === 'tower-defense') {
            gameInstance?.scene.start('TowerDefenseScene');
        }
    };

    const handleBackToMenu = () => {
        setShowLevelMap(false);
        setSelectedGameMode(null);
        gameInstance?.scene.start('MenuScene');
    };

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full" />
            
            {/* Only show GameUI when NOT showing level map */}
            {gameInstance && !showLevelMap && <GameUI game={gameInstance} onModeSelect={handleModeSelect} />}
            
            <BackgroundMusic isPlaying={currentScene === 'game'} />
            
            {/* Level Map UI Overlay - Full screen replacement */}
            {showLevelMap && selectedGameMode && (
                <LevelMapUI
                    gameMode={selectedGameMode}
                    onLevelSelect={handleLevelSelect}
                    onBackToMenu={handleBackToMenu}
                />
            )}
        </div>
    );
};
