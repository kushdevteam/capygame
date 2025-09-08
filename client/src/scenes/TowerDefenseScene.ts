import Phaser from 'phaser';
import { useGameState } from '../lib/stores/useGameState';

interface CapybaraUnit {
    type: 'harvester' | 'thrower' | 'fire' | 'wall' | 'ninja' | 'queen';
    sprite: Phaser.GameObjects.Image;
    armor: number;
    damage: number;
    foodCost: number;
    range: number;
    action: (bees: BeeUnit[]) => void;
    place: TowerPlace;
    attackCooldown: number;
    maxCooldown: number;
}

interface BeeUnit {
    sprite: Phaser.GameObjects.Image;
    armor: number;
    maxArmor: number;
    speed: number;
    active: boolean;
    place: TowerPlace;
    targetPlace: TowerPlace | null;
    healthBar?: Phaser.GameObjects.Rectangle;
    healthBarBg?: Phaser.GameObjects.Rectangle;
    armorText?: Phaser.GameObjects.Text;
}

interface TowerPlace {
    name: string;
    x: number;
    y: number;
    entrance: TowerPlace | null;
    exit: TowerPlace | null;
    capybara: CapybaraUnit | null;
    bees: BeeUnit[];
    isWater: boolean;
}

export class TowerDefenseScene extends Phaser.Scene {
    private places: TowerPlace[] = [];
    private capybaras: CapybaraUnit[] = [];
    private bees: BeeUnit[] = [];
    private selectedCapybaraType: string | null = null;
    private food: number = 20;
    private turnNumber: number = 0;
    private isPlayerTurn: boolean = true;
    private turnTimer!: Phaser.Time.TimerEvent;
    private foodText!: Phaser.GameObjects.Text;
    private turnText!: Phaser.GameObjects.Text;
    private selectedText!: Phaser.GameObjects.Text;
    private gameActive: boolean = true;
    
    // Enhanced HUD elements
    private waveProgressBg!: Phaser.GameObjects.Rectangle;
    private waveProgressBar!: Phaser.GameObjects.Rectangle;
    private waveText!: Phaser.GameObjects.Text;
    private enemyCountText!: Phaser.GameObjects.Text;
    private defenderCountText!: Phaser.GameObjects.Text;
    private statusText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'TowerDefenseScene' });
    }

    preload() {
        // Load tunnel background image
        this.load.image('tunnelBackground', '/images/level_map_bg.png?v=2');
        
        // Load new generated capybara and bee sprites  
        this.load.image('capybaraSprite', '/attached_assets/generated_images/Enhanced_capybara_tower_sprite_7327b0ce.png');
        this.load.image('beeSprite', '/attached_assets/generated_images/Enhanced_bee_enemy_sprite_22f51e8a.png');
        this.load.image('leaf', '/images/enhanced_capybara.png?v=2');
        
        // Load colorful capybara tower types
        this.load.image('capybaraTowers', '/images/capybara_towers.png?v=2');
        
        // Load comprehensive audio library for AAA tower defense experience
        this.load.audio('background', '/sounds/background.mp3');
        this.load.audio('success', '/sounds/success.mp3');
        this.load.audio('hit', '/sounds/hit.mp3');
        
        // Note: Using procedural tactical ambient audio instead of file-based for better compatibility
    }

    create() {
        const { width, height } = this.scale;
        
        // Set enhanced background
        this.add.image(width/2, height/2, 'tunnelBackground').setDisplaySize(width, height).setDepth(-1);
        
        // Update game state for tower defense
        useGameState.getState().setScene('towerdefense');
        
        // Create places (tunnel system)
        this.createTunnelSystem();
        
        // Create UI
        this.createUI();
        
        // Create control panel
        this.createControlPanel();
        
        // Handle input
        this.setupInput();
        
        // Initialize AAA audio system for tower defense
        this.initializeAdvancedAudioSystem();
        
        // Start turn timer
        this.startTurn();
        
        this.gameActive = true;
    }

    private createTunnelSystem() {
        // AAA-Quality path that perfectly follows the background
        const pathPoints = [
            { x: 90, y: this.scale.height * 0.65 },   // Base position (bottom left)
            { x: 200, y: this.scale.height * 0.50 },  // First curve up 
            { x: 320, y: this.scale.height * 0.32 },  // Top plateau start
            { x: 450, y: this.scale.height * 0.30 },  // Top plateau middle
            { x: 580, y: this.scale.height * 0.48 },  // Descending curve
            { x: 700, y: this.scale.height * 0.65 },  // Bottom curve
            { x: 820, y: this.scale.height * 0.70 },  // Lowest point
            { x: 950, y: this.scale.height * 0.60 },  // Rising again
            { x: 1080, y: this.scale.height * 0.45 }, // Final ascent
            { x: 1200, y: this.scale.height * 0.32 }, // Hive position (top right)
        ];
        
        const placeWidth = 80;
        let previousPlace: TowerPlace | null = null;
        
        // Create places along the winding path
        for (let i = 0; i < pathPoints.length; i++) {
            const point = pathPoints[i];
            const x = point.x;
            const y = point.y;
            const isWater = i >= 3 && i <= 5; // Water sections in middle curve
            
            const place: TowerPlace = {
                name: i === 0 ? 'base' : i === pathPoints.length - 1 ? 'hive' : `path_${i}`,
                x,
                y,
                entrance: null, // Will be set when creating next place
                exit: previousPlace,
                capybara: null,
                bees: [],
                isWater
            };

            if (previousPlace) {
                previousPlace.entrance = place;
            }

            // Professional placement indicators - subtle glow
            const marker = this.add.circle(x, y, 18, isWater ? 0x3498db : 0x2ecc71, 0.05)
                .setStrokeStyle(1, isWater ? 0x85c1e9 : 0x58d68d, 0.3)
                .setDepth(1);
                
            // Add subtle pulsing effect to show interactivity
            this.tweens.add({
                targets: marker,
                alpha: 0.1,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            this.places.push(place);
            previousPlace = place;
        }

        // Base and hive are already included in the pathPoints as first and last
        // Add visual markers for base and hive
        const base = this.places[0];
        const hive = this.places[this.places.length - 1];
        
        // Professional base marker with glow
        const baseBg = this.add.rectangle(base.x, base.y, 45, 28, 0x2ecc71, 0.8)
            .setStrokeStyle(2, 0x27ae60)
            .setDepth(2);
        this.add.circle(base.x, base.y, 25, 0x2ecc71, 0.2).setDepth(1); // Glow
        this.add.text(base.x, base.y, '🏠', { fontSize: '18px' }).setOrigin(0.5).setDepth(3);
        
        // Professional hive marker with glow
        const hiveBg = this.add.rectangle(hive.x, hive.y, 45, 28, 0xf1c40f, 0.8)
            .setStrokeStyle(2, 0xe67e22)
            .setDepth(2);
        this.add.circle(hive.x, hive.y, 25, 0xf1c40f, 0.2).setDepth(1); // Glow
        this.add.text(hive.x, hive.y, '🍯', { fontSize: '18px' }).setOrigin(0.5).setDepth(3);
        
        // Add subtle animations to markers
        this.tweens.add({
            targets: [baseBg, hiveBg],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    private createUI() {
        // Enhanced HUD with detailed stats
        const topBarHeight = 60;
        const topBar = this.add.rectangle(this.scale.width/2, topBarHeight/2, this.scale.width, topBarHeight, 0x1a252f, 0.95)
            .setStrokeStyle(2, 0x2c5aa0, 0.8)
            .setDepth(25);
            
        // Add top glow
        this.add.rectangle(this.scale.width/2, topBarHeight, this.scale.width, 2, 0x3498db, 0.6).setDepth(24);

        // Professional exit button
        const exitBtn = this.add.rectangle(60, 20, 80, 28, 0xe74c3c, 0.9)
            .setInteractive()
            .setDepth(26)
            .setStrokeStyle(2, 0xc0392b)
            .on('pointerdown', () => {
                // Add click animation
                this.tweens.add({
                    targets: exitBtn,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => this.scene.start('MenuScene')
                });
            });
        
        this.add.text(60, 20, '← Menu', {
            fontSize: '12px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(27);

        // Enhanced stats display
        const statsX = 250;
        
        // Wave counter with progress
        this.add.text(statsX, 15, '🌊 Wave Progress', {
            fontSize: '12px',
            color: '#3498db',
            fontStyle: 'bold'
        }).setDepth(26);
        
        // Wave progress bar background
        this.waveProgressBg = this.add.rectangle(statsX + 100, 15, 120, 8, 0x2c3e50, 1).setDepth(25);
        this.waveProgressBar = this.add.rectangle(statsX + 40, 15, 40, 6, 0x3498db, 1).setDepth(26);
        
        this.waveText = this.add.text(statsX + 200, 15, `${this.turnNumber}/10`, {
            fontSize: '11px',
            color: '#ecf0f1'
        }).setDepth(26);

        // Enemy count 
        this.add.text(statsX, 35, '🐝 Active Enemies', {
            fontSize: '12px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setDepth(26);
        
        this.enemyCountText = this.add.text(statsX + 130, 35, `${this.bees.length}`, {
            fontSize: '12px',
            color: '#ff6b6b',
            fontStyle: 'bold'
        }).setDepth(26);

        // Capybara count
        this.add.text(statsX, 50, '🦫 Defenders', {
            fontSize: '12px', 
            color: '#27ae60',
            fontStyle: 'bold'
        }).setDepth(26);
        
        this.defenderCountText = this.add.text(statsX + 100, 50, `${this.capybaras.length}`, {
            fontSize: '12px',
            color: '#2ecc71',
            fontStyle: 'bold'
        }).setDepth(26);

        // Game status
        this.statusText = this.add.text(this.scale.width - 150, 30, 'Battle Active', {
            fontSize: '14px',
            color: '#f39c12',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(26);

        // Add hover effect to exit button
        exitBtn.on('pointerover', () => {
            this.tweens.add({
                targets: exitBtn,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        exitBtn.on('pointerout', () => {
            this.tweens.add({
                targets: exitBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 150
            });
        });
    }

    private updateHUD() {
        // Update wave progress
        if (this.waveText) {
            this.waveText.setText(`${this.turnNumber}/10`);
        }
        
        if (this.waveProgressBar) {
            const progress = Math.min(this.turnNumber / 10, 1);
            this.waveProgressBar.width = 120 * progress;
        }

        // Update enemy count
        if (this.enemyCountText) {
            this.enemyCountText.setText(`${this.bees.length}`);
        }

        // Update defender count
        if (this.defenderCountText) {
            this.defenderCountText.setText(`${this.capybaras.length}`);
        }

        // Update game status
        if (this.statusText) {
            if (this.bees.length === 0) {
                this.statusText.setText('Wave Clear!').setColor('#27ae60');
            } else if (this.bees.length > 5) {
                this.statusText.setText('Under Attack!').setColor('#e74c3c');
            } else {
                this.statusText.setText('Battle Active').setColor('#f39c12');
            }
        }
    }

    private createControlPanel() {
        // SIMPLE CLEAN DESIGN - No fancy effects, just working UI
        const panelHeight = 80;
        const panelY = this.scale.height - panelHeight/2;
        
        // Simple solid background
        this.add.rectangle(this.scale.width/2, panelY, this.scale.width, panelHeight, 0x2c3e50, 1)
            .setDepth(10);

        // Left info section
        const infoX = 70;
        
        // Food display
        this.add.text(20, panelY - 15, 'Food:', {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setDepth(11);
        
        this.foodText = this.add.text(70, panelY - 15, `${this.food}`, {
            fontSize: '14px',
            color: '#f39c12',
            fontStyle: 'bold'
        }).setDepth(11);
        
        // Turn counter
        this.add.text(20, panelY + 5, `Turn: ${this.turnNumber}`, {
            fontSize: '12px',
            color: '#3498db',
            fontStyle: 'bold'
        }).setDepth(11);

        // Selection feedback
        this.selectedText = this.add.text(20, panelY - 30, 'Choose Capybara:', {
            fontSize: '11px',
            color: '#ecf0f1'
        }).setDepth(11);

        // Simple button layout
        const capybaraTypes = [
            { type: 'harvester', cost: 2, color: 0x2ecc71, name: 'Farm', icon: '🌱' },
            { type: 'thrower', cost: 3, color: 0xe74c3c, name: 'Shoot', icon: '🎯' },
            { type: 'fire', cost: 5, color: 0xe67e22, name: 'Fire', icon: '🔥' },
            { type: 'wall', cost: 4, color: 0x8b4513, name: 'Wall', icon: '🛡️' },
            { type: 'ninja', cost: 5, color: 0x9b59b6, name: 'Fast', icon: '🥷' },
            { type: 'queen', cost: 7, color: 0xf1c40f, name: 'Queen', icon: '👑' }
        ];

        const startX = 200;
        const spacing = 120;

        capybaraTypes.forEach((capyType, index) => {
            const x = startX + index * spacing;
            const y = panelY;
            const affordable = this.food >= capyType.cost;

            // Simple button
            const btn = this.add.rectangle(x, y, 100, 60, affordable ? 0x34495e : 0x7f8c8d, 1)
                .setStrokeStyle(2, affordable ? capyType.color : 0x95a5a6)
                .setInteractive()
                .setDepth(11);

            // Icon and name
            this.add.text(x, y - 12, capyType.icon, { 
                fontSize: '16px' 
            }).setOrigin(0.5).setDepth(12);
            
            this.add.text(x, y + 5, capyType.name, {
                fontSize: '10px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(12);
            
            this.add.text(x, y + 18, `${capyType.cost} food`, {
                fontSize: '9px',
                color: '#f39c12'
            }).setOrigin(0.5).setDepth(12);

            // Simple click handler
            btn.on('pointerdown', () => {
                if (affordable) {
                    this.selectedCapybaraType = capyType.type;
                    this.selectedText.setText(`${capyType.icon} ${capyType.name} selected!`);
                    btn.setStrokeStyle(3, 0x2ecc71);
                } else {
                    this.showMessage(`Need ${capyType.cost} food!`, '#e74c3c');
                }
            });
        });
    }

    private updateControlPanelDisplay() {
        // Simply update the food text - don't recreate the entire panel
        if (this.foodText) {
            this.foodText.setText(`${this.food}`);
        }
        // Note: Card affordability updates handled in game loop, not here
    }

    private setupInput() {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.selectedCapybaraType) {
                // Check if clicking on existing capybara to show its range
                const clickedPlace = this.places.find(place => {
                    const distance = Phaser.Math.Distance.Between(
                        pointer.x, pointer.y, place.x, place.y
                    );
                    return distance < 40 && place.capybara;
                });

                if (clickedPlace && clickedPlace.capybara) {
                    this.showCapybaraRange(clickedPlace.capybara);
                }
                return;
            }

            // Find clicked place on path (excluding base and hive)
            const clickedPlace = this.places.find(place => {
                const distance = Phaser.Math.Distance.Between(
                    pointer.x, pointer.y, place.x, place.y
                );
                return distance < 40 && !place.name.includes('base') && !place.name.includes('hive');
            });

            if (clickedPlace && !clickedPlace.capybara) {
                this.deployCapybara(clickedPlace, this.selectedCapybaraType);
            }
        });
    }

    private showCapybaraRange(capybara: CapybaraUnit) {
        // Clear existing range indicator
        if ((capybara as any).rangeIndicator) {
            (capybara as any).rangeIndicator.destroy();
        }

        const range = capybara.range || 60;
        
        const rangeIndicator = this.add.circle(capybara.place.x, capybara.place.y, range, 0x00ff00, 0.1)
            .setStrokeStyle(2, 0x00ff00, 0.5)
            .setDepth(1);

        (capybara as any).rangeIndicator = rangeIndicator;

        // Auto-hide after 3 seconds
        this.time.delayedCall(3000, () => {
            if (rangeIndicator) {
                rangeIndicator.destroy();
                (capybara as any).rangeIndicator = null;
            }
        });
    }

    private deployCapybara(place: TowerPlace, type: string) {
        const capybaraData = this.getCapybaraData(type);
        
        if (this.food < capybaraData.foodCost) {
            this.showMessage('Not enough food!', '#FF0000');
            return;
        }

        // Check if water-safe
        if (place.isWater && !capybaraData.isWaterSafe) {
            this.showMessage('This capybara cannot survive in water!', '#FF0000');
            return;
        }

        this.food -= capybaraData.foodCost;
        this.foodText.setText(`${this.food}`);
        this.updateControlPanelDisplay();

        // Create advanced capybara sprite with animations
        const sprite = this.createAdvancedCapybaraSprite(place.x, place.y, capybaraData, type) as any;

        const capybara: CapybaraUnit = {
            type: type as any,
            sprite,
            armor: capybaraData.armor,
            damage: capybaraData.damage,
            foodCost: capybaraData.foodCost,
            range: capybaraData.range,
            action: capybaraData.action,
            place,
            attackCooldown: 0,
            maxCooldown: 60 // 1 second at 60fps
        };

        place.capybara = capybara;
        this.capybaras.push(capybara);

        // Show range indicator temporarily
        this.showCapybaraRange(capybara);

        this.selectedCapybaraType = null;
        this.selectedText.setText('Selected: None');
        this.showMessage(`${type} deployed!`, '#00FF00');
    }

    private getCapybaraData(type: string) {
        const data: { [key: string]: any } = {
            harvester: {
                armor: 2,
                damage: 0,
                foodCost: 2,
                range: 0,
                color: 0x90EE90,
                isWaterSafe: false,
                description: "Generates +2 food per turn",
                specialAbility: "Economy Boost",
                action: () => {
                    this.food += 2;
                    this.foodText.setText(`Food: ${this.food}`);
                    this.createHarvestEffect();
                }
            },
            thrower: {
                armor: 1,
                damage: 2,
                foodCost: 3,
                range: 150,
                color: 0xFFB6C1,
                isWaterSafe: false,
                description: "Throws leaves at bees",
                specialAbility: "Leaf Storm",
                action: (bees: BeeUnit[]) => this.advancedThrowAttack(bees)
            },
            fire: {
                armor: 3,
                damage: 4,
                foodCost: 5,
                range: 80,
                color: 0xFF4500,
                isWaterSafe: false,
                description: "Explodes when destroyed",
                specialAbility: "Flame Burst",
                action: (bees: BeeUnit[]) => this.advancedFireAttack(bees)
            },
            wall: {
                armor: 8,
                damage: 0,
                foodCost: 4,
                range: 0,
                color: 0x8B4513,
                isWaterSafe: false,
                description: "High armor defender",
                specialAbility: "Fortress",
                action: () => {
                    this.createWallPulse();
                }
            },
            ninja: {
                armor: 1,
                damage: 3,
                foodCost: 5,
                range: 100,
                color: 0x800080,
                isWaterSafe: false,
                description: "Invisible attacks, bees can't attack back",
                specialAbility: "Shadow Strike",
                action: (bees: BeeUnit[]) => this.advancedNinjaAttack(bees)
            },
            queen: {
                armor: 2,
                damage: 2,
                foodCost: 7,
                range: 120,
                color: 0xFFD700,
                isWaterSafe: true,
                description: "Boosts nearby capybaras +100% damage",
                specialAbility: "Royal Command",
                action: (bees: BeeUnit[]) => {
                    this.advancedQueenAttack(bees);
                    this.advancedBoostNearbyCapybaras();
                }
            }
        };
        return data[type];
    }

    private throwAt(bees: BeeUnit[]) {
        // Find nearest bee
        const nearestBee = this.findNearestBee(bees);
        if (nearestBee) {
            this.createLeafProjectile(nearestBee);
            this.damageBee(nearestBee, 1);
        }
    }

    private fireAttack(bees: BeeUnit[]) {
        // Fire capybara attacks all bees in its place
        const fireCapybara = this.capybaras.find(c => c.type === 'fire');
        if (fireCapybara && fireCapybara.place) {
            // Create fire explosion effect
            this.createFireExplosion(fireCapybara.place.x, fireCapybara.place.y);
            
            fireCapybara.place.bees.forEach(bee => {
                this.createBurnEffect(bee.sprite.x, bee.sprite.y);
                this.damageBee(bee, 3);
            });
        }
    }

    private ninjaAttack(bees: BeeUnit[]) {
        // Ninja attacks all bees in range without being blocked
        const ninja = this.capybaras.find(c => c.type === 'ninja');
        if (ninja) {
            // Teleport strike effect
            this.createNinjaTeleportEffect(ninja.place.x, ninja.place.y);
            
            ninja.place.bees.forEach(bee => {
                this.createShadowStrike(bee.sprite.x, bee.sprite.y);
                this.damageBee(bee, 2);
            });
        }
    }

    private boostNearbyCapybaras() {
        // Queen boosts damage of nearby capybaras
        const queen = this.capybaras.find(c => c.type === 'queen');
        if (queen) {
            this.capybaras.forEach(capybara => {
                if (capybara !== queen) {
                    const distance = Phaser.Math.Distance.Between(
                        capybara.place.x, capybara.place.y,
                        queen.place.x, queen.place.y
                    );
                    if (distance < 150) {
                        capybara.damage = Math.max(capybara.damage, 2);
                        capybara.sprite.setTint(0xFFD700); // Golden tint
                    }
                }
            });
        }
    }

    private findNearestBee(bees: BeeUnit[]): BeeUnit | null {
        // Find the bee closest to the end of the tunnel
        let nearestBee: BeeUnit | null = null;
        let minDistance = Infinity;

        bees.forEach(bee => {
            if (bee.active) {
                // Distance from bee to end of tunnel (left side)
                const distance = bee.place.x;
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestBee = bee;
                }
            }
        });

        return nearestBee;
    }

    private createLeafProjectile(target: BeeUnit) {
        // Simple leaf animation
        const leaf = this.add.circle(target.place.x - 30, target.place.y, 3, 0x228B22);
        this.tweens.add({
            targets: leaf,
            x: target.place.x,
            y: target.place.y,
            duration: 200,
            onComplete: () => {
                leaf.destroy();
                this.createHitEffect(target.place.x, target.place.y);
            }
        });
    }

    private createHitEffect(x: number, y: number) {
        const particles = [];
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(x, y, 2, 0xFFFF00);
            particles.push(particle);
            this.tweens.add({
                targets: particle,
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                alpha: 0,
                duration: 300,
                onComplete: () => particle.destroy()
            });
        }
    }

    private destroyBee(bee: BeeUnit) {
        bee.active = false;
        
        // Destroy health bar elements
        if (bee.healthBar) bee.healthBar.destroy();
        if (bee.healthBarBg) bee.healthBarBg.destroy();
        if (bee.armorText) bee.armorText.destroy();
        
        // Create death effect with explosion
        this.createDeathExplosion(bee.sprite.x, bee.sprite.y);
        
        bee.sprite.destroy();
        const index = this.bees.indexOf(bee);
        if (index > -1) {
            this.bees.splice(index, 1);
        }
        if (bee.place) {
            const beeIndex = bee.place.bees.indexOf(bee);
            if (beeIndex > -1) {
                bee.place.bees.splice(beeIndex, 1);
            }
        }
    }

    private damageBee(bee: BeeUnit, damage: number) {
        bee.armor -= damage;
        
        // Show damage number
        this.showDamageNumber(bee.sprite.x, bee.sprite.y, damage);
        
        // Update health bar
        this.updateBeeHealthBar(bee);
        
        // Update armor text
        if (bee.armorText) {
            bee.armorText.setText(`♥${Math.max(0, bee.armor)}`);
        }
        
        // Check if bee dies
        if (bee.armor <= 0) {
            this.destroyBee(bee);
        }
    }

    private showDamageNumber(x: number, y: number, damage: number) {
        const damageText = this.add.text(x, y, `-${damage}`, {
            fontSize: '12px',
            color: '#ff4500',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);
        
        this.tweens.add({
            targets: damageText,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }

    private updateBeeHealthBar(bee: BeeUnit) {
        if (bee.healthBar && bee.maxArmor > 0) {
            const healthPercent = bee.armor / bee.maxArmor;
            const newWidth = 28 * Math.max(0, healthPercent);
            bee.healthBar.width = newWidth;
            
            // Change color based on health
            if (healthPercent > 0.6) {
                bee.healthBar.fillColor = 0x00ff00; // Green
            } else if (healthPercent > 0.3) {
                bee.healthBar.fillColor = 0xffff00; // Yellow  
            } else {
                bee.healthBar.fillColor = 0xff0000; // Red
            }
        }
    }

    private createDeathExplosion(x: number, y: number) {
        // Main explosion effect
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, 0xffaa00, 1).setDepth(15);
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 50 + Math.random() * 30;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Central flash
        const flash = this.add.circle(x, y, 15, 0xffffff, 1).setDepth(14);
        this.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
    }

    private spawnBees() {
        const hive = this.places.find(p => p.name === 'hive');
        if (!hive) return;
        
        const beesToSpawn = Math.min(1 + Math.floor(this.turnNumber / 3), 4);
        
        for (let i = 0; i < beesToSpawn; i++) {
            const bee = this.createBee(hive);
            this.bees.push(bee);
            hive.bees.push(bee);
        }
    }

    private createBee(place: TowerPlace): BeeUnit {
        // Use new generated bee sprite - properly sized for gameplay
        const sprite = this.add.image(place.x, place.y, 'beeSprite')
            .setScale(0.05)
            .setDepth(2);
        
        // Add wing flutter animation - properly scaled for smaller sprites
        this.tweens.add({
            targets: sprite,
            scaleX: 0.045,
            scaleY: 0.055,
            duration: 150,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        const armor = 1 + Math.floor(this.turnNumber / 3);
        
        // Create health bar background
        const healthBarBg = this.add.rectangle(place.x, place.y - 25, 30, 6, 0x000000, 0.8).setDepth(3);
        
        // Create health bar
        const healthBar = this.add.rectangle(place.x, place.y - 25, 28, 4, 0x00ff00, 1).setDepth(4);
        
        // Armor indicator
        const armorText = this.add.text(place.x, place.y - 35, `♥${armor}`, {
            fontSize: '8px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(4);

        return {
            sprite,
            armor: armor,
            maxArmor: armor,
            speed: 1,
            active: true,
            place,
            targetPlace: place.exit,
            healthBar,
            healthBarBg,
            armorText
        };
    }

    private startTurn() {
        this.turnNumber++;
        
        // Enhanced turn announcement with wave info
        const turnAnnouncement = this.add.text(this.scale.width/2, 200, `🌊 WAVE ${this.turnNumber}`, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#3498db',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(20);
        
        // Add pulsing effect to announcement
        this.tweens.add({
            targets: turnAnnouncement,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 300,
            yoyo: true,
            repeat: 1
        });

        // Remove turn indicator after 1.5 seconds
        this.time.delayedCall(1500, () => {
            turnAnnouncement.destroy();
        });
        
        // Spawn bees at start of turn
        this.spawnBees();
        
        // Run capybara actions first
        this.runCapybaraActions();
        
        // Update control panel and HUD
        this.updateControlPanelDisplay();
        this.updateHUD();
        
        // Then move bees
        this.time.delayedCall(500, () => {
            this.runBeeActions();
        });
        
        // Update HUD periodically during turn
        this.time.delayedCall(1500, () => {
            this.updateHUD();
        });
        
        // Start next turn
        this.time.delayedCall(3000, () => {
            if (this.gameActive) {
                this.startTurn();
            }
        });
    }

    private runCapybaraActions() {
        // Capybaras act first (like original game)
        this.capybaras.forEach(capybara => {
            if (capybara.type === 'harvester') {
                this.food += 1;
                this.foodText.setText(`${this.food}`);
            } else if (capybara.type === 'thrower') {
                this.throwAt(this.bees);
            } else if (capybara.type === 'fire') {
                this.fireAttack(this.bees);
            } else if (capybara.type === 'ninja') {
                this.ninjaAttack(this.bees);
            } else if (capybara.type === 'queen') {
                this.throwAt(this.bees);
                this.boostNearbyCapybaras();
            }
        });
    }

    private runBeeActions() {
        // Move all bees towards the exit
        this.bees.forEach(bee => {
            if (bee.active) {
                this.moveBee(bee);
            }
        });

        // Check win/lose conditions
        this.checkGameEnd();
    }

    private moveBee(bee: BeeUnit) {
        if (!bee.targetPlace) {
            // Bee reached the end - game over!
            this.endGame(false);
            return;
        }

        // Check if blocked by capybara (except ninja)
        if (bee.place.capybara && bee.place.capybara.type !== 'ninja') {
            // Bee attacks capybara
            bee.place.capybara.armor--;
            this.createHitEffect(bee.place.x, bee.place.y);
            this.showDamageNumber(bee.place.x, bee.place.y - 10, 1);
            
            if (bee.place.capybara.armor <= 0) {
                this.destroyCapybara(bee.place.capybara);
            }
            return; // Bee doesn't move this turn
        }

        // Move bee to next place (towards exit)
        bee.place.bees = bee.place.bees.filter(b => b !== bee);
        bee.place = bee.targetPlace;
        bee.targetPlace = bee.place.exit;
        bee.place.bees.push(bee);

        // Animate movement and health elements
        this.tweens.add({
            targets: bee.sprite,
            x: bee.place.x,
            y: bee.place.y,
            duration: 400, // Faster movement
            ease: 'Power2'
        });
        
        // Move health elements with bee
        if (bee.healthBar && bee.healthBarBg && bee.armorText) {
            this.tweens.add({
                targets: [bee.healthBar, bee.healthBarBg],
                x: bee.place.x,
                y: bee.place.y - 25,
                duration: 400,
                ease: 'Power2'
            });
            
            this.tweens.add({
                targets: bee.armorText,
                x: bee.place.x,
                y: bee.place.y - 35,
                duration: 400,
                ease: 'Power2'
            });
        }
    }

    private destroyCapybara(capybara: CapybaraUnit) {
        capybara.sprite.destroy();
        capybara.place.capybara = null;
        const index = this.capybaras.indexOf(capybara);
        if (index > -1) {
            this.capybaras.splice(index, 1);
        }
    }

    private checkGameEnd() {
        // Win if all bees are destroyed and no more coming
        if (this.bees.length === 0 && this.turnNumber >= 10) {
            this.endGame(true);
        }
        
        // Lose if any bee reaches the end (handled in moveBee)
    }

    private endGame(won: boolean) {
        this.gameActive = false;
        
        const message = won ? 'Victory! Capybaras defended successfully!' : 'Defeat! The bees have invaded!';
        const color = won ? '#00FF00' : '#FF0000';
        
        this.add.text(400, 300, message, {
            fontSize: '32px',
            color: color,
            backgroundColor: '#FFFFFF',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(20);

        this.add.text(400, 350, 'Press R to return to menu', {
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(20);

        this.input.keyboard?.on('keydown-R', () => {
            this.scene.start('MenuScene');
        });
    }

    private showMessage(text: string, color: string) {
        const message = this.add.text(400, 400, text, {
            fontSize: '20px',
            color: color,
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(15);

        this.time.delayedCall(2000, () => {
            message.destroy();
        });
    }

    update() {
        // Update cooldowns and animations
        this.capybaras.forEach(capybara => {
            if (capybara.attackCooldown > 0) {
                capybara.attackCooldown--;
            }
            
            // Update health bars
            const healthBar = capybara.sprite.getData('healthBar');
            if (healthBar) {
                const healthPercent = capybara.armor / this.getCapybaraData(capybara.type).armor;
                healthBar.setDisplaySize(30 * healthPercent, 4);
                healthBar.setFillStyle(healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000);
            }
        });
    }

    // ==== AAA TOWER DEFENSE METHODS ====

    private createAdvancedCapybaraSprite(x: number, y: number, capybaraData: any, type: string): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);
        
        // Use new generated capybara sprite - properly sized for gameplay
        const body = this.add.image(0, 0, 'capybaraSprite').setScale(0.04).setTint(capybaraData.color).setDepth(3);
        const highlight = this.add.circle(0, -5, 12, 0xffffff, 0.2).setDepth(4);
        
        // Type-specific visual effects
        const effect = this.createCapybaraTypeEffect(type);
        
        // Health bar background
        const healthBg = this.add.rectangle(0, -35, 30, 4, 0x444444).setDepth(5);
        const healthBar = this.add.rectangle(0, -35, 30, 4, 0x00ff00).setDepth(6);
        
        // Add components to container
        container.add([body, highlight, effect, healthBg, healthBar]);
        container.setData('healthBar', healthBar);
        container.setData('body', body);
        container.setDepth(3);
        
        // Breathing animation
        this.tweens.add({
            targets: body,
            scaleX: 1.05,
            scaleY: 0.95,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Type-specific idle animations
        this.addCapybaraIdleAnimation(container, type);
        
        return container;
    }

    private createCapybaraTypeEffect(type: string): Phaser.GameObjects.Graphics {
        const effect = this.add.graphics();
        
        switch (type) {
            case 'harvester':
                // Golden aura
                effect.lineStyle(2, 0xffd700, 0.5);
                effect.strokeCircle(0, 0, 25);
                break;
            case 'thrower':
                // Leaf particles
                effect.fillStyle(0x22c55e, 0.6);
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const x = Math.cos(angle) * 30;
                    const y = Math.sin(angle) * 30;
                    effect.fillCircle(x, y, 2);
                }
                break;
            case 'fire':
                // Fire aura
                effect.fillStyle(0xff4500, 0.3);
                effect.fillCircle(0, 0, 35);
                break;
            case 'wall':
                // Shield effect
                effect.lineStyle(3, 0x8b4513, 0.8);
                effect.strokeRect(-25, -25, 50, 50);
                break;
            case 'ninja':
                // Shadow effect
                effect.fillStyle(0x000000, 0.3);
                effect.fillCircle(0, 0, 30);
                break;
            case 'queen':
                // Royal crown
                effect.fillStyle(0xffd700, 1);
                effect.fillTriangle(-8, -25, 0, -35, 8, -25);
                break;
        }
        
        return effect;
    }

    private addCapybaraIdleAnimation(container: Phaser.GameObjects.Container, type: string) {
        switch (type) {
            case 'harvester':
                // Gentle bobbing
                this.tweens.add({
                    targets: container,
                    y: container.y - 3,
                    duration: 1500,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
            case 'ninja':
                // Fade in/out (stealth)
                this.tweens.add({
                    targets: container,
                    alpha: 0.7,
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
            case 'queen':
                // Majestic glow pulse
                this.tweens.add({
                    targets: container,
                    scale: 1.1,
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
        }
    }

    private advancedThrowAttack(bees: BeeUnit[]) {
        const nearestBee = this.findNearestBee(bees);
        if (nearestBee) {
            // Multi-shot attack
            for (let i = 0; i < 3; i++) {
                this.time.delayedCall(i * 100, () => {
                    this.createAdvancedLeafProjectile(nearestBee, 2);
                });
            }
        }
    }

    private advancedFireAttack(bees: BeeUnit[]) {
        // Create fire explosion effect
        const fireCapy = this.capybaras.find(c => c.type === 'fire');
        if (fireCapy) {
            this.createFireExplosion(fireCapy.place.x, fireCapy.place.y);
            
            // Damage all bees in range
            this.bees.forEach(bee => {
                const distance = Phaser.Math.Distance.Between(
                    bee.sprite.x, bee.sprite.y,
                    fireCapy.place.x, fireCapy.place.y
                );
                
                if (distance < 80) {
                    this.damageBee(bee, 4);
                    this.createBurnEffect(bee.sprite.x, bee.sprite.y);
                }
            });
        }
    }

    private advancedNinjaAttack(bees: BeeUnit[]) {
        const ninja = this.capybaras.find(c => c.type === 'ninja');
        if (ninja) {
            // Teleport strike effect
            this.createNinjaTeleportEffect(ninja.place.x, ninja.place.y);
            
            // Attack all bees in range with shadow clones
            ninja.place.bees.forEach(bee => {
                this.damageBee(bee, 3);
                this.createShadowStrike(bee.sprite.x, bee.sprite.y);
            });
        }
    }

    private advancedQueenAttack(bees: BeeUnit[]) {
        const queen = this.capybaras.find(c => c.type === 'queen');
        if (queen) {
            // Royal command - coordinated attack
            this.createRoyalCommand(queen.place.x, queen.place.y);
            
            const nearestBee = this.findNearestBee(this.bees);
            if (nearestBee) {
                // Queen's powerful attack
                this.createAdvancedLeafProjectile(nearestBee, 3, true);
            }
        }
    }

    private advancedBoostNearbyCapybaras() {
        const queen = this.capybaras.find(c => c.type === 'queen');
        if (!queen) return;
        
        this.capybaras.forEach(capybara => {
            if (capybara === queen) return;
            
            const distance = Phaser.Math.Distance.Between(
                capybara.place.x, capybara.place.y,
                queen.place.x, queen.place.y
            );
            
            if (distance < 120) {
                // Visual boost effect
                this.createBoostEffect(capybara.place.x, capybara.place.y);
                
                // Double damage for boosted capybaras
                capybara.damage = Math.max(capybara.damage * 2, capybara.damage + 2);
                
                // Golden tint for boosted units
                const body = capybara.sprite.getData('body');
                if (body) {
                    this.tweens.add({
                        targets: body,
                        tint: 0xffd700,
                        duration: 200,
                        yoyo: true,
                        repeat: 3
                    });
                }
            }
        });
    }

    private createHarvestEffect() {
        // Golden coin particles
        for (let i = 0; i < 5; i++) {
            const coin = this.add.circle(
                this.scale.width * 0.2 + Math.random() * 100,
                100 + Math.random() * 50,
                3,
                0xffd700,
                0.8
            ).setDepth(15);
            
            this.tweens.add({
                targets: coin,
                y: 50,
                alpha: 0,
                duration: 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => coin.destroy()
            });
        }
    }

    private createWallPulse() {
        const walls = this.capybaras.filter(c => c.type === 'wall');
        walls.forEach(wall => {
            const pulse = this.add.circle(wall.place.x, wall.place.y, 30, 0x8b4513, 0.3).setDepth(2);
            
            this.tweens.add({
                targets: pulse,
                scale: 2,
                alpha: 0,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => pulse.destroy()
            });
        });
    }

    private createAdvancedLeafProjectile(target: BeeUnit, damage: number, isRoyal: boolean = false) {
        const startX = target.place.x - 40;
        const startY = target.place.y;
        
        const leaf = this.add.ellipse(startX, startY, 8, 4, isRoyal ? 0xffd700 : 0x22c55e).setDepth(8);
        
        this.tweens.add({
            targets: leaf,
            x: target.sprite.x,
            y: target.sprite.y,
            rotation: Math.PI * 2,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                leaf.destroy();
                this.damageBee(target, damage);
                this.createLeafImpact(target.sprite.x, target.sprite.y);
            }
        });
    }

    private createFireExplosion(x: number, y: number) {
        // Central explosion
        const explosion = this.add.circle(x, y, 5, 0xff4500, 1).setDepth(10);
        
        this.tweens.add({
            targets: explosion,
            scale: 8,
            alpha: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => explosion.destroy()
        });
        
        // Fire particles
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const particle = this.add.circle(x, y, 2, 0xff6b00, 0.8).setDepth(9);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 60,
                y: y + Math.sin(angle) * 60,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    private createBurnEffect(x: number, y: number) {
        const burn = this.add.circle(x, y, 4, 0xff4500, 0.8).setDepth(9);
        
        this.tweens.add({
            targets: burn,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => burn.destroy()
        });
    }

    private createNinjaTeleportEffect(x: number, y: number) {
        // Smoke cloud
        const smoke = this.add.circle(x, y, 20, 0x444444, 0.6).setDepth(8);
        
        this.tweens.add({
            targets: smoke,
            scale: 2,
            alpha: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => smoke.destroy()
        });
    }

    private createShadowStrike(x: number, y: number) {
        const strike = this.add.line(x, y, 0, -20, 0, 20, 0x800080).setDepth(9);
        strike.setLineWidth(3);
        
        this.tweens.add({
            targets: strike,
            alpha: 0,
            scaleX: 3,
            duration: 200,
            ease: 'Cubic.easeOut',
            onComplete: () => strike.destroy()
        });
    }

    private createRoyalCommand(x: number, y: number) {
        const command = this.add.star(x, y - 30, 6, 8, 15, 0xffd700).setDepth(10);
        
        this.tweens.add({
            targets: command,
            scale: 2,
            alpha: 0,
            rotation: Math.PI,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => command.destroy()
        });
    }

    private createBoostEffect(x: number, y: number) {
        const boost = this.add.circle(x, y - 20, 10, 0xffd700, 0.6).setDepth(9);
        
        this.tweens.add({
            targets: boost,
            scale: 2,
            alpha: 0,
            y: y - 40,
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => boost.destroy()
        });
    }

    private createLeafImpact(x: number, y: number) {
        // Impact burst
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const particle = this.add.circle(x, y, 2, 0x22c55e, 0.8).setDepth(9);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 20,
                y: y + Math.sin(angle) * 20,
                alpha: 0,
                duration: 300,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    // ==== AAA AUDIO SYSTEM FOR TOWER DEFENSE ====

    private audioSystem = {
        musicVolume: 0.5,
        sfxVolume: 0.7,
        ambientVolume: 0.3,
        backgroundMusic: null as Phaser.Sound.BaseSound | null,
        ambientSound: null as Phaser.Sound.BaseSound | null,
        currentMusicIntensity: 0.5,
        soundPool: new Map<string, Phaser.Sound.BaseSound[]>()
    };

    private initializeAdvancedAudioSystem() {
        // Start strategic background music
        this.startStrategicMusic();
        
        // Initialize battle ambient sounds
        this.startBattleAmbience();
        
        // Pre-load tactical sound effects
        this.initializeTacticalSoundPool();
        
        // Set up dynamic battle audio
        this.setupBattleAudioMixing();
    }

    private startStrategicMusic() {
        this.audioSystem.backgroundMusic = this.sound.add('background', {
            volume: this.audioSystem.musicVolume,
            loop: true,
            rate: 0.9 // Slightly slower for strategic feel
        });
        
        this.audioSystem.backgroundMusic.play();
        this.updateMusicIntensity(0.4); // Start strategic and calm
    }

    private startBattleAmbience() {
        // Use only procedural tactical audio for better compatibility
        console.log('Using procedural tactical audio system for strategic atmosphere');
        
        // Enhanced tactical ambience
        this.startTacticalAmbience();
        this.startBattleAtmosphere();
    }

    private initializeTacticalSoundPool() {
        const tacticalSounds = ['success', 'hit'];
        
        tacticalSounds.forEach(soundType => {
            const pool: Phaser.Sound.BaseSound[] = [];
            for (let i = 0; i < 15; i++) { // Larger pool for rapid combat
                pool.push(this.sound.add(soundType, { volume: this.audioSystem.sfxVolume }));
            }
            this.audioSystem.soundPool.set(soundType, pool);
        });
    }

    private setupBattleAudioMixing() {
        this.time.addEvent({
            delay: 800,
            callback: () => {
                this.updateBattleAudio();
            },
            repeat: -1
        });
    }

    private updateBattleAudio() {
        if (!this.gameActive) return;
        
        // Calculate battle intensity
        const beeCount = this.bees.length;
        const capybaraCount = this.capybaras.length;
        const turnIntensity = this.isPlayerTurn ? 0.3 : 0.7;
        const unitRatio = Math.min(beeCount / Math.max(capybaraCount, 1), 2.0) * 0.3;
        
        const battleIntensity = Math.min(turnIntensity + unitRatio, 1.0);
        this.updateMusicIntensity(battleIntensity);
        this.updateBattleAmbience(battleIntensity);
    }

    private updateMusicIntensity(intensity: number) {
        if (!this.audioSystem.backgroundMusic) return;
        
        const smoothIntensity = Phaser.Math.Linear(
            this.audioSystem.currentMusicIntensity,
            intensity,
            0.03
        );
        
        this.audioSystem.currentMusicIntensity = smoothIntensity;
        
        const volume = this.audioSystem.musicVolume * (0.6 + smoothIntensity * 0.4);
        const rate = 0.85 + smoothIntensity * 0.3;
        
        try {
            (this.audioSystem.backgroundMusic as any).setVolume?.(volume);
            (this.audioSystem.backgroundMusic as any).setRate?.(rate);
        } catch (e) {
            // Fallback for different Phaser sound implementations
        }
    }

    private updateBattleAmbience(intensity: number) {
        if (!this.audioSystem.ambientSound) return;
        
        const volume = this.audioSystem.ambientVolume * (0.8 + intensity * 0.4);
        try {
            (this.audioSystem.ambientSound as any).setVolume?.(volume);
        } catch (e) {
            // Fallback for different Phaser sound implementations
        }
    }

    private startTacticalAmbience() {
        // Generate strategic planning sounds
        this.time.addEvent({
            delay: 3000 + Math.random() * 4000,
            callback: () => {
                if (!this.gameActive) return;
                
                if (this.isPlayerTurn) {
                    this.createProceduralTacticalSound('planning', {
                        frequency: 200 + Math.random() * 100,
                        duration: 400 + Math.random() * 200,
                        volume: 0.05 + Math.random() * 0.03
                    });
                }
            },
            repeat: -1
        });

        // Battle tension sounds
        this.time.addEvent({
            delay: 1500 + Math.random() * 2000,
            callback: () => {
                if (!this.gameActive || this.isPlayerTurn) return;
                
                this.createProceduralTacticalSound('tension', {
                    frequency: 80 + Math.random() * 120,
                    duration: 800 + Math.random() * 400,
                    volume: 0.03 + Math.random() * 0.02
                });
            },
            repeat: -1
        });
    }

    private createProceduralTacticalSound(type: string, params: any) {
        try {
            const audioContext = (this.sound as any).context;
            if (!audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'planning') {
                oscillator.type = 'sawtooth';
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
            } else if (type === 'tension') {
                oscillator.type = 'triangle';
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(400, audioContext.currentTime);
            }
            
            oscillator.frequency.setValueAtTime(params.frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(params.volume, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + params.duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + params.duration / 1000);
        } catch (e) {
            console.log('Tactical audio not available, using basic sounds');
        }
    }

    private playTacticalSFX(soundType: string, options: any = {}) {
        const pool = this.audioSystem.soundPool.get(soundType);
        if (!pool) {
            const sound = this.sound.add(soundType, {
                volume: this.audioSystem.sfxVolume * (options.volumeMultiplier || 1),
                rate: options.rate || 1,
                detune: options.detune || 0
            });
            sound.play();
            return;
        }
        
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

    private createTacticalSpatialAudio(x: number, y: number, soundType: string, options: any = {}) {
        const centerX = this.scale.width / 2;
        const distance = Math.abs(x - centerX) / centerX;
        const volumeMultiplier = (1 - distance * 0.4) * (options.volumeMultiplier || 1);
        
        const pan = (x - centerX) / centerX;
        
        this.playTacticalSFX(soundType, {
            ...options,
            volumeMultiplier,
            pan: Math.max(-0.8, Math.min(0.8, pan))
        });
    }

    private startBattleAtmosphere() {
        // Strategic war room ambience
        this.time.addEvent({
            delay: 10000 + Math.random() * 15000,
            callback: () => {
                if (!this.gameActive) return;
                
                this.createProceduralTacticalSound('war_room', {
                    frequency: 40 + Math.random() * 30,
                    duration: 3000 + Math.random() * 2000,
                    volume: 0.02 + Math.random() * 0.01
                });
            },
            repeat: -1
        });

        // Tactical communication sounds
        this.time.addEvent({
            delay: 15000 + Math.random() * 20000,
            callback: () => {
                if (!this.gameActive) return;
                
                this.createProceduralTacticalSound('communication', {
                    frequency: 300 + Math.random() * 200,
                    duration: 150 + Math.random() * 100,
                    volume: 0.03 + Math.random() * 0.01
                });
            },
            repeat: -1
        });
    }
}