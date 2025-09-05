import Phaser from 'phaser';
import { useGameState } from '../lib/stores/useGameState';
import { getNextLevel, getTotalLevels } from '../lib/levels';

export class GameOverScene extends Phaser.Scene {
    private won = false;
    private currentLevel = 1;
    private score = 0;

    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data: { won: boolean }) {
        const { width, height } = this.scale;
        
        // Update game state
        useGameState.getState().setScene('gameover');
        
        this.won = data.won;
        const gameState = useGameState.getState();
        this.currentLevel = gameState.level;
        this.score = gameState.score;

        // Clean background based on win/loss
        const bgColor = this.won ? 0xf0f9ff : 0xfef2f2;
        this.add.rectangle(width / 2, height / 2, width, height, bgColor);

        // Simple title
        const titleText = this.won ? 'Level Complete!' : 'Game Over';
        const titleColor = this.won ? '#059669' : '#dc2626';
        
        this.add.text(width / 2, height / 3, titleText, {
            fontSize: '42px',
            color: titleColor,
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Score display
        this.add.text(width / 2, height / 2 - 30, `Score: ${this.score.toLocaleString()}`, {
            fontSize: '28px',
            color: '#374151',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Level display
        this.add.text(width / 2, height / 2 + 10, `Level: ${this.currentLevel}`, {
            fontSize: '20px',
            color: '#6b7280',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Action buttons
        this.createButtons();

        // Handle resize
        this.scale.on('resize', this.resize, this);
    }

    private createButtons() {
        const { width, height } = this.scale;
        const buttonY = height * 0.75;
        
        if (this.won) {
            // Check if there's a next level
            const nextLevel = getNextLevel(this.currentLevel);
            
            if (nextLevel) {
                // Next Level button
                const nextButton = this.add.rectangle(width / 2 - 120, buttonY, 200, 60, 0x2196F3)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', this.nextLevel, this)
                    .on('pointerover', () => nextButton.setFillStyle(0x42A5F5))
                    .on('pointerout', () => nextButton.setFillStyle(0x2196F3));

                this.add.text(width / 2 - 120, buttonY, 'Next Level', {
                    fontSize: '20px',
                    color: '#FFFFFF',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            } else {
                // Game completed!
                this.add.text(width / 2, height / 2 + 60, 'Congratulations!\nYou completed all levels!', {
                    fontSize: '24px',
                    color: '#FFFFFF',
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5);
            }
            
            // Menu button
            const menuButton = this.add.rectangle(width / 2 + 120, buttonY, 200, 60, 0x9C27B0)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', this.backToMenu, this)
                .on('pointerover', () => menuButton.setFillStyle(0xAB47BC))
                .on('pointerout', () => menuButton.setFillStyle(0x9C27B0));

            this.add.text(width / 2 + 120, buttonY, 'Main Menu', {
                fontSize: '20px',
                color: '#FFFFFF',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
        } else {
            // Restart button
            const restartButton = this.add.rectangle(width / 2 - 120, buttonY, 200, 60, 0xFF9800)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', this.restartLevel, this)
                .on('pointerover', () => restartButton.setFillStyle(0xFFB74D))
                .on('pointerout', () => restartButton.setFillStyle(0xFF9800));

            this.add.text(width / 2 - 120, buttonY, 'Retry Level', {
                fontSize: '20px',
                color: '#FFFFFF',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Menu button
            const menuButton = this.add.rectangle(width / 2 + 120, buttonY, 200, 60, 0x9C27B0)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', this.backToMenu, this)
                .on('pointerover', () => menuButton.setFillStyle(0xAB47BC))
                .on('pointerout', () => menuButton.setFillStyle(0x9C27B0));

            this.add.text(width / 2 + 120, buttonY, 'Main Menu', {
                fontSize: '20px',
                color: '#FFFFFF',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
    }

    private nextLevel() {
        const gameState = useGameState.getState();
        gameState.setLevel(this.currentLevel + 1);
        
        // Play success sound
        if (this.sound.get('success')) {
            this.sound.play('success', { volume: 0.3 });
        }
        
        this.scene.start('GameScene');
    }

    private restartLevel() {
        // Reset score for retry
        useGameState.getState().setScore(Math.max(0, this.score - 50)); // Small penalty for retry
        
        this.scene.start('GameScene');
    }

    private backToMenu() {
        useGameState.getState().resetGame();
        this.scene.start('MenuScene');
    }

    private resize(gameSize: Phaser.Structs.Size) {
        // Handle responsive resizing if needed
    }
}
