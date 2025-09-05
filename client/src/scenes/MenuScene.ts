import Phaser from 'phaser';
import { useGameState } from '../lib/stores/useGameState';

export class MenuScene extends Phaser.Scene {
    private startButton!: Phaser.GameObjects.Graphics;
    private titleText!: Phaser.GameObjects.Text;
    private instructionText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;
        
        // Update game state
        useGameState.getState().setScene('menu');

        // Clean background
        this.add.rectangle(width / 2, height / 2, width, height, 0xf8fafc);

        // Simple title
        this.titleText = this.add.text(width / 2, height / 3, 'Save the Capybara', {
            fontSize: '48px',
            color: '#1f2937',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Clean instructions
        this.instructionText = this.add.text(width / 2, height / 2, 
            'Draw barriers to protect the capybara from bees\n\n' +
            'Phase 1: Draw (2.5 seconds)\n' +
            'Phase 2: Survive (5 seconds)', {
            fontSize: '18px',
            color: '#6b7280',
            align: 'center',
            lineSpacing: 4,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Simple button
        this.startButton = this.add.graphics();
        this.startButton.fillStyle(0x2563eb, 1);
        this.startButton.fillRoundedRect(width / 2 - 100, height * 0.75 - 25, 200, 50, 8);
        this.startButton.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 100, height * 0.75 - 25, 200, 50),
            Phaser.Geom.Rectangle.Contains
        );
        this.startButton.on('pointerdown', this.startGame, this);
        this.startButton.on('pointerover', () => {
            this.startButton.clear();
            this.startButton.fillStyle(0x1d4ed8, 1);
            this.startButton.fillRoundedRect(width / 2 - 100, height * 0.75 - 25, 200, 50, 8);
        });
        this.startButton.on('pointerout', () => {
            this.startButton.clear();
            this.startButton.fillStyle(0x2563eb, 1);
            this.startButton.fillRoundedRect(width / 2 - 100, height * 0.75 - 25, 200, 50, 8);
        });

        this.add.text(width / 2, height * 0.75, 'Start Game', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        // Handle resize
        this.scale.on('resize', this.resize, this);
    }

    private startGame() {
        // Play start sound if available
        if (this.sound.get('success')) {
            this.sound.play('success', { volume: 0.3 });
        }
        
        this.scene.start('GameScene');
    }

    private resize(gameSize: Phaser.Structs.Size) {
        const { width, height } = gameSize;
        
        // Reposition elements
        if (this.titleText) {
            this.titleText.setPosition(width / 2, height / 3);
        }
        
        if (this.instructionText) {
            this.instructionText.setPosition(width / 2, height / 2);
        }
        
        if (this.startButton) {
            this.startButton.setPosition(width / 2, height * 0.75);
        }
    }

    preload() {
        // Load sounds
        this.load.audio('hit', '/sounds/hit.mp3');
        this.load.audio('success', '/sounds/success.mp3');
        this.load.audio('background', '/sounds/background.mp3');
    }
}
