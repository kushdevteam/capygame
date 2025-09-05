import Phaser from 'phaser';
import { useGameState } from '../lib/stores/useGameState';
import { useAuthStore } from '../lib/stores/useWallet';
import { getLevel } from '../lib/levels';
import { GAME_CONFIG } from '../lib/gameConfig';

interface Bee {
    sprite: Phaser.GameObjects.Rectangle;
    speed: number;
    targetX: number;
    targetY: number;
    active: boolean;
}

export class GameScene extends Phaser.Scene {
    private capybara!: Phaser.GameObjects.Graphics;
    private bees: Bee[] = [];
    private barriers: Phaser.GameObjects.Graphics[] = [];
    private currentBarrier: Phaser.GameObjects.Graphics | null = null;
    
    private gameTimer!: Phaser.Time.TimerEvent;
    private isDrawingPhase = true;
    private currentInk = 100;
    private lastDrawPoint: { x: number; y: number } | null = null;
    
    private currentLevel = 1;
    private isGameActive = false;
    private skyBackground!: Phaser.GameObjects.TileSprite;
    private grassBackground!: Phaser.GameObjects.TileSprite;
    private scaleListener?: () => void;

    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const { width, height } = this.scale;
        
        // Update game state
        useGameState.getState().setScene('game');
        
        // Initialize level
        this.currentLevel = useGameState.getState().level;
        const levelConfig = getLevel(this.currentLevel);
        
        if (!levelConfig) {
            console.error('Level not found:', this.currentLevel);
            this.scene.start('MenuScene');
            return;
        }

        // Beautiful seamless game background
        this.skyBackground = this.add.image(width / 2, height / 2, 'gameBackground')
            .setDisplaySize(width, height);

        // Create capybara
        this.createCapybara(levelConfig.capybaraPosition.x, levelConfig.capybaraPosition.y);
        
        // Setup input for drawing
        this.setupDrawingInput();
        
        // Initialize game state
        this.currentInk = levelConfig.inkLimit;
        useGameState.getState().setInk(this.currentInk);
        useGameState.getState().setTimeLeft(GAME_CONFIG.DRAWING_TIME + GAME_CONFIG.SURVIVAL_TIME);
        useGameState.getState().setCapybaraAlive(true);
        
        // Start game timer
        this.startGameTimer(levelConfig);
        
        // Handle resize
        this.scaleListener = (gameSize: Phaser.Structs.Size) => this.resize(gameSize);
        this.scale.on('resize', this.scaleListener);
        
        this.isGameActive = true;
    }

    private createCapybara(x: number, y: number) {
        // Create balanced capybara sprite - good detail but appropriately sized
        this.capybara = this.add.image(x, y, 'capybaraSprite')
            .setScale(0.15) // Good size for gameplay while maintaining visual appeal
            .setDepth(10) as any;
        
        // Add subtle glow effect
        const glow = this.add.circle(x, y, 25, 0xffeb3b, 0.2)
            .setDepth(9);
        
        // Gentle floating animation
        this.tweens.add({
            targets: this.capybara,
            y: y - 5,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Store reference for collision detection
        (this.capybara as any).originalX = x;
        (this.capybara as any).originalY = y;
    }

    private setupDrawingInput() {
        this.input.on('pointerdown', this.startDrawing, this);
        this.input.on('pointermove', this.continueDrawing, this);
        this.input.on('pointerup', this.stopDrawing, this);
    }

    private startDrawing(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingPhase || this.currentInk <= 0) return;
        
        this.currentBarrier = this.add.graphics();
        this.currentBarrier.lineStyle(6, 0x4ade80, 0.9); // Thicker, more visible green barrier
        this.currentBarrier.setDepth(5); // Ensure barriers are visible
        this.barriers.push(this.currentBarrier);
        
        this.lastDrawPoint = { x: pointer.x, y: pointer.y };
        useGameState.getState().setIsDrawing(true);
    }

    private continueDrawing(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingPhase || !this.currentBarrier || !this.lastDrawPoint || this.currentInk <= 0) return;
        
        const distance = Phaser.Math.Distance.Between(
            this.lastDrawPoint.x, this.lastDrawPoint.y,
            pointer.x, pointer.y
        );
        
        if (distance < GAME_CONFIG.MIN_DRAW_DISTANCE) return;
        
        // Draw line segment
        this.currentBarrier.lineBetween(
            this.lastDrawPoint.x, this.lastDrawPoint.y,
            pointer.x, pointer.y
        );
        
        // Consume ink
        this.currentInk -= distance * GAME_CONFIG.INK_CONSUMPTION_RATE;
        this.currentInk = Math.max(0, this.currentInk);
        useGameState.getState().setInk(this.currentInk);
        
        this.lastDrawPoint = { x: pointer.x, y: pointer.y };
        
        // Stop drawing if out of ink
        if (this.currentInk <= 0) {
            this.stopDrawing();
        }
    }

    private stopDrawing() {
        this.currentBarrier = null;
        this.lastDrawPoint = null;
        useGameState.getState().setIsDrawing(false);
    }

    private startGameTimer(levelConfig: any) {
        let timeRemaining = GAME_CONFIG.DRAWING_TIME + GAME_CONFIG.SURVIVAL_TIME;
        
        this.gameTimer = this.time.addEvent({
            delay: 100, // Update every 100ms
            callback: () => {
                timeRemaining -= 0.1;
                useGameState.getState().setTimeLeft(Math.max(0, timeRemaining));
                
                // Switch to survival phase
                if (timeRemaining <= GAME_CONFIG.SURVIVAL_TIME && this.isDrawingPhase) {
                    this.isDrawingPhase = false;
                    this.spawnBees(levelConfig);
                }
                
                // Game over
                if (timeRemaining <= 0) {
                    this.endGame(true); // Survived!
                }
            },
            repeat: -1
        });
    }

    private spawnBees(levelConfig: any) {
        levelConfig.beeSpawns.forEach((spawn: any) => {
            this.time.delayedCall(spawn.delay * 1000, () => {
                this.createBee(spawn.x, spawn.y, spawn.speed);
            });
        });
    }

    private createBee(x: number, y: number, speed: number) {
        // Create balanced bee sprite - appealing but properly sized
        const beeSprite = this.add.image(x, y, 'beeSprite')
            .setScale(0.12) // Good size for gameplay while maintaining charm
            .setDepth(8);
        
        // Add wing flutter animation
        this.tweens.add({
            targets: beeSprite,
            scaleX: 0.11,
            scaleY: 0.13,
            duration: 150,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add subtle buzzing movement
        this.tweens.add({
            targets: beeSprite,
            angle: { from: -3, to: 3 },
            duration: 400,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        const bee: Bee = {
            sprite: beeSprite as any,
            speed: speed,
            targetX: (this.capybara as any).originalX || this.capybara.x,
            targetY: (this.capybara as any).originalY || this.capybara.y,
            active: true
        };
        
        this.bees.push(bee);
    }

    update() {
        if (!this.isGameActive) return;
        
        // Update bees
        this.bees.forEach(bee => {
            if (!bee.active) return;
            
            // Move towards capybara
            const angle = Phaser.Math.Angle.Between(
                bee.sprite.x, bee.sprite.y,
                this.capybara.x, this.capybara.y
            );
            
            const deltaX = Math.cos(angle) * bee.speed * 0.016; // 60fps assumption
            const deltaY = Math.sin(angle) * bee.speed * 0.016;
            
            // Check for barrier collision before moving
            const newX = bee.sprite.x + deltaX;
            const newY = bee.sprite.y + deltaY;
            
            if (!this.checkBarrierCollision(newX, newY)) {
                bee.sprite.x = newX;
                bee.sprite.y = newY;
            } else {
                // Bounce off barrier
                bee.sprite.x -= deltaX;
                bee.sprite.y -= deltaY;
            }
            
            // Check if bee reached capybara
            const distanceToCapybara = Phaser.Math.Distance.Between(
                bee.sprite.x, bee.sprite.y,
                this.capybara.x, this.capybara.y
            );
            
            if (distanceToCapybara < 20) { // Much smaller detection radius
                this.endGame(false); // Capybara was caught!
            }
        });
    }

    private checkBarrierCollision(x: number, y: number): boolean {
        // Simple collision detection with barriers
        for (const barrier of this.barriers) {
            try {
                // Check if the graphics object has any drawn content
                if (barrier && barrier.displayList) {
                    // Use a simple radius check around drawn areas
                    const checkRadius = 15;
                    const bounds = (barrier as any).getBounds();
                    
                    if (bounds.width > 0 && bounds.height > 0) {
                        // Check if point is within expanded bounds
                        if (x >= bounds.x - checkRadius && 
                            x <= bounds.x + bounds.width + checkRadius &&
                            y >= bounds.y - checkRadius && 
                            y <= bounds.y + bounds.height + checkRadius) {
                            return true;
                        }
                    }
                }
            } catch (error) {
                // If getBounds fails, skip this barrier
                continue;
            }
        }
        return false;
    }

    private endGame(won: boolean) {
        this.isGameActive = false;
        
        if (this.gameTimer) {
            this.gameTimer.destroy();
        }
        
        // Calculate score
        let score = useGameState.getState().score;
        if (won) {
            score += GAME_CONFIG.SCORE_PER_LEVEL;
            score += Math.floor(this.currentInk) * 2; // Bonus for leftover ink
            
            // Play success sound
            if (this.sound.get('success')) {
                this.sound.play('success', { volume: 0.5 });
            }
        } else {
            // Play hit sound
            if (this.sound.get('hit')) {
                this.sound.play('hit', { volume: 0.5 });
            }
        }
        
        useGameState.getState().setScore(score);
        useGameState.getState().setCapybaraAlive(won);
        
        // Submit score if wallet connected
        this.submitScore(won);
        
        // Transition to game over scene
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { won });
        });
    }

    private async submitScore(won: boolean) {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const gameState = useGameState.getState();
        
        try {
            await fetch('/api/submit-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: user.walletAddress,
                    level: gameState.level,
                    score: gameState.score,
                    completed: won
                })
            });
        } catch (error) {
            console.log('Score submission failed:', error);
        }
    }

    private resize(gameSize: Phaser.Structs.Size) {
        // Handle responsive resizing
        const { width, height } = gameSize;
        
        // Resize background
        if (this.skyBackground) {
            this.skyBackground.setDisplaySize(width, height);
            this.skyBackground.setPosition(width / 2, height / 2);
        }
        
        // Ensure game elements stay within bounds
        if (this.capybara) {
            this.capybara.x = Math.min(Math.max(this.capybara.x, 50), width - 50);
            this.capybara.y = Math.min(Math.max(this.capybara.y, 50), height - 50);
        }
    }
    
    shutdown() {
        // Clean up event listeners
        if (this.scaleListener) {
            this.scale.off('resize', this.scaleListener);
        }
        super.shutdown();
    }
}
