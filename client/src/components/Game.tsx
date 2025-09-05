import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { GameOverScene } from '../scenes/GameOverScene';
import { GameUI } from './GameUI';
import { BackgroundMusic } from './BackgroundMusic';
import { useGameState } from '../lib/stores/useGameState';

export const Game: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { currentScene } = useGameState();
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);

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
            scene: [MenuScene, GameScene, GameOverScene],
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

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full" />
            {gameInstance && <GameUI game={gameInstance} />}
            <BackgroundMusic isPlaying={currentScene === 'game'} />
        </div>
    );
};
