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
    private barrierPoints: Array<{x1: number, y1: number, x2: number, y2: number, type: string, width?: number}> = [];
    private currentBarrier: Phaser.GameObjects.Graphics | null = null;
    private currentBarrierGlow: Phaser.GameObjects.Graphics | null = null;
    private currentBarrierCore: Phaser.GameObjects.Graphics | null = null;
    private currentBarrierType: 'normal' | 'temporary' | 'bouncy' | 'explosive' = 'normal';
    private powerUps: Array<{sprite: Phaser.GameObjects.Image, type: string, x: number, y: number}> = [];
    
    private gameTimer!: Phaser.Time.TimerEvent;
    private isDrawingPhase = true;
    private currentInk = 100;
    private lastDrawPoint: { x: number; y: number } | null = null;
    private lastDrawTime: number = 0;
    private drawingCursor: Phaser.GameObjects.Graphics | null = null;
    
    private currentLevel = 1;
    private isGameActive = false;
    private skyBackground!: Phaser.GameObjects.Image;
    private grassBackground!: Phaser.GameObjects.TileSprite;
    private scaleListener?: () => void;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('gameBackground', '/images/level_map_bg.png?v=2');
        this.load.image('capybaraSprite', '/images/enhanced_capybara.png?v=2');
        this.load.image('beeSprite', '/images/enhanced_bee.png?v=2');
        this.load.image('leaf', '/images/enhanced_capybara.png?v=2');
        
        // Load comprehensive audio library for AAA experience
        this.load.audio('background', '/sounds/background.mp3');
        this.load.audio('success', '/sounds/success.mp3');
        this.load.audio('hit', '/sounds/hit.mp3');
        
        // Note: Using procedural ambient audio instead of file-based for better compatibility
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
        
        // Reset drawing phase state for new level
        this.isDrawingPhase = true;
        this.currentBarrier = null;
        this.currentBarrierGlow = null;
        this.currentBarrierCore = null;
        this.lastDrawPoint = null;
        this.drawingCursor = null;
        
        // Clear any existing barriers and bees from previous level
        this.barriers.forEach(barrier => barrier.destroy());
        this.barriers = [];
        this.barrierPoints = [];
        this.bees.forEach(bee => bee.sprite.destroy());
        this.bees = [];
        this.powerUps.forEach(powerUp => powerUp.sprite.destroy());
        this.powerUps = [];
        
        // Setup input for drawing
        this.setupDrawingInput();
        
        // Initialize game state
        this.currentInk = levelConfig.inkLimit;
        useGameState.getState().setInk(this.currentInk);
        useGameState.getState().setTimeLeft(GAME_CONFIG.DRAWING_TIME + GAME_CONFIG.SURVIVAL_TIME);
        useGameState.getState().setCapybaraAlive(true);
        useGameState.getState().setIsDrawing(false);
        
        // Initialize AAA audio system
        this.initializeAdvancedAudioSystem();
        
        // Start game timer
        this.startGameTimer(levelConfig);
        
        // Spawn power-ups randomly during drawing phase
        this.spawnPowerUps();
        
        // Handle resize
        this.scaleListener = () => this.resize();
        this.scale.on('resize', this.scaleListener);
        
        this.isGameActive = true;
    }

    private createCollisionParticles(x: number, y: number) {
        // Create explosion-like particles when bee hits barrier
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, 0xfbbf24, 1);
            particle.setDepth(15);
            
            const angle = (i / 8) * Math.PI * 2;
            const speed = 50 + Math.random() * 50;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0.2,
                duration: 300,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    private createCapybaraSparkles(x: number, y: number) {
        // Create gentle sparkles around the capybara
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                if (!this.isGameActive) return;
                
                for (let i = 0; i < 3; i++) {
                    const sparkle = this.add.circle(
                        x + (Math.random() - 0.5) * 60,
                        y + (Math.random() - 0.5) * 60,
                        2, 0xffeb3b, 0.8
                    );
                    sparkle.setDepth(12);
                    
                    this.tweens.add({
                        targets: sparkle,
                        y: sparkle.y - 20,
                        alpha: 0,
                        scale: 1.5,
                        duration: 1000,
                        ease: 'Power1',
                        onComplete: () => sparkle.destroy()
                    });
                }
            },
            repeat: -1
        });
    }

    private spawnPowerUps() {
        // Spawn power-ups every 3-5 seconds during drawing phase
        this.time.addEvent({
            delay: 3000 + Math.random() * 2000,
            callback: () => {
                if (!this.isDrawingPhase || !this.isGameActive) return;
                
                this.createPowerUp();
            },
            repeat: 2 // Spawn up to 3 power-ups during drawing phase
        });
    }

    private createPowerUp() {
        const types = ['extra-ink', 'slow-motion', 'shield'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Random position on screen
        const x = 100 + Math.random() * 600;
        const y = 100 + Math.random() * 400;
        
        // Create power-up sprite (using capybara image as placeholder)
        const sprite = this.add.image(x, y, 'capybaraSprite')
            .setScale(0.08)
            .setDepth(11)
            .setTint(this.getPowerUpColor(type));
        
        // Add floating animation
        this.tweens.add({
            targets: sprite,
            y: y - 10,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add pulsing effect
        this.tweens.add({
            targets: sprite,
            scale: 0.1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Store power-up data
        this.powerUps.push({ sprite, type, x, y });
        
        // Auto-remove after 10 seconds if not collected
        this.time.delayedCall(10000, () => {
            this.removePowerUp(sprite);
        });
    }

    private getPowerUpColor(type: string): number {
        switch (type) {
            case 'extra-ink': return 0x3b82f6; // Blue
            case 'slow-motion': return 0x8b5cf6; // Purple  
            case 'shield': return 0xf59e0b; // Yellow
            default: return 0xffffff;
        }
    }

    private removePowerUp(sprite: Phaser.GameObjects.Image) {
        const index = this.powerUps.findIndex(p => p.sprite === sprite);
        if (index > -1) {
            this.powerUps.splice(index, 1);
            sprite.destroy();
        }
    }

    private checkPowerUpCollection() {
        // Check if player's cursor/touch is near any power-ups during drawing
        if (!this.isDrawingPhase || !this.input.activePointer) return;
        
        const pointer = this.input.activePointer;
        this.powerUps.forEach(powerUp => {
            const distance = Phaser.Math.Distance.Between(
                pointer.x, pointer.y, 
                powerUp.sprite.x, powerUp.sprite.y
            );
            
            if (distance < 30) {
                this.collectPowerUp(powerUp);
            }
        });
    }

    private collectPowerUp(powerUp: {sprite: Phaser.GameObjects.Image, type: string, x: number, y: number}) {
        // Play collection sound
        if (this.sound.get('success')) {
            this.sound.play('success', { volume: 0.4 });
        }
        
        // Create collection effect
        this.createCollectionEffect(powerUp.x, powerUp.y);
        
        // Apply power-up effect
        this.applyPowerUpEffect(powerUp.type);
        
        // Remove power-up
        this.removePowerUp(powerUp.sprite);
    }

    private createCollectionEffect(x: number, y: number) {
        // Create sparkling collection effect
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(x, y, 3, 0xfbbf24, 1);
            particle.setDepth(15);
            
            const angle = (i / 6) * Math.PI * 2;
            const speed = 40;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 1.5,
                duration: 400,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    private applyPowerUpEffect(type: string) {
        switch (type) {
            case 'extra-ink':
                // Add 25 ink points
                this.currentInk = Math.min(100, this.currentInk + 25);
                useGameState.getState().setInk(this.currentInk);
                this.showPowerUpMessage('Extra Ink! +25', '#3b82f6');
                break;
                
            case 'slow-motion':
                // Slow down all bees for 3 seconds
                this.bees.forEach(bee => {
                    if (bee.active) {
                        bee.speed *= 0.3; // Slow to 30% speed
                    }
                });
                this.showPowerUpMessage('Slow Motion!', '#8b5cf6');
                
                // Restore normal speed after 3 seconds
                this.time.delayedCall(3000, () => {
                    this.bees.forEach(bee => {
                        if (bee.active) {
                            bee.speed /= 0.3; // Restore original speed
                        }
                    });
                });
                break;
                
            case 'shield':
                // Create protective shield around capybara
                this.createShield();
                this.showPowerUpMessage('Shield Active!', '#f59e0b');
                break;
        }
    }

    private showPowerUpMessage(text: string, color: string) {
        const message = this.add.text(400, 200, text, {
            fontSize: '28px',
            color: color,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(20);
        
        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 170,
            scale: 1.2,
            duration: 2000,
            onComplete: () => message.destroy()
        });
    }

    private createShield() {
        const shield = this.add.circle(this.capybara.x, this.capybara.y, 35, 0xf59e0b, 0.3)
            .setDepth(9);
        
        // Shield animation
        this.tweens.add({
            targets: shield,
            scale: 1.1,
            duration: 500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Shield blocks bees for 5 seconds
        const originalCollisionRadius = 20;
        const shieldRadius = 35;
        
        this.time.delayedCall(5000, () => {
            shield.destroy();
        });
        
        // Store shield reference for collision detection
        (this.capybara as any).shield = { active: true, radius: shieldRadius };
        this.time.delayedCall(5000, () => {
            (this.capybara as any).shield = null;
        });
    }

    private drawBarrierSegment(x1: number, y1: number, x2: number, y2: number) {
        if (!this.currentBarrier) return;
        
        switch (this.currentBarrierType) {
            case 'normal':
                // Green magical barrier
                this.currentBarrier.lineStyle(16, 0x4ade80, 0.4);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                this.currentBarrier.lineStyle(12, 0x22c55e, 0.7);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                this.currentBarrier.lineStyle(8, 0xfbbf24, 1.0);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                break;
                
            case 'temporary':
                // Orange flickering barrier
                this.currentBarrier.lineStyle(16, 0xff8c00, 0.6);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                this.currentBarrier.lineStyle(8, 0xff4500, 1.0);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                break;
                
            case 'bouncy':
                // Purple elastic barrier
                this.currentBarrier.lineStyle(16, 0x9333ea, 0.5);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                this.currentBarrier.lineStyle(8, 0x7c3aed, 1.0);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                break;
                
            case 'explosive':
                // Red danger barrier
                this.currentBarrier.lineStyle(16, 0xef4444, 0.7);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                this.currentBarrier.lineStyle(8, 0xdc2626, 1.0);
                this.currentBarrier.lineBetween(x1, y1, x2, y2);
                break;
        }
    }

    private cycleBarrierType() {
        const types: Array<'normal' | 'temporary' | 'bouncy' | 'explosive'> = ['normal', 'temporary', 'bouncy', 'explosive'];
        const currentIndex = types.indexOf(this.currentBarrierType);
        this.currentBarrierType = types[(currentIndex + 1) % types.length];
        
        // Show barrier type indicator
        this.showBarrierTypeIndicator();
    }

    private showBarrierTypeIndicator() {
        const text = this.add.text(400, 100, `Barrier: ${this.currentBarrierType.toUpperCase()}`, {
            fontSize: '24px',
            color: this.getBarrierColor(this.currentBarrierType),
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(20);
        
        this.tweens.add({
            targets: text,
            alpha: 0,
            y: 80,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    private getBarrierColor(type: string): string {
        switch (type) {
            case 'normal': return '#22c55e';
            case 'temporary': return '#ff8c00';
            case 'bouncy': return '#9333ea';
            case 'explosive': return '#ef4444';
            default: return '#22c55e';
        }
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
        
        // Create sparkle particles around capybara
        this.createCapybaraSparkles(x, y);
    }

    private setupDrawingInput() {
        // Remove any existing listeners first to prevent duplicates
        this.input.off('pointerdown', this.startDrawing, this);
        this.input.off('pointermove', this.continueDrawing, this);
        this.input.off('pointerup', this.stopDrawing, this);
        
        // Add fresh input listeners
        this.input.on('pointerdown', this.startDrawing, this);
        this.input.on('pointermove', this.continueDrawing, this);
        this.input.on('pointerup', this.stopDrawing, this);
        
        // Add keyboard input for barrier type cycling
        this.input.keyboard?.off('keydown-SPACE'); // Remove existing listener
        this.input.keyboard?.on('keydown-SPACE', () => {
            if (this.isDrawingPhase) {
                this.cycleBarrierType();
            }
        });
        
        console.log('Drawing input setup complete for level', this.currentLevel, 'Drawing phase:', this.isDrawingPhase);
    }

    private startDrawing(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingPhase) return;
        
        // Create multiple layers for advanced visual effects
        this.currentBarrier = this.add.graphics();
        this.currentBarrierGlow = this.add.graphics();
        this.currentBarrierCore = this.add.graphics();
        
        // Set proper layering
        this.currentBarrierGlow.setDepth(3);
        this.currentBarrier.setDepth(4);
        this.currentBarrierCore.setDepth(5);
        
        this.barriers.push(this.currentBarrier);
        this.barriers.push(this.currentBarrierGlow);
        this.barriers.push(this.currentBarrierCore);
        
        this.lastDrawPoint = { x: pointer.x, y: pointer.y };
        this.lastDrawTime = this.time.now;
        useGameState.getState().setIsDrawing(true);
        
        // Advanced drawing start effects
        this.createDrawingStartEffect(pointer.x, pointer.y);
        
        // Play enhanced drawing sound with spatial audio
        this.createSpatialAudio(pointer.x, pointer.y, 'success', {
            volumeMultiplier: 0.3,
            rate: 0.8 + Math.random() * 0.4,
            detune: Math.random() * 200 - 100
        });

        // Create drawing cursor effect
        this.createDrawingCursor(pointer.x, pointer.y);
    }

    private continueDrawing(pointer: Phaser.Input.Pointer) {
        if (!this.isDrawingPhase || !this.currentBarrier || !this.lastDrawPoint) return;
        
        const distance = Phaser.Math.Distance.Between(
            this.lastDrawPoint.x, this.lastDrawPoint.y,
            pointer.x, pointer.y
        );
        
        if (distance < GAME_CONFIG.MIN_DRAW_DISTANCE) return;

        // Calculate drawing speed for dynamic line width and effects
        const currentTime = this.time.now;
        const timeDelta = currentTime - (this.lastDrawTime || currentTime);
        const speed = Math.min(distance / Math.max(timeDelta, 1), 50);
        this.lastDrawTime = currentTime;

        // Dynamic line width based on speed (slower = thicker, more precise)
        const baseWidth = this.getBaseLineWidth();
        const speedMultiplier = Math.max(0.5, 2 - speed * 0.1);
        const dynamicWidth = baseWidth * speedMultiplier;

        // Create smooth bezier curve instead of straight lines
        const midX = (this.lastDrawPoint.x + pointer.x) / 2;
        const midY = (this.lastDrawPoint.y + pointer.y) / 2;
        
        // Store curve data for collision detection (use multiple points along curve)
        const curvePoints = this.generateCurvePoints(
            this.lastDrawPoint.x, this.lastDrawPoint.y,
            midX, midY, 
            pointer.x, pointer.y
        );

        curvePoints.forEach((point, index) => {
            if (index > 0) {
                this.barrierPoints.push({
                    x1: curvePoints[index - 1].x,
                    y1: curvePoints[index - 1].y,
                    x2: point.x,
                    y2: point.y,
                    type: this.currentBarrierType,
                    width: dynamicWidth
                });
            }
        });

        // Draw smooth curve with advanced visual effects
        this.drawAdvancedBarrierCurve(
            this.lastDrawPoint.x, this.lastDrawPoint.y,
            midX, midY,
            pointer.x, pointer.y,
            dynamicWidth,
            speed
        );

        // Advanced particle trail following the drawing
        this.createDrawingParticleTrail(pointer.x, pointer.y, speed);

        // Check for power-up collection while drawing
        this.checkPowerUpCollection();

        // Advanced ink consumption with visual feedback
        if (this.currentInk > 0) {
            const inkToConsume = Math.min(distance * GAME_CONFIG.INK_CONSUMPTION_RATE, this.currentInk);
            this.currentInk -= inkToConsume;
            this.currentInk = Math.max(0, this.currentInk);
            useGameState.getState().setInk(this.currentInk);
            
            // Visual ink splash effects
            if (Math.random() < 0.1) {
                this.createInkSplash(pointer.x, pointer.y);
            }
        } else {
            // Low ink warning effects
            if (Math.random() < 0.3) {
                this.createLowInkWarning(pointer.x, pointer.y);
            }
        }

        this.lastDrawPoint = { x: pointer.x, y: pointer.y };
    }

    private stopDrawing() {
        // Advanced drawing end effects
        if (this.lastDrawPoint) {
            this.createDrawingEndEffect(this.lastDrawPoint.x, this.lastDrawPoint.y);
        }
        
        this.currentBarrier = null;
        this.currentBarrierGlow = null;
        this.currentBarrierCore = null;
        this.lastDrawPoint = null;
        useGameState.getState().setIsDrawing(false);
        
        // Remove drawing cursor
        if (this.drawingCursor) {
            this.drawingCursor.destroy();
            this.drawingCursor = null;
        }
    }

    // ==== ADVANCED DRAWING SYSTEM METHODS ====

    private getBaseLineWidth(): number {
        switch (this.currentBarrierType) {
            case 'normal': return 12;
            case 'temporary': return 8;
            case 'bouncy': return 16;
            case 'explosive': return 20;
            default: return 12;
        }
    }

    private generateCurvePoints(x1: number, y1: number, midX: number, midY: number, x2: number, y2: number): Array<{x: number, y: number}> {
        const points = [];
        const segments = 8; // Higher = smoother collision detection
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const invT = 1 - t;
            
            // Quadratic Bezier curve formula
            const x = invT * invT * x1 + 2 * invT * t * midX + t * t * x2;
            const y = invT * invT * y1 + 2 * invT * t * midY + t * t * y2;
            
            points.push({ x, y });
        }
        
        return points;
    }

    private drawAdvancedBarrierCurve(x1: number, y1: number, midX: number, midY: number, x2: number, y2: number, width: number, speed: number) {
        if (!this.currentBarrier || !this.currentBarrierGlow || !this.currentBarrierCore) return;

        const barrierColor = this.getBarrierColorHex(this.currentBarrierType);
        const glowColor = this.getBarrierGlowColor(this.currentBarrierType);
        
        // Outer glow layer - use lineBetween for compatibility
        this.currentBarrierGlow.lineStyle(width * 2.5, glowColor, 0.2);
        this.currentBarrierGlow.lineBetween(x1, y1, x2, y2);

        // Main barrier layer
        this.currentBarrier.lineStyle(width, barrierColor, 0.9);
        this.currentBarrier.lineBetween(x1, y1, x2, y2);

        // Core highlight layer
        this.currentBarrierCore.lineStyle(width * 0.4, 0xffffff, 0.6);
        this.currentBarrierCore.lineBetween(x1, y1, x2, y2);
        
        // Add curve effect with additional segments for smoothness
        const segments = 3;
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const curveX = x1 + t * (x2 - x1) + Math.sin(t * Math.PI) * (midX - (x1 + x2) / 2) * 0.3;
            const curveY = y1 + t * (y2 - y1) + Math.sin(t * Math.PI) * (midY - (y1 + y2) / 2) * 0.3;
            
            this.currentBarrier.lineStyle(width * (1 - t * 0.3), barrierColor, 0.8);
            this.currentBarrier.lineBetween(
                x1 + (t - 0.1) * (x2 - x1), y1 + (t - 0.1) * (y2 - y1),
                curveX, curveY
            );
        }
    }

    private getBarrierColorHex(type: string): number {
        switch (type) {
            case 'normal': return 0x22c55e;
            case 'temporary': return 0xff8c00;
            case 'bouncy': return 0x9333ea;
            case 'explosive': return 0xef4444;
            default: return 0x22c55e;
        }
    }

    private getBarrierGlowColor(type: string): number {
        switch (type) {
            case 'normal': return 0x86efac;
            case 'temporary': return 0xfbbf24;
            case 'bouncy': return 0xc084fc;
            case 'explosive': return 0xf87171;
            default: return 0x86efac;
        }
    }

    private createDrawingParticleTrail(x: number, y: number, speed: number) {
        const particleCount = Math.min(Math.floor(speed * 0.3) + 1, 5);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                Math.random() * 3 + 1,
                this.getBarrierColorHex(this.currentBarrierType),
                0.8
            ).setDepth(6);

            this.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                duration: 300 + Math.random() * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    private createInkSplash(x: number, y: number) {
        const splashCount = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < splashCount; i++) {
            const splash = this.add.circle(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                Math.random() * 2 + 1,
                0x6366f1,
                0.6
            ).setDepth(6);

            this.tweens.add({
                targets: splash,
                alpha: 0,
                x: splash.x + (Math.random() - 0.5) * 30,
                y: splash.y + (Math.random() - 0.5) * 30,
                duration: 400,
                ease: 'Quad.easeOut',
                onComplete: () => splash.destroy()
            });
        }
    }

    private createLowInkWarning(x: number, y: number) {
        const warning = this.add.circle(x, y, 8, 0xff4444, 0.7).setDepth(6);
        
        this.tweens.add({
            targets: warning,
            alpha: 0,
            scale: 2,
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => warning.destroy()
        });
    }

    private createDrawingStartEffect(x: number, y: number) {
        const ripples = 3;
        
        for (let i = 0; i < ripples; i++) {
            const ripple = this.add.circle(x, y, 2, this.getBarrierGlowColor(this.currentBarrierType), 0.5).setDepth(6);
            
            this.tweens.add({
                targets: ripple,
                scale: 8 + i * 2,
                alpha: 0,
                duration: 800 + i * 200,
                ease: 'Cubic.easeOut',
                delay: i * 100,
                onComplete: () => ripple.destroy()
            });
        }
    }

    private createDrawingEndEffect(x: number, y: number) {
        const burst = this.add.circle(x, y, 5, this.getBarrierColorHex(this.currentBarrierType), 0.8).setDepth(6);
        
        this.tweens.add({
            targets: burst,
            scale: 3,
            alpha: 0,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => burst.destroy()
        });
    }

    private createDrawingCursor(x: number, y: number) {
        this.drawingCursor = this.add.graphics();
        this.drawingCursor.setDepth(10);
        
        const updateCursor = () => {
            if (!this.drawingCursor || !this.input.activePointer) return;
            
            this.drawingCursor.clear();
            const pointer = this.input.activePointer;
            
            // Dynamic cursor based on barrier type
            const radius = this.getBaseLineWidth() / 2;
            const color = this.getBarrierColorHex(this.currentBarrierType);
            
            this.drawingCursor.lineStyle(2, color, 0.8);
            this.drawingCursor.strokeCircle(pointer.x, pointer.y, radius);
            
            // Inner dot
            this.drawingCursor.fillStyle(color, 0.6);
            this.drawingCursor.fillCircle(pointer.x, pointer.y, 2);
        };

        this.input.on('pointermove', updateCursor);
    }

    private startAdvancedNatureSounds() {
        // Wind sounds
        this.time.addEvent({
            delay: 8000 + Math.random() * 12000,
            callback: () => {
                if (!this.isGameActive) return;
                
                this.createProceduralSound('wind', {
                    frequency: 60 + Math.random() * 40,
                    duration: 2000 + Math.random() * 3000,
                    volume: 0.03 + Math.random() * 0.02
                });
            },
            repeat: -1
        });

        // Insects/cricket sounds
        this.time.addEvent({
            delay: 3000 + Math.random() * 5000,
            callback: () => {
                if (!this.isGameActive) return;
                
                this.createProceduralSound('insect', {
                    frequency: 1200 + Math.random() * 800,
                    duration: 100 + Math.random() * 200,
                    volume: 0.04 + Math.random() * 0.02
                });
            },
            repeat: -1
        });
    }

    // ==== AAA AUDIO SYSTEM ====

    private audioSystem = {
        musicVolume: 0.6,
        sfxVolume: 0.8,
        ambientVolume: 0.4,
        backgroundMusic: null as Phaser.Sound.BaseSound | null,
        ambientSound: null as Phaser.Sound.BaseSound | null,
        currentMusicIntensity: 0.5,
        soundPool: new Map<string, Phaser.Sound.BaseSound[]>()
    };

    private initializeAdvancedAudioSystem() {
        // Start layered background music system
        this.startDynamicMusic();
        
        // Initialize ambient soundscape
        this.startAmbientSounds();
        
        // Pre-load sound effects pool for performance
        this.initializeSoundPool();
        
        // Set up dynamic audio mixing
        this.setupDynamicAudioMixing();
    }

    private startDynamicMusic() {
        // Main background music with dynamic layering
        this.audioSystem.backgroundMusic = this.sound.add('background', {
            volume: this.audioSystem.musicVolume,
            loop: true
        });
        
        this.audioSystem.backgroundMusic.play();
        
        // Add music intensity system
        this.updateMusicIntensity(0.3); // Start calm
    }

    private startAmbientSounds() {
        // Use only procedural ambient audio for better compatibility
        console.log('Using procedural ambient audio system for immersive experience');
        
        // Enhanced procedural nature sounds
        this.startProceduralAmbience();
        this.startAdvancedNatureSounds();
    }

    private initializeSoundPool() {
        // Pre-create sound instances for rapid-fire effects
        const soundTypes = ['success', 'hit'];
        
        soundTypes.forEach(soundType => {
            const pool: Phaser.Sound.BaseSound[] = [];
            for (let i = 0; i < 10; i++) {
                pool.push(this.sound.add(soundType, { volume: this.audioSystem.sfxVolume }));
            }
            this.audioSystem.soundPool.set(soundType, pool);
        });
    }

    private setupDynamicAudioMixing() {
        // React to game state changes for dynamic audio
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.updateAudioBasedOnGameState();
            },
            repeat: -1
        });
    }

    private updateAudioBasedOnGameState() {
        if (!this.isGameActive) return;
        
        // Calculate dynamic intensity based on threat level
        const beeCount = this.bees.filter(bee => bee.active).length;
        const threatLevel = Math.min(beeCount / 10, 1.0);
        const timeProgress = this.isDrawingPhase ? 0.3 : 0.8;
        
        const targetIntensity = Math.max(threatLevel, timeProgress);
        this.updateMusicIntensity(targetIntensity);
        
        // Adjust ambient sounds
        this.updateAmbientIntensity(targetIntensity);
    }

    private updateMusicIntensity(intensity: number) {
        if (!this.audioSystem.backgroundMusic) return;
        
        // Smooth intensity transition
        const smoothIntensity = Phaser.Math.Linear(
            this.audioSystem.currentMusicIntensity,
            intensity,
            0.05
        );
        
        this.audioSystem.currentMusicIntensity = smoothIntensity;
        
        // Adjust volume and pitch based on intensity
        const volume = this.audioSystem.musicVolume * (0.5 + smoothIntensity * 0.5);
        const rate = 0.9 + smoothIntensity * 0.2;
        
        try {
            (this.audioSystem.backgroundMusic as any).setVolume?.(volume);
            (this.audioSystem.backgroundMusic as any).setRate?.(rate);
        } catch (e) {
            // Fallback for different Phaser sound implementations
        }
    }

    private updateAmbientIntensity(intensity: number) {
        if (!this.audioSystem.ambientSound) return;
        
        const volume = this.audioSystem.ambientVolume * (1 - intensity * 0.3);
        try {
            (this.audioSystem.ambientSound as any).setVolume?.(volume);
        } catch (e) {
            // Fallback for different Phaser sound implementations
        }
    }

    private startProceduralAmbience() {
        // Generate procedural nature sounds
        this.time.addEvent({
            delay: 2000 + Math.random() * 3000,
            callback: () => {
                if (!this.isGameActive) return;
                
                // Random nature sounds using oscillator
                this.createProceduralSound('bird', {
                    frequency: 800 + Math.random() * 400,
                    duration: 200 + Math.random() * 300,
                    volume: 0.1 + Math.random() * 0.1
                });
            },
            repeat: -1
        });
        
        // Water ripple sounds
        this.time.addEvent({
            delay: 5000 + Math.random() * 5000,
            callback: () => {
                if (!this.isGameActive) return;
                
                this.createProceduralSound('water', {
                    frequency: 100 + Math.random() * 200,
                    duration: 500 + Math.random() * 500,
                    volume: 0.05 + Math.random() * 0.05
                });
            },
            repeat: -1
        });
    }

    private createProceduralSound(type: string, params: any) {
        // Create web audio oscillator for procedural sounds
        try {
            const audioContext = (this.sound as any).context;
            if (!audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(params.frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(params.volume, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + params.duration / 1000);
            
            if (type === 'bird') {
                oscillator.type = 'sine';
                // Add frequency modulation for bird-like chirp
                oscillator.frequency.linearRampToValueAtTime(
                    params.frequency * 1.5,
                    audioContext.currentTime + params.duration / 2000
                );
            } else if (type === 'water') {
                oscillator.type = 'triangle';
            }
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + params.duration / 1000);
        } catch (e) {
            // Fallback to basic sound if Web Audio API fails
            console.log('Procedural audio not available, using basic sounds');
        }
    }

    private playAdvancedSFX(soundType: string, options: any = {}) {
        const pool = this.audioSystem.soundPool.get(soundType);
        if (!pool) {
            // Fallback to direct sound play
            const sound = this.sound.add(soundType, {
                volume: this.audioSystem.sfxVolume * (options.volumeMultiplier || 1),
                rate: options.rate || 1,
                detune: options.detune || 0
            });
            sound.play();
            return;
        }
        
        // Use pooled sound for better performance
        const availableSound = pool.find(sound => !sound.isPlaying);
        if (availableSound) {
            try {
                (availableSound as any).setVolume?.(this.audioSystem.sfxVolume * (options.volumeMultiplier || 1));
                (availableSound as any).setRate?.(options.rate || 1);
                (availableSound as any).setDetune?.(options.detune || 0);
            } catch (e) {
                // Fallback for different Phaser sound implementations
            }
            availableSound.play();
        }
    }

    private createSpatialAudio(x: number, y: number, soundType: string, options: any = {}) {
        // Calculate 3D spatial audio effects
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        const distance = Phaser.Math.Distance.Between(x, y, centerX, centerY);
        const maxDistance = Math.max(this.scale.width, this.scale.height) / 2;
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // Distance attenuation
        const volumeMultiplier = (1 - normalizedDistance * 0.7) * (options.volumeMultiplier || 1);
        
        // Stereo panning
        const pan = (x - centerX) / centerX;
        
        this.playAdvancedSFX(soundType, {
            ...options,
            volumeMultiplier,
            pan: Math.max(-1, Math.min(1, pan))
        });
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
                    console.log("Switching to survival phase, spawning bees. Total barriers:", this.barriers.length);
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
                // Handle collision based on barrier type
                const collisionPoint = this.getCollisionPoint(bee.sprite.x, bee.sprite.y);
                this.handleBarrierCollision(bee, collisionPoint);
                
                // Bounce off barrier - try alternative path
                const bounceAngle = angle + Math.PI/3; // 60 degree deflection
                const bounceX = bee.sprite.x + Math.cos(bounceAngle) * bee.speed * 0.008;
                const bounceY = bee.sprite.y + Math.sin(bounceAngle) * bee.speed * 0.008;
                
                // Check if bounce path is clear
                if (!this.checkBarrierCollision(bounceX, bounceY)) {
                    bee.sprite.x = bounceX;
                    bee.sprite.y = bounceY;
                }
                // If bounce path is also blocked, bee stays in place this frame
            }
            
            // Check if bee reached capybara
            const distanceToCapybara = Phaser.Math.Distance.Between(
                bee.sprite.x, bee.sprite.y,
                this.capybara.x, this.capybara.y
            );
            
            // Check for shield protection first
            const shield = (this.capybara as any).shield;
            if (shield && shield.active && distanceToCapybara < shield.radius) {
                // Shield blocks the bee - bounce it away
                const bounceAngle = Math.atan2(bee.sprite.y - this.capybara.y, bee.sprite.x - this.capybara.x);
                bee.sprite.x = this.capybara.x + Math.cos(bounceAngle) * (shield.radius + 10);
                bee.sprite.y = this.capybara.y + Math.sin(bounceAngle) * (shield.radius + 10);
                return; // Don't check for capybara collision if shield blocked it
            }
            
            if (distanceToCapybara < 20) { // Much smaller detection radius
                this.endGame(false); // Capybara was caught!
            }
        });
    }

    private checkBarrierCollision(x: number, y: number): boolean {
        const checkRadius = 15; // Detection radius around bee position
        
        // Check against all drawn barrier line segments
        for (const segment of this.barrierPoints) {
            // Skip inactive segments (removed barriers)
            if (segment.active === false) continue;
            
            const distance = this.distanceToLineSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
            
            if (distance < checkRadius) {
                return true;
            }
        }
        return false;
    }

    private getCollisionPoint(beeX: number, beeY: number): {segment: any, distance: number} | null {
        const checkRadius = 15;
        let closestSegment = null;
        let closestDistance = Infinity;
        
        for (const segment of this.barrierPoints) {
            const distance = this.distanceToLineSegment(beeX, beeY, segment.x1, segment.y1, segment.x2, segment.y2);
            if (distance < checkRadius && distance < closestDistance) {
                closestDistance = distance;
                closestSegment = segment;
            }
        }
        
        return closestSegment ? { segment: closestSegment, distance: closestDistance } : null;
    }

    private handleBarrierCollision(bee: Bee, collision: {segment: any, distance: number} | null) {
        if (!collision) return;
        
        const segment = collision.segment;
        
        // Play hit sound
        if (this.sound.get('hit')) {
            this.sound.play('hit', { volume: 0.3 });
        }
        
        // Create particle effect for collision
        this.createCollisionParticles(bee.sprite.x, bee.sprite.y);
        
        // Handle special barrier behaviors
        switch (segment.type) {
            case 'temporary':
                // Temporary barriers disappear after being hit
                this.removeBarrierSegment(segment);
                break;
                
            case 'bouncy':
                // Bouncy barriers send bees flying in opposite direction
                const bounceAngle = Math.atan2(bee.sprite.y - segment.y1, bee.sprite.x - segment.x1);
                bee.sprite.x += Math.cos(bounceAngle) * 30;
                bee.sprite.y += Math.sin(bounceAngle) * 30;
                break;
                
            case 'explosive':
                // Explosive barriers destroy nearby bees
                this.explodeBarrier(segment);
                this.destroyNearbyBees(segment.x1, segment.y1, 80);
                this.removeBarrierSegment(segment);
                break;
                
            case 'normal':
            default:
                // Normal barriers just block
                break;
        }
    }

    private removeBarrierSegment(segmentToRemove: any) {
        // Remove from barrier points array
        const index = this.barrierPoints.indexOf(segmentToRemove);
        if (index > -1) {
            this.barrierPoints.splice(index, 1);
        }
        
        // Visual removal would require redrawing all barriers
        // For simplicity, we'll mark it as inactive
        segmentToRemove.active = false;
    }

    private explodeBarrier(segment: any) {
        // Create explosion effect
        for (let i = 0; i < 16; i++) {
            const particle = this.add.circle(segment.x1, segment.y1, 4, 0xff4444, 1);
            particle.setDepth(15);
            
            const angle = (i / 16) * Math.PI * 2;
            const speed = 80 + Math.random() * 60;
            
            this.tweens.add({
                targets: particle,
                x: segment.x1 + Math.cos(angle) * speed,
                y: segment.y1 + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0.1,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Play explosion sound
        if (this.sound.get('hit')) {
            this.sound.play('hit', { volume: 0.8 });
        }
    }

    private destroyNearbyBees(x: number, y: number, radius: number) {
        this.bees.forEach(bee => {
            if (!bee.active) return;
            
            const distance = Phaser.Math.Distance.Between(bee.sprite.x, bee.sprite.y, x, y);
            if (distance < radius) {
                // Destroy bee with explosion effect
                this.createCollisionParticles(bee.sprite.x, bee.sprite.y);
                bee.sprite.destroy();
                bee.active = false;
            }
        });
    }
    
    private distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            // Line segment is a point
            return Math.sqrt(A * A + B * B);
        }
        
        let param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
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

    private resize() {
        // Handle responsive resizing
        const { width, height } = this.scale;
        
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
        
        // Clean up input listeners
        this.input.off('pointerdown', this.startDrawing, this);
        this.input.off('pointermove', this.continueDrawing, this);
        this.input.off('pointerup', this.stopDrawing, this);
        this.input.keyboard?.off('keydown-SPACE');
        
        // Clean up game objects
        this.barriers.forEach(barrier => barrier.destroy());
        this.bees.forEach(bee => bee.sprite.destroy());
        this.powerUps.forEach(powerUp => powerUp.sprite.destroy());
        
        if (this.gameTimer) {
            this.gameTimer.destroy();
        }
        
        super.shutdown();
    }
}
