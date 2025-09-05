import Phaser from 'phaser';
import { useGameState } from '../lib/stores/useGameState';

export class MenuScene extends Phaser.Scene {
    private startButton!: Phaser.GameObjects.Graphics;
    private titleText!: Phaser.GameObjects.Text;
    private instructionText!: Phaser.GameObjects.Text;
    private skyBackground!: Phaser.GameObjects.TileSprite;
    private grassBackground!: Phaser.GameObjects.TileSprite;
    private buttonText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;
        
        // Update game state
        useGameState.getState().setScene('menu');

        // Layered background with textures
        this.skyBackground = this.add.tileSprite(0, 0, width, height, 'sky')
            .setOrigin(0, 0)
            .setTint(0xe0f2fe); // Light blue tint
        
        this.grassBackground = this.add.tileSprite(0, height - 100, width, 100, 'grass')
            .setOrigin(0, 0)
            .setTint(0x86efac); // Light green tint

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

        // Hidden button (replaced by React overlay)
        // this.startButton = this.add.graphics();
        // this.buttonText = this.add.text(...);
        // Button functionality moved to React MenuOverlay component

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
        
        // Resize backgrounds
        if (this.skyBackground) {
            this.skyBackground.setSize(width, height);
        }
        
        if (this.grassBackground) {
            this.grassBackground.setSize(width, 100);
            this.grassBackground.setPosition(0, height - 100);
        }
        
        // Reposition elements
        if (this.titleText) {
            this.titleText.setPosition(width / 2, height / 3);
        }
        
        if (this.instructionText) {
            this.instructionText.setPosition(width / 2, height / 2);
        }
        
        // Button removed - using React overlay instead
        // No button resize logic needed
    }

    preload() {
        // Load textures
        this.load.image('sky', '/textures/sky.png');
        this.load.image('grass', '/textures/grass.png');
        
        // Load new game assets
        this.load.image('gameBackground', '/images/Seamless_wetland_game_background_971a64de.png');
        this.load.image('capybaraSprite', '/images/custom_capybara.png');
        this.load.image('beeSprite', '/images/custom_bee.png');
        
        // Load sounds
        this.load.audio('hit', '/sounds/hit.mp3');
        this.load.audio('success', '/sounds/success.mp3');
        this.load.audio('background', '/sounds/background.mp3');
    }
}
