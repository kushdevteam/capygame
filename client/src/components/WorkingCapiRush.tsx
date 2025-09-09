import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, ArrowLeft, Heart, Zap, Play, Pause, RotateCcw } from 'lucide-react';

interface WorkingCapiRushProps {
  onBackToMenu?: () => void;
}

interface GameStats {
  score: number;
  highScore: number;
  gamesPlayed: number;
}

export const WorkingCapiRush: React.FC<WorkingCapiRushProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('capirush-stats');
    return saved ? JSON.parse(saved) : {
      score: 0,
      highScore: 0,
      gamesPlayed: 0
    };
  });
  
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(50);
  const [gameLevel, setGameLevel] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [touchControls, setTouchControls] = useState({
    left: false,
    right: false,
    jump: false,
    slide: false
  });
  
  // AI-generated game images
  const [gameImages, setGameImages] = useState<{[key: string]: HTMLImageElement}>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Audio system
  const audioRef = useRef<{[key: string]: HTMLAudioElement}>({});
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  
  // Game state
  // Achievement checking function
  const checkAchievements = (stats: any) => {
    const newAchievements: string[] = [];
    
    if (stats.gamesPlayed >= 1 && !achievements.includes('first_game')) {
      newAchievements.push('first_game');
    }
    if (stats.highScore >= 500 && !achievements.includes('score_500')) {
      newAchievements.push('score_500');
    }
    if (stats.highScore >= 1000 && !achievements.includes('score_1000')) {
      newAchievements.push('score_1000');
    }
    if (stats.coinsCollected >= 100 && !achievements.includes('coins_100')) {
      newAchievements.push('coins_100');
    }
    if (stats.gamesPlayed >= 10 && !achievements.includes('veteran')) {
      newAchievements.push('veteran');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      localStorage.setItem('achievements', JSON.stringify([...achievements, ...newAchievements]));
      playSound('levelUp');
    }
  };

  const gameState = useRef({
    player: { 
      x: 100, y: 420, width: 40, height: 30, vy: 0, onGround: true,
      speed: 5, doubleJumpAvailable: false, isSliding: false
    },
    obstacles: [
      { x: 600, y: 420, width: 30, height: 30, color: '#FF0000', type: 'normal', passed: false, vy: 0 },
      { x: 800, y: 420, width: 30, height: 30, color: '#00FF00', type: 'normal', passed: false, vy: 0 }
    ],
    powerUps: [] as any[],
    coins: [] as any[],
    score: 0,
    coins_collected: 0,
    combo: 0,
    combo_multiplier: 1,
    keys: {} as { [key: string]: boolean },
    effects: {
      speedBoost: 0,
      invincibility: 0,
      coinMagnet: 0,
      doubleJump: false,
      // New power-ups
      shield: 0,
      coinMultiplier: { active: false, multiplier: 1, duration: 0 },
      slowMotion: 0,
      dash: 0,
      tripleJump: 0
    },
    particles: [] as any[],
    // Enhanced game features
    gameSpeed: 1,
    difficultyLevel: 1,
    weatherEffects: [] as any[],
    screenShake: { intensity: 0, duration: 0 },
    capybaraTrail: [] as any[],
    miniBoss: null as any,
    dailyChallenge: {
      type: 'score', // 'score', 'coins', 'survive'
      target: 500,
      progress: 0,
      completed: false
    }
  });

  // Enhanced mobile detection for Telegram and other mobile apps
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|Telegram/i.test(navigator.userAgent) || 
                           window.innerWidth <= 768 ||
                           'ontouchstart' in window ||
                           (window as any).TelegramWebApp ||
                           navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice);
      
      // Initialize Telegram WebApp if available
      if ((window as any).TelegramWebApp) {
        (window as any).TelegramWebApp.ready();
        (window as any).TelegramWebApp.MainButton.hide();
        (window as any).TelegramWebApp.expand();
        
        // Force image reload in Telegram WebView
        setTimeout(() => {
          const images = Object.values(gameImages);
          images.forEach(img => {
            if (img && img.src) {
              const newSrc = img.src + '?t=' + Date.now();
              img.src = newSrc;
            }
          });
        }, 1000);
      }
      
      // Prevent zoom on mobile
      if (isMobileDevice) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        } else {
          const newViewport = document.createElement('meta');
          newViewport.name = 'viewport';
          newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
          document.head.appendChild(newViewport);
        }
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [gameImages]);

  // Load AI-generated game images
  useEffect(() => {
    const loadImages = async () => {
      const imageUrls = {
        capybara: '/images/Professional_capybara_character_sprite_01f56ee3.png',
        background: '/images/Mystical_forest_game_background_58a2540a.png',
        coin: '/images/Golden_capybara_cryptocurrency_coin_d8288b6d.png',
        spikeTrap: '/images/Spike_trap_obstacle_43af5d9b.png',
        energyBarrier: '/images/Energy_barrier_obstacle_3387a6c8.png',
        tree: '/images/Detailed_game_tree_sprite_15e5af21.png',
        grass: '/images/Seamless_grass_texture_c8a63111.png',
        // New power-ups
        shield: '/images/Shield_power-up_icon_ee2ffa1a.png',
        coinMultiplier: '/images/Coin_multiplier_power-up_62305235.png',
        slowMotion: '/images/Slow_motion_power-up_48d17cd8.png',
        dash: '/images/Dash_teleport_power-up_d5d37feb.png',
        tripleJump: '/images/Triple_jump_power-up_d04468b7.png',
        // Visual effects
        miniBoss: '/images/Forest_mini-boss_enemy_e80d2b41.png',
        leaves: '/images/Magical_falling_leaves_5c09b3db.png',
        trail: '/images/Energy_trail_effect_880ef858.png',
        achievements: '/images/Achievement_badges_collection_7fcc51e5.png'
      };

      const loadedImages: {[key: string]: HTMLImageElement} = {};
      const promises = Object.entries(imageUrls).map(([key, url]) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedImages[key] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load ${key} image`);
            resolve(); // Continue even if image fails to load
          };
          img.src = url;
        });
      });

      await Promise.all(promises);
      setGameImages(loadedImages);
      setImagesLoaded(true);
      console.log('Images loaded successfully:', Object.keys(loadedImages));
    };

    loadImages();
  }, []);

  // Enhanced Audio system initialization
  useEffect(() => {
    if (!audioEnabled) return;

    // Initialize audio context and sounds
    const initAudio = () => {
      try {
        // Create audio elements for sound effects with real audio files
        const sounds = {
          jump: new Audio('/sounds/success.mp3'),
          coin: new Audio('/sounds/success.mp3'), 
          powerup: new Audio('/sounds/success.mp3'),
          hit: new Audio('/sounds/hit.mp3'),
          slide: new Audio('/sounds/hit.mp3'),
          shield: new Audio('/sounds/success.mp3'),
          speedBoost: new Audio('/sounds/success.mp3'),
          magnet: new Audio('/sounds/success.mp3'),
          slowMotion: new Audio('/sounds/ambient-loop.mp3'),
          dash: new Audio('/sounds/success.mp3'),
          tripleJump: new Audio('/sounds/success.mp3'),
          gameOver: new Audio('/sounds/hit.mp3'),
          levelUp: new Audio('/sounds/success.mp3'),
          combo: new Audio('/sounds/success.mp3')
        };

        Object.entries(sounds).forEach(([key, audio]) => {
          audio.volume = soundVolume / 100;
          audio.preload = 'auto';
          audioRef.current[key] = audio;
        });

        // Background music with real audio file
        backgroundMusicRef.current = new Audio('/sounds/background.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = musicVolume / 100;
        backgroundMusicRef.current.preload = 'auto';
        
        // Auto-play background music when game starts
        if (isGameRunning && backgroundMusicRef.current && !backgroundMusicRef.current.currentTime) {
          backgroundMusicRef.current.play().catch(e => console.warn('Background music autoplay blocked:', e));
        }
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    initAudio();
  }, [audioEnabled, soundVolume, musicVolume]);

  // Enhanced sound effect player
  const playSound = (soundName: string, volumeOverride?: number) => {
    if (!audioEnabled || !audioRef.current[soundName]) return;
    try {
      const audio = audioRef.current[soundName];
      audio.currentTime = 0;
      if (volumeOverride !== undefined) {
        audio.volume = volumeOverride / 100;
      } else {
        audio.volume = soundVolume / 100;
      }
      audio.play().catch(e => console.warn('Sound play failed:', e));
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  };

  // Background music controls
  const toggleBackgroundMusic = () => {
    if (!backgroundMusicRef.current) return;
    
    if (backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.play().catch(e => console.warn('Music play failed:', e));
    } else {
      backgroundMusicRef.current.pause();
    }
  };

  const updateAudioVolumes = () => {
    // Update background music volume
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume / 100;
    }
    
    // Update sound effects volumes
    Object.values(audioRef.current).forEach((audio: any) => {
      if (audio && audio.volume !== undefined) {
        audio.volume = soundVolume / 100;
      }
    });
  };

  // Update volumes when they change
  useEffect(() => {
    updateAudioVolumes();
  }, [musicVolume, soundVolume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isGameRunning) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with screen shake effect
    canvas.width = 800;
    canvas.height = 500;
    
    // Apply screen shake
    let shakeX = 0, shakeY = 0;
    if (gameState.current.screenShake.duration > 0) {
      shakeX = (Math.random() - 0.5) * gameState.current.screenShake.intensity;
      shakeY = (Math.random() - 0.5) * gameState.current.screenShake.intensity;
      gameState.current.screenShake.duration--;
    }
    ctx.translate(shakeX, shakeY);

    // Helper functions for drawing
    const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 0.5, y, size * 0.8, 0, Math.PI * 2);
      ctx.arc(x + size * 1.2, y, size * 0.7, 0, Math.PI * 2);
      ctx.arc(x + size * 1.8, y, size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCapybara = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
      const animOffset = Math.sin(Date.now() / 200) * 1;
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x + width/2, y + height + 2, width/2 - 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Use AI-generated capybara sprite if loaded (flipped to face right)
      if (gameImages.capybara && imagesLoaded) {
        ctx.save();
        // Flip horizontally to face right
        ctx.scale(-1, 1);
        // Create a temporary canvas to process the image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Draw the image to temp canvas
        tempCtx.drawImage(gameImages.capybara, 0, 0, width, height);
        
        // Get image data and make white pixels transparent
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1]; 
          const b = data[i + 2];
          
          // If pixel is mostly white/light (more aggressive), make it transparent
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; // Set alpha to 0
          }
        }
        
        // Put the processed image data back
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the processed image
        ctx.drawImage(tempCanvas, -x - width, y + animOffset);
        ctx.restore();
      } else {
        // Fallback simple capybara
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(x, y + animOffset, width, height);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + width - 8, y + 5 + animOffset, 2, 2);
        ctx.fillRect(x + width - 4, y + 5 + animOffset, 2, 2);
      }
    };

    const drawPowerUp = (ctx: CanvasRenderingContext2D, x: number, y: number, type: string) => {
      const size = 20;
      const glow = Math.sin(Date.now() / 300) * 0.3 + 0.7;
      const float = Math.sin(Date.now() / 400) * 2;
      
      ctx.save();
      ctx.translate(x + size/2, y + size/2 + float);
      
      if (type === 'speed') {
        // Lightning Speed Boost
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12 * glow;
        
        const speedGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        speedGradient.addColorStop(0, '#FFFF99');
        speedGradient.addColorStop(0.6, '#FFD700');
        speedGradient.addColorStop(1, '#DAA520');
        ctx.fillStyle = speedGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Lightning bolt shape
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(-3, -6);
        ctx.lineTo(2, -2);
        ctx.lineTo(-1, 0);
        ctx.lineTo(4, 6);
        ctx.lineTo(-2, 2);
        ctx.lineTo(1, 0);
        ctx.closePath();
        ctx.fill();
        
        // Electric sparks
        for (let i = 0; i < 3; i++) {
          const angle = (Date.now() / 200 + i * 2) % (Math.PI * 2);
          const sparkX = Math.cos(angle) * 12;
          const sparkY = Math.sin(angle) * 12;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
        
      } else if (type === 'shield') {
        // Protective Shield
        ctx.shadowColor = '#4169E1';
        ctx.shadowBlur = 12 * glow;
        
        const shieldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        shieldGradient.addColorStop(0, '#87CEEB');
        shieldGradient.addColorStop(0.6, '#4169E1');
        shieldGradient.addColorStop(1, '#191970');
        ctx.fillStyle = shieldGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield symbol
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.quadraticCurveTo(-6, -2, -6, 2);
        ctx.quadraticCurveTo(-3, 6, 0, 6);
        ctx.quadraticCurveTo(3, 6, 6, 2);
        ctx.quadraticCurveTo(6, -2, 0, -6);
        ctx.fill();
        
        // Cross design
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(-1, -4, 2, 8);
        ctx.fillRect(-4, -1, 8, 2);
        
      } else if (type === 'jump') {
        // Double Jump
        ctx.shadowColor = '#32CD32';
        ctx.shadowBlur = 12 * glow;
        
        const jumpGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        jumpGradient.addColorStop(0, '#98FB98');
        jumpGradient.addColorStop(0.6, '#32CD32');
        jumpGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = jumpGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Double arrow
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(-3, -3);
        ctx.lineTo(-1, -3);
        ctx.lineTo(-1, -1);
        ctx.lineTo(1, -1);
        ctx.lineTo(1, -3);
        ctx.lineTo(3, -3);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, -1);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-1, 3);
        ctx.lineTo(-1, 5);
        ctx.lineTo(1, 5);
        ctx.lineTo(1, 3);
        ctx.lineTo(3, 3);
        ctx.closePath();
        ctx.fill();
        
      } else if (type === 'magnet') {
        // Coin Magnet
        ctx.shadowColor = '#FF1493';
        ctx.shadowBlur = 12 * glow;
        
        const magnetGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        magnetGradient.addColorStop(0, '#FFB6C1');
        magnetGradient.addColorStop(0.6, '#FF1493');
        magnetGradient.addColorStop(1, '#C71585');
        ctx.fillStyle = magnetGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Magnet shape
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-5, -6, 3, 8);
        ctx.fillRect(2, -6, 3, 8);
        ctx.fillRect(-5, -6, 10, 3);
        
        // Magnetic field lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, 8 + i * 2, -Math.PI/3, -2*Math.PI/3, true);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 8 + i * 2, Math.PI/3, 2*Math.PI/3);
          ctx.stroke();
        }
        
        // Attracted coin particles
        for (let i = 0; i < 2; i++) {
          const angle = Date.now() / 500 + i * Math.PI;
          const coinX = Math.cos(angle) * 15;
          const coinY = Math.sin(angle) * 15;
          ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
          ctx.beginPath();
          ctx.arc(coinX, coinY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    };

    const drawCoin = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const spin = (Date.now() / 100) % (Math.PI * 2);
      const coinScale = Math.abs(Math.cos(spin));
      const glow = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      
      ctx.save();
      ctx.translate(x + 10, y + 10);
      ctx.scale(coinScale, 1);
      
      // Use AI-generated coin image if available
      if (gameImages.coin && imagesLoaded) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12 * glow;
        
        // Process image to remove white background
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = 30;
        tempCanvas.height = 30;
        
        // Draw the coin image
        tempCtx.drawImage(gameImages.coin, 0, 0, 30, 30);
        
        // Get image data and make white/light pixels transparent
        const imageData = tempCtx.getImageData(0, 0, 30, 30);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1]; 
          const b = data[i + 2];
          
          // If pixel is light/white (aggressive threshold), make it transparent
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; // Set alpha to 0
          }
        }
        
        // Put the processed image data back
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the processed transparent coin
        ctx.drawImage(tempCanvas, -15, -15);
        
        // Add sparkle effects
        if (Math.random() < 0.3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(-6 + Math.random() * 12, -6 + Math.random() * 12, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Fallback to original coin drawing
        // Coin shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 12, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer coin ring with glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8 * glow;
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 9);
        outerGradient.addColorStop(0, '#FFF8DC');
        outerGradient.addColorStop(0.7, '#FFD700');
        outerGradient.addColorStop(1, '#DAA520');
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner coin
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 6);
        innerGradient.addColorStop(0, '#FFFF99');
        innerGradient.addColorStop(0.8, '#FFA500');
        innerGradient.addColorStop(1, '#FF8C00');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // CAPY symbol
        ctx.fillStyle = '#8B4513';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('C', 0, 2);
        
        // Sparkle effects
        if (Math.random() < 0.3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(-6 + Math.random() * 12, -6 + Math.random() * 12, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: any) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      if (particle.type === 'sparkle') {
        // Sparkling particle effect
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add cross sparkle effect
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.size * 2, particle.y);
        ctx.lineTo(particle.x + particle.size * 2, particle.y);
        ctx.moveTo(particle.x, particle.y - particle.size * 2);
        ctx.lineTo(particle.x, particle.y + particle.size * 2);
        ctx.stroke();
      } else if (particle.type === 'explosion') {
        // Explosion particle
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard rectangular particle
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
      
      ctx.restore();
    };

    const drawObstacle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, type: string = 'normal') => {
      const pulse = Math.sin(Date.now() / 300) * 0.1 + 1;
      
      // Use AI-generated obstacle images if available
      if (type === 'spike' && gameImages.spikeTrap && imagesLoaded) {
        ctx.drawImage(gameImages.spikeTrap, x, y, width, height);
        return;
      } else if (type === 'energy' && gameImages.energyBarrier && imagesLoaded) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.drawImage(gameImages.energyBarrier, x, y, width, height);
        ctx.restore();
        return;
      }
      
      if (color === '#FF0000') {
        // Mystical Red Crystal
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        ctx.scale(pulse, pulse);
        
        // Crystal shadow
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.fillRect(-width/2, height/2 - 2, width, 4);
        
        // Main crystal body
        const crystalGradient = ctx.createLinearGradient(-width/2, -height/2, width/2, height/2);
        crystalGradient.addColorStop(0, '#FF6B6B');
        crystalGradient.addColorStop(0.5, '#FF0000');
        crystalGradient.addColorStop(1, '#8B0000');
        ctx.fillStyle = crystalGradient;
        
        // Crystal shape
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(width/3, -height/4);
        ctx.lineTo(width/2, height/4);
        ctx.lineTo(0, height/2);
        ctx.lineTo(-width/2, height/4);
        ctx.lineTo(-width/3, -height/4);
        ctx.closePath();
        ctx.fill();
        
        // Crystal highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(-width/4, -height/3);
        ctx.lineTo(-width/6, -height/4);
        ctx.lineTo(-width/8, -height/6);
        ctx.closePath();
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
      } else if (color === '#00FF00') {
        // Enchanted Tree
        ctx.save();
        ctx.translate(x + width/2, y + height);
        
        // Tree shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 0, width/2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Trunk with bark texture
        const trunkGradient = ctx.createLinearGradient(-4, 0, 4, 0);
        trunkGradient.addColorStop(0, '#8B4513');
        trunkGradient.addColorStop(0.5, '#A0522D');
        trunkGradient.addColorStop(1, '#654321');
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(-4, -height + 8, 8, height - 8);
        
        // Foliage layers with gradient
        const foliageGradient = ctx.createRadialGradient(0, -height + 10, 0, 0, -height + 10, width/2);
        foliageGradient.addColorStop(0, '#90EE90');
        foliageGradient.addColorStop(0.7, '#32CD32');
        foliageGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = foliageGradient;
        
        // Main foliage clusters
        ctx.beginPath();
        ctx.arc(-4, -height + 12, width/3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -height + 8, width/3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -height + 5, width/2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Mystical glow particles
        ctx.fillStyle = 'rgba(144, 238, 144, 0.6)';
        for (let i = 0; i < 3; i++) {
          const angle = (Date.now() / 1000 + i) * 2;
          const orbX = Math.cos(angle) * (width/4);
          const orbY = -height/2 + Math.sin(angle * 2) * 8;
          ctx.beginPath();
          ctx.arc(orbX, orbY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
        
      } else {
        // Magical Water Stone
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        ctx.scale(pulse, pulse);
        
        // Stone shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, height/2 - 2, width/2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Main stone body with gradient
        const stoneGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width/2);
        stoneGradient.addColorStop(0, '#87CEEB');
        stoneGradient.addColorStop(0.6, '#4169E1');
        stoneGradient.addColorStop(1, '#191970');
        ctx.fillStyle = stoneGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Stone texture spots
        ctx.fillStyle = 'rgba(25, 25, 112, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-width/4, -height/4, width/6, height/6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width/6, height/6, width/8, height/8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Water-like shimmer effect
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const shimmer = Math.sin(Date.now() / 200) * 0.3;
        ctx.moveTo(-width/3 + shimmer * 5, -height/4);
        ctx.quadraticCurveTo(0, -height/6, width/3 + shimmer * 5, -height/4);
        ctx.stroke();
        
        // Magical aura
        ctx.shadowColor = '#4169E1';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#6495ED';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, width/2 + 2, height/2 + 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      }
    };

    // Input handlers  
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.current.keys[e.key.toLowerCase()] = true;
      
      // Jump or double jump
      if (e.key.toLowerCase() === 'w' || e.key === ' ') {
        handleJump();
      }
      
      // Sliding
      if (e.key.toLowerCase() === 's' || e.code === 'ArrowDown') {
        handleSlideStart();
      }
      
      e.preventDefault();
    };

    const handleJump = () => {
      if (gameState.current.player.onGround) {
        gameState.current.player.vy = -12;
        gameState.current.player.onGround = false;
        gameState.current.player.doubleJumpAvailable = gameState.current.effects.doubleJump;
      } else if (gameState.current.player.doubleJumpAvailable) {
        gameState.current.player.vy = -10;
        gameState.current.player.doubleJumpAvailable = false;
        // Add double jump particles
        for (let i = 0; i < 5; i++) {
          gameState.current.particles.push({
            x: gameState.current.player.x + Math.random() * 40,
            y: gameState.current.player.y + 30,
            size: 3,
            color: '#32CD32',
            alpha: 1,
            vy: Math.random() * 3 + 1,
            life: 30
          });
        }
      }
    };

    const handleSlideStart = () => {
      gameState.current.player.isSliding = true;
    };

    const handleSlideEnd = () => {
      gameState.current.player.isSliding = false;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.current.keys[e.key.toLowerCase()] = false;
      
      // Stop sliding
      if (e.key.toLowerCase() === 's' || e.code === 'ArrowDown') {
        handleSlideEnd();
      }
      
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const render = () => {
      if (isPaused) {
        gameLoopRef.current = requestAnimationFrame(render);
        return;
      }

      const state = gameState.current;

      // Draw AI-generated mystical forest background
      if (gameImages.background && imagesLoaded) {
        ctx.drawImage(gameImages.background, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback gradient background
        const forestGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        forestGradient.addColorStop(0, '#2D5016');
        forestGradient.addColorStop(0.3, '#1F5151');
        forestGradient.addColorStop(0.6, '#345041');
        forestGradient.addColorStop(1, '#1B263B');
        ctx.fillStyle = forestGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Trees removed per user request

      // Add mystical floating lights
      ctx.fillStyle = '#7FB069';
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 12; i++) {
        const x = (i * 70 + Math.sin(Date.now() / 1500 + i) * 30) % canvas.width;
        const y = 80 + Math.sin(Date.now() / 1200 + i * 1.5) * 40;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(Date.now() / 800 + i) * 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw grass texture floor
      if (gameImages.grass && imagesLoaded) {
        // Use generated grass texture
        const pattern = ctx.createPattern(gameImages.grass, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 450, canvas.width, 50);
        }
      } else {
        // Fallback to clean forest floor
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(0, 450, canvas.width, 50);
        
        // Add simple grass texture
        ctx.fillStyle = '#3D5A3B';
        for (let i = 0; i < canvas.width; i += 6) {
          const grassHeight = 2 + Math.sin(i * 0.1) * 1;
          ctx.fillRect(i, 450, 3, grassHeight);
        }
      }
      
      // Add mystical forest details - glowing mushrooms and plants
      ctx.fillStyle = '#7FB069';
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < canvas.width; i += 25) {
        const x = i + Math.sin(Date.now() / 2000 + i) * 2;
        // Small glowing plants
        ctx.fillRect(x, 450 + Math.random() * 10, 3, 8);
        if (i % 60 === 0) {
          // Glowing mushrooms
          ctx.fillStyle = '#FFD23F';
          ctx.beginPath();
          ctx.arc(x, 455, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#7FB069';
        }
      }
      ctx.globalAlpha = 1;

      // Update player physics
      if (!state.player.onGround) {
        state.player.vy += 0.8; // gravity
        state.player.y += state.player.vy;
        
        if (state.player.y >= 420) {
          state.player.y = 420;
          state.player.vy = 0;
          state.player.onGround = true;
        }
      }

      // Progressive difficulty system
      const newDifficultyLevel = Math.floor(state.score / 500) + 1;
      if (newDifficultyLevel !== state.difficultyLevel) {
        state.difficultyLevel = newDifficultyLevel;
        state.gameSpeed = Math.min(1 + (newDifficultyLevel - 1) * 0.3, 3);
        playSound('levelUp');
        
        // Add level up celebration particles
        for (let i = 0; i < 20; i++) {
          state.particles.push({
            x: state.player.x + 20,
            y: state.player.y + 15,
            size: 6,
            color: '#FFD700',
            alpha: 1,
            vy: (Math.random() - 0.5) * 8,
            life: 80
          });
        }
      }

      // Update power-up effects with enhanced logic
      if (state.effects.speedBoost > 0) state.effects.speedBoost--;
      if (state.effects.invincibility > 0) state.effects.invincibility--;
      if (state.effects.coinMagnet > 0) state.effects.coinMagnet--;
      if (state.effects.shield > 0) state.effects.shield--;
      if (state.effects.slowMotion > 0) state.effects.slowMotion--;
      if (state.effects.dash > 0) state.effects.dash--;
      if (state.effects.tripleJump > 0) state.effects.tripleJump--;
      if (state.effects.coinMultiplier.active && state.effects.coinMultiplier.duration > 0) {
        state.effects.coinMultiplier.duration--;
        if (state.effects.coinMultiplier.duration <= 0) {
          state.effects.coinMultiplier.active = false;
          state.effects.coinMultiplier.multiplier = 1;
        }
      }

      // Player movement with speed boost (keyboard + touch)
      const moveSpeed = state.effects.speedBoost > 0 ? 8 : 5;
      if (state.keys['a'] || state.keys['arrowleft'] || touchControls.left) {
        state.player.x = Math.max(0, state.player.x - moveSpeed);
      }
      if (state.keys['d'] || state.keys['arrowright'] || touchControls.right) {
        state.player.x = Math.min(canvas.width - state.player.width, state.player.x + moveSpeed);
      }

      // Adjust player size when sliding
      const playerHeight = state.player.isSliding ? 15 : 30;
      const playerY = state.player.isSliding ? state.player.y + 15 : state.player.y;

      // Draw detailed capybara with effects
      if (state.effects.invincibility > 0) {
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3; // Flashing effect
      }
      if (state.effects.speedBoost > 0) {
        // Add speed trail particles
        for (let i = 0; i < 3; i++) {
          state.particles.push({
            x: state.player.x - 10 - i * 5,
            y: state.player.y + Math.random() * 30,
            size: 2,
            color: '#FFD700',
            alpha: 0.8,
            vy: 0,
            life: 15
          });
        }
      }
      drawCapybara(ctx, state.player.x, playerY, state.player.width, playerHeight);
      ctx.globalAlpha = 1;

      // Spawn mini-boss every 1000 points
      if (state.score > 0 && state.score % 1000 === 0 && !state.miniBoss) {
        state.miniBoss = {
          x: canvas.width,
          y: 350,
          width: 60,
          height: 80,
          health: 3,
          maxHealth: 3,
          attackPattern: 0,
          lastAttack: 0
        };
        playSound('hit'); // Boss arrival sound
      }

      // Update and draw obstacles with dynamic speed
      const obstacleSpeed = 3 * state.gameSpeed * (state.effects.slowMotion > 0 ? 0.5 : 1);
      state.obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        
        // Reset obstacle when off screen with difficulty-based patterns
        if (obstacle.x < -obstacle.width) {
          const spacing = Math.max(150, 300 - state.difficultyLevel * 20);
          obstacle.x = canvas.width + Math.random() * spacing;
          state.score += 10;
          
          // Add new obstacle types at higher difficulties
          if (state.difficultyLevel >= 3 && Math.random() < 0.3) {
            obstacle.height = 50; // Taller obstacles
          }
          if (state.difficultyLevel >= 5 && Math.random() < 0.2) {
            // Moving obstacles
            obstacle.vy = (Math.random() - 0.5) * 2;
          }
          setCurrentScore(state.score);
        }

        // Draw detailed obstacles
        drawObstacle(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);

        // Collision check (with invincibility and sliding)
        if (!state.effects.invincibility && 
            state.player.x < obstacle.x + obstacle.width &&
            state.player.x + state.player.width > obstacle.x &&
            playerY < obstacle.y + obstacle.height &&
            playerY + playerHeight > obstacle.y) {
          
          // Break combo
          state.combo = 0;
          state.combo_multiplier = 1;
          endGame();
          return;
        }
        
        // Check if obstacle passed (for combo)
        if (obstacle.x + obstacle.width < state.player.x && !obstacle.passed) {
          obstacle.passed = true;
          state.combo++;
          
          // Update combo multiplier
          if (state.combo >= 20) {
            state.combo_multiplier = 8;
          } else if (state.combo >= 15) {
            state.combo_multiplier = 4;
          } else if (state.combo >= 10) {
            state.combo_multiplier = 2;
          } else {
            state.combo_multiplier = 1;
          }
          
          // Combo celebration particles
          if (state.combo % 5 === 0) {
            for (let i = 0; i < 10; i++) {
              state.particles.push({
                x: state.player.x + 20,
                y: state.player.y + 15,
                size: 4,
                color: '#FF69B4',
                alpha: 1,
                vy: (Math.random() - 0.5) * 5,
                life: 50
              });
            }
          }
        }
      });

      // Spawn enhanced power-ups with AI images
      if (Math.random() < 0.004) {
        const powerUpTypes = [
          'speed', 'shield', 'jump', 'magnet', 
          'coinMultiplier', 'slowMotion', 'dash', 'tripleJump'
        ];
        state.powerUps.push({
          x: canvas.width,
          y: 380 + Math.random() * 40,
          type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
          width: 25,
          height: 25
        });
      }

      // Spawn coins
      if (Math.random() < 0.008) {
        state.coins.push({
          x: canvas.width,
          y: 380 + Math.random() * 40
        });
      }

      // Update and draw power-ups
      state.powerUps.forEach((powerUp, index) => {
        powerUp.x -= 3;
        
        if (powerUp.x < -20) {
          state.powerUps.splice(index, 1);
          return;
        }

        // Check collection
        if (state.player.x < powerUp.x + 20 &&
            state.player.x + state.player.width > powerUp.x &&
            playerY < powerUp.y + 20 &&
            playerY + playerHeight > powerUp.y) {
          
          // Apply enhanced power-up effects
          if (powerUp.type === 'speed') {
            state.effects.speedBoost = 300; // 5 seconds
            playSound('speedBoost');
          } else if (powerUp.type === 'shield') {
            state.effects.shield = 300; // 5 seconds invincibility
            playSound('shield');
          } else if (powerUp.type === 'coinMultiplier') {
            state.effects.coinMultiplier = { active: true, multiplier: 2, duration: 600 }; // 10 seconds
            playSound('powerup');
          } else if (powerUp.type === 'slowMotion') {
            state.effects.slowMotion = 300; // 5 seconds
            playSound('slowMotion');
          } else if (powerUp.type === 'dash') {
            state.effects.dash = 120; // 2 seconds of dash
            playSound('dash');
          } else if (powerUp.type === 'tripleJump') {
            state.effects.tripleJump = 600; // 10 seconds
            playSound('tripleJump');
          } else if (powerUp.type === 'jump') {
            state.effects.doubleJump = true;
            playSound('jump');
          } else if (powerUp.type === 'magnet') {
            state.effects.coinMagnet = 600; // 10 seconds
            playSound('magnet');
          }
          
          // Add collection particles
          for (let i = 0; i < 8; i++) {
            state.particles.push({
              x: powerUp.x + 10,
              y: powerUp.y + 10,
              size: 4,
              color: '#FFD700',
              alpha: 1,
              vy: (Math.random() - 0.5) * 4,
              life: 40
            });
          }
          
          state.powerUps.splice(index, 1);
        } else {
          drawPowerUp(ctx, powerUp.x, powerUp.y, powerUp.type);
        }
      });

      // Enhanced coin collection with multiplier
      state.coins.forEach((coin, index) => {
        const coinSpeed = 3 * state.gameSpeed * (state.effects.slowMotion > 0 ? 0.5 : 1);
        coin.x -= coinSpeed;
        
        // Coin magnet effect
        if (state.effects.coinMagnet > 0) {
          const dx = state.player.x - coin.x;
          const dy = playerY - coin.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            coin.x += dx * 0.1;
            coin.y += dy * 0.1;
          }
        }
        
        if (coin.x < -20) {
          state.coins.splice(index, 1);
          return;
        }

        // Check collection
        if (state.player.x < coin.x + 20 &&
            state.player.x + state.player.width > coin.x &&
            playerY < coin.y + 20 &&
            playerY + playerHeight > coin.y) {
          
          state.coins_collected++;
          state.score += 50 * state.combo_multiplier;
          
          // Add coin collection particles
          for (let i = 0; i < 6; i++) {
            state.particles.push({
              x: coin.x + 10,
              y: coin.y + 10,
              size: 3,
              color: '#FFD700',
              alpha: 1,
              vy: (Math.random() - 0.5) * 3,
              life: 30
            });
          }
          
          state.coins.splice(index, 1);
        } else {
          drawCoin(ctx, coin.x, coin.y);
        }
      });

      // Update and draw particles
      state.particles.forEach((particle, index) => {
        particle.life--;
        particle.alpha = particle.life / 40;
        particle.y -= particle.vy;
        
        if (particle.life <= 0) {
          state.particles.splice(index, 1);
        } else {
          drawParticle(ctx, particle);
        }
      });

      // Spawn new obstacles
      if (Math.random() < 0.006) {
        state.obstacles.push({
          x: canvas.width,
          y: 420,
          width: 30,
          height: 30,
          color: ['#FF0000', '#00FF00', '#0000FF'][Math.floor(Math.random() * 3)],
          type: 'normal',
          passed: false
        });
      }

      // Score update
      state.score += 1;
      setCurrentScore(state.score);

      // Draw UI
      // Enhanced Score and Coins UI
      ctx.save();
      
      // Score display with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 5, 150, 35);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 5, 150, 35);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`⚡ Score: ${state.score}`, 15, 26);
      
      // Coins display with background  
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 45, 150, 35);
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 45, 150, 35);
      
      ctx.fillStyle = '#FFA500';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`💰 Coins: ${state.coins_collected}`, 15, 66);
      
      ctx.restore();
      
      // Enhanced Combo display
      if (state.combo > 0) {
        ctx.save();
        
        // Combo background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 85, 180, 35);
        ctx.strokeStyle = state.combo_multiplier > 1 ? '#FFD700' : '#32CD32';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 85, 180, 35);
        
        ctx.fillStyle = state.combo_multiplier > 1 ? '#FFD700' : '#32CD32';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`🔥 Combo: ${state.combo} (${state.combo_multiplier}x)`, 15, 106);
        
        ctx.restore();
      }
      
      // Enhanced Active power-ups display
      let powerUpY = 125;
      
      if (state.effects.speedBoost > 0) {
        ctx.save();
        // Speed boost background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, powerUpY, 160, 25);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, powerUpY, 160, 25);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`⚡ Speed: ${Math.ceil(state.effects.speedBoost / 60)}s`, 15, powerUpY + 18);
        ctx.restore();
        powerUpY += 30;
      }
      
      if (state.effects.invincibility > 0) {
        ctx.save();
        // Shield background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, powerUpY, 160, 25);
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, powerUpY, 160, 25);
        
        ctx.fillStyle = '#4169E1';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`🛡️ Shield: ${Math.ceil(state.effects.invincibility / 60)}s`, 15, powerUpY + 18);
        ctx.restore();
        powerUpY += 30;
      }
      
      if (state.effects.coinMagnet > 0) {
        ctx.save();
        // Magnet background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, powerUpY, 160, 25);
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, powerUpY, 160, 25);
        
        ctx.fillStyle = '#FF1493';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`🧲 Magnet: ${Math.ceil(state.effects.coinMagnet / 60)}s`, 15, powerUpY + 18);
        ctx.restore();
        powerUpY += 30;
      }
      
      if (state.effects.doubleJump) {
        ctx.save();
        // Double jump background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, powerUpY, 160, 25);
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, powerUpY, 160, 25);
        
        ctx.fillStyle = '#32CD32';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`↑↑ Double Jump`, 15, powerUpY + 18);
        ctx.restore();
      }
      
      // Dynamic instructions based on device
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      if (isMobile) {
        ctx.fillText('Use touch controls: ← → to move, ↑ to jump, ↓ to slide', 10, canvas.height - 10);
      } else {
        ctx.fillText('WASD/Arrows to move, W/Space to jump, S to slide', 10, canvas.height - 10);
      }

      // Continue game loop
      gameLoopRef.current = requestAnimationFrame(render);
    };

    const endGame = () => {
      setIsGameRunning(false);
      const newHighScore = Math.max(gameStats.highScore, gameState.current.score);
      const newStats = {
        score: gameState.current.score,
        highScore: newHighScore,
        gamesPlayed: gameStats.gamesPlayed + 1
      };
      
      setGameStats(newStats);
      localStorage.setItem('capirush-stats', JSON.stringify(newStats));
      
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

    // Start rendering immediately
    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isGameRunning, isPaused, gameStats]);

  // Touch controls effect (separate from main game loop)
  useEffect(() => {
    if (!isGameRunning) return;
    
    if (touchControls.jump) {
      // Trigger jump
      if (gameState.current.player.onGround) {
        gameState.current.player.vy = -12;
        gameState.current.player.onGround = false;
        gameState.current.player.doubleJumpAvailable = gameState.current.effects.doubleJump;
      } else if (gameState.current.player.doubleJumpAvailable) {
        gameState.current.player.vy = -10;
        gameState.current.player.doubleJumpAvailable = false;
        // Add double jump particles
        for (let i = 0; i < 5; i++) {
          gameState.current.particles.push({
            x: gameState.current.player.x + Math.random() * 40,
            y: gameState.current.player.y + 30,
            size: 3,
            color: '#32CD32',
            alpha: 1,
            vy: Math.random() * 3 + 1,
            life: 30
          });
        }
      }
      setTouchControls(prev => ({ ...prev, jump: false })); // Reset jump after action
    }
    
    if (touchControls.slide) {
      gameState.current.player.isSliding = true;
    } else {
      gameState.current.player.isSliding = false;
    }
  }, [touchControls, isGameRunning]);

  // Twitter sharing function
  const shareToTwitter = (score: number) => {
    const tweetText = `🐹 Just scored ${score} points in CAPYBARA COIN! 🎮✨

🚀 Features that got me hooked:
• AI-generated graphics
• Progressive difficulty 
• Epic power-ups & achievements
• Real crypto rewards!

Think you can beat my score? 👇

🎮 Play: @capybaracoingamebot
🐦 Follow: @CapybaraCoin
💬 Join: t.me/CapybaraCoinGame

#CapybaraCoin #CryptoGaming #Web3Gaming #TelegramGames`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const startGame = () => {
    // Reset game state
    gameState.current = {
      player: { 
        x: 100, y: 420, width: 40, height: 30, vy: 0, onGround: true,
        speed: 5, doubleJumpAvailable: false, isSliding: false
      },
      obstacles: [
        { x: 600, y: 420, width: 30, height: 30, color: '#FF0000', type: 'spike', passed: false },
        { x: 800, y: 420, width: 30, height: 30, color: '#00FF00', type: 'energy', passed: false }
      ],
      powerUps: [],
      coins: [],
      score: 0,
      coins_collected: 0,
      combo: 0,
      combo_multiplier: 1,
      keys: {},
      effects: {
        speedBoost: 0,
        invincibility: 0,
        coinMagnet: 0,
        doubleJump: false,
        // New power-ups
        shield: 0,
        coinMultiplier: { active: false, multiplier: 1, duration: 0 },
        slowMotion: 0,
        dash: 0,
        tripleJump: 0
      },
      particles: [],
      // Enhanced game features
      gameSpeed: 1,
      difficultyLevel: 1,
      weatherEffects: [],
      screenShake: { intensity: 0, duration: 0 },
      capybaraTrail: [],
      miniBoss: null,
      dailyChallenge: {
        type: 'score',
        target: 500,
        progress: 0,
        completed: false
      }
    };
    
    // Reset score when starting a new game
    setCurrentScore(0);
    setIsGameRunning(true);
    setIsPaused(false);
  };

  const pauseResumeGame = () => {
    setIsPaused(prev => !prev);
  };

  const resetGame = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    setIsGameRunning(false);
    setIsPaused(false);
    // Don't reset score here - keep it for the share button
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Mystical Forest Background - Same as Landing Page */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/images/AAA_capybara_wetland_background_ab88ce49.png)`,
          filter: 'brightness(0.8) contrast(1.1)'
        }}
      />
      
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      
      {/* Magical barrier effect */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-screen"
        style={{ 
          backgroundImage: `url(/images/AAA_magical_barrier_UI_b6d0d11f.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'pulse 4s infinite ease-in-out'
        }}
      />
      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBackToMenu && (
              <Button onClick={onBackToMenu} variant="outline" size="sm" className="bg-white/10 border-white/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            )}
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🐹 <span>CAPYBARA COIN</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {isGameRunning && (
              <Button onClick={pauseResumeGame} variant="secondary" size="sm">
                {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            <Button onClick={resetGame} variant="destructive" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white/70">Current Score</p>
                <p className="text-xl font-bold text-white">{currentScore}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-white/70">High Score</p>
                <p className="text-xl font-bold text-white">{gameStats.highScore}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm text-white/70">Games Played</p>
                <p className="text-xl font-bold text-white">{gameStats.gamesPlayed}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/30">
          {!isGameRunning ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                {currentScore > 0 ? '🎮 Game Over!' : 'Ready for the Adventure?'}
              </h2>
              <p className="text-white/80 mb-6">
                {currentScore > 0 
                  ? `You scored ${currentScore} points! ${currentScore === gameStats.highScore ? '🎉 New High Score!' : ''}`
                  : 'Guide the capybara through mystical landscapes! Collect coins and power-ups to earn rewards!'
                }
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={startGame} size="lg" className="bg-teal-600 hover:bg-teal-700">
                  {currentScore > 0 ? '🔄 Play Again' : 'Play Now'}
                </Button>
                
                {currentScore > 0 && (
                  <Button 
                    onClick={() => shareToTwitter(currentScore)} 
                    size="lg" 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    data-testid="button-share-twitter"
                  >
                    🐦 Share Score
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 rounded-lg">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <p className="text-2xl">Game Paused</p>
                    <p className="text-sm mt-2">Press Resume to continue</p>
                  </div>
                </div>
              )}
              <div className="relative">
                <canvas 
                  ref={canvasRef}
                  className="border-2 border-teal-400/50 rounded-lg"
                  style={{ 
                    width: isMobile ? '100%' : '800px', 
                    height: isMobile ? '300px' : '500px', 
                    maxWidth: '800px',
                    background: '#000',
                    touchAction: 'none' // Prevent scrolling on touch
                  }}
                />
                
                {/* Mobile Touch Controls */}
                {isMobile && (
                  <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 z-20">
                    {/* Left Side Controls */}
                    <div className="flex gap-3">
                      <Button
                        data-testid="button-move-left"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-sm text-white text-lg shadow-lg active:scale-95 transition-all"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, left: true }));
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, left: false }));
                        }}
                        onMouseDown={() => setTouchControls(prev => ({ ...prev, left: true }))}
                        onMouseUp={() => setTouchControls(prev => ({ ...prev, left: false }))}
                        onMouseLeave={() => setTouchControls(prev => ({ ...prev, left: false }))}
                      >
                        ←
                      </Button>
                      <Button
                        data-testid="button-move-right"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-sm text-white text-lg shadow-lg active:scale-95 transition-all"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, right: true }));
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, right: false }));
                        }}
                        onMouseDown={() => setTouchControls(prev => ({ ...prev, right: true }))}
                        onMouseUp={() => setTouchControls(prev => ({ ...prev, right: false }))}
                        onMouseLeave={() => setTouchControls(prev => ({ ...prev, right: false }))}
                      >
                        →
                      </Button>
                    </div>
                    
                    {/* Right Side Controls */}
                    <div className="flex gap-3">
                      <Button
                        data-testid="button-slide"
                        className="w-12 h-12 rounded-full bg-red-500/60 hover:bg-red-500/80 border border-red-400/60 backdrop-blur-sm text-white text-lg shadow-lg active:scale-95 transition-all ml-4"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, slide: true }));
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, slide: false }));
                        }}
                        onMouseDown={() => setTouchControls(prev => ({ ...prev, slide: true }))}
                        onMouseUp={() => setTouchControls(prev => ({ ...prev, slide: false }))}
                        onMouseLeave={() => setTouchControls(prev => ({ ...prev, slide: false }))}
                      >
                        ↓
                      </Button>
                      <Button
                        data-testid="button-jump"
                        className="w-12 h-12 rounded-full bg-green-500/60 hover:bg-green-500/80 border border-green-400/60 backdrop-blur-sm text-white text-lg shadow-lg active:scale-95 transition-all"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setTouchControls(prev => ({ ...prev, jump: true }));
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                        }}
                        onMouseDown={() => setTouchControls(prev => ({ ...prev, jump: true }))}
                        onMouseUp={() => {}}
                      >
                        ↑
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connection Reminder */}
        {!isGameRunning && (
          <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-amber-100">💰 Save Your Progress!</h3>
            </div>
            <p className="text-amber-100/90 text-sm">
              Connect your wallet from the main menu to save your high scores and coin progress permanently. Your achievements will be stored on the blockchain! 🔗✨
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
          <div className="text-white/80 space-y-1">
            {isMobile ? (
              <>
                <p>• Use touch controls: ← → for movement, ↑ to jump, ↓ to slide</p>
                <p>• Perfect for Telegram bot web app gameplay!</p>
                <p>• Dodge obstacles and collect coins for rewards</p>
                <p>• Score points by surviving as long as possible!</p>
              </>
            ) : (
              <>
                <p>• Use <kbd className="bg-white/20 px-2 py-1 rounded">WASD</kbd> or <kbd className="bg-white/20 px-2 py-1 rounded">Arrow Keys</kbd> to move</p>
                <p>• Press <kbd className="bg-white/20 px-2 py-1 rounded">W</kbd> or <kbd className="bg-white/20 px-2 py-1 rounded">Space</kbd> to jump</p>
                <p>• Press <kbd className="bg-white/20 px-2 py-1 rounded">S</kbd> to slide under obstacles</p>
                <p>• Dodge obstacles and score points by surviving!</p>
              </>
            )}
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-amber-200 text-sm">💡 <strong>Tip:</strong> Connect wallet to unlock permanent progress saving and crypto rewards!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};