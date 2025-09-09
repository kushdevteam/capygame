import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, ArrowLeft, Heart, Zap, Play, Pause, RotateCcw } from 'lucide-react';

interface CapiRushProps {
  onBackToMenu?: () => void;
}

interface GameStats {
  score: number;
  highScore: number;
  gamesPlayed: number;
}

export const CapiRush: React.FC<CapiRushProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // Box helper class from the original game
  class Box extends THREE.Mesh {
    width: number;
    height: number;
    depth: number;
    bottom: number;
    top: number;

    constructor({ width, height, depth, position = { x: 0, y: 0, z: 0 } }: {
      width: number;
      height: number;
      depth: number;
      position?: { x: number; y: number; z: number };
    }) {
      super(new THREE.BoxGeometry(width, height, depth));

      this.width = width;
      this.height = height;
      this.depth = depth;

      this.position.set(position.x, position.y, position.z);

      this.bottom = this.position.y - this.height / 2;
      this.top = this.position.y + this.height / 2;
    }
  }

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.set(0, 0, 5.3);

    // Game state
    const gameState = {
      scene,
      camera,
      renderer,
      score: 0,
      gameRunning: true,
      player: null as any,
      obstacles: [] as any[],
      keys: {} as { [key: string]: boolean },
      lastTime: 0,
      cleanup: () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('resize', handleResize);
      }
    };

    // Setup scenario (simplified version)
    const setupScenario = () => {
      // Simple road
      const road = new Box({
        width: 5,
        height: 0.5,
        depth: 50,
        position: { x: 0, y: -1.5, z: 0 }
      });
      road.material = new THREE.MeshPhongMaterial({ color: 0x333333 });
      road.castShadow = true;
      road.receiveShadow = true;
      scene.add(road);

      // Walkway
      const walkway = new Box({
        width: 9,
        height: 0.5,
        depth: 50,
        position: { x: 0, y: -1.6, z: 0 }
      });
      walkway.material = new THREE.MeshPhongMaterial({ color: 0x666666 });
      walkway.castShadow = true;
      walkway.receiveShadow = true;
      scene.add(walkway);

      // Simple skybox
      scene.background = new THREE.Color(0x87CEEB);
    };

    // Setup lights
    const setupLights = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
    };

    // Create simple capybara player
    const createPlayer = () => {
      const playerGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.8);
      const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const player = new THREE.Mesh(playerGeometry, playerMaterial);
      player.position.set(0, -0.8, 0);
      player.castShadow = true;
      scene.add(player);
      return player;
    };

    // Create obstacles
    const createObstacle = (type: string = 'car') => {
      let obstacle;
      if (type === 'car') {
        obstacle = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.4, 1.6),
          new THREE.MeshPhongMaterial({ color: 0xFF0000 })
        );
      } else {
        obstacle = new THREE.Mesh(
          new THREE.SphereGeometry(0.3),
          new THREE.MeshPhongMaterial({ color: 0x00FF00 })
        );
      }
      obstacle.position.set(
        (Math.random() - 0.5) * 4,
        -0.8,
        -20 - Math.random() * 10
      );
      obstacle.castShadow = true;
      scene.add(obstacle);
      return obstacle;
    };

    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys[e.key.toLowerCase()] = true;
      gameState.keys[e.code] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.key.toLowerCase()] = false;
      gameState.keys[e.code] = false;
      e.preventDefault();
    };

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    // Collision detection
    const checkCollision = (obj1: any, obj2: any) => {
      const distance = obj1.position.distanceTo(obj2.position);
      return distance < 0.8;
    };

    // Game loop
    const gameLoop = (currentTime: number) => {
      if (!gameState.gameRunning || isPaused) {
        if (gameState.gameRunning && isPaused) {
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        }
        return;
      }

      const deltaTime = currentTime - gameState.lastTime;
      gameState.lastTime = currentTime;
      const modifier = deltaTime / 1000;

      // Player movement
      if (gameState.player) {
        const speed = 3;
        if (gameState.keys['a'] || gameState.keys['arrowleft']) {
          gameState.player.position.x = Math.max(-2, gameState.player.position.x - speed * modifier);
        }
        if (gameState.keys['d'] || gameState.keys['arrowright']) {
          gameState.player.position.x = Math.min(2, gameState.player.position.x + speed * modifier);
        }
        if (gameState.keys['w'] || gameState.keys['arrowup']) {
          gameState.player.position.y = Math.min(1, gameState.player.position.y + speed * modifier);
        }
        if (gameState.keys['s'] || gameState.keys['arrowdown']) {
          gameState.player.position.y = Math.max(-1.2, gameState.player.position.y - speed * modifier);
        }
      }

      // Move obstacles towards player
      gameState.obstacles.forEach((obstacle, index) => {
        obstacle.position.z += 5 * modifier;
        
        // Remove obstacles that passed the player
        if (obstacle.position.z > 10) {
          scene.remove(obstacle);
          gameState.obstacles.splice(index, 1);
          gameState.score += 10;
          setCurrentScore(gameState.score);
        }

        // Check collision
        if (gameState.player && checkCollision(gameState.player, obstacle)) {
          endGame(gameState.score);
          return;
        }
      });

      // Spawn new obstacles
      if (Math.random() < 0.02) {
        const obstacle = createObstacle(Math.random() > 0.5 ? 'car' : 'ball');
        gameState.obstacles.push(obstacle);
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const endGame = (finalScore: number) => {
      gameState.gameRunning = false;
      setIsGameRunning(false);
      const newHighScore = Math.max(gameStats.highScore, finalScore);
      const newStats = {
        score: finalScore,
        highScore: newHighScore,
        gamesPlayed: gameStats.gamesPlayed + 1
      };
      
      setGameStats(newStats);
      localStorage.setItem('capirush-stats', JSON.stringify(newStats));
    };

    // Initialize game
    setupScenario();
    setupLights();
    gameState.player = createPlayer();

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    // Start spawning obstacles
    for (let i = 0; i < 3; i++) {
      const obstacle = createObstacle();
      gameState.obstacles.push(obstacle);
    }

    setIsLoading(false);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    gameRef.current = gameState;
  }, [gameStats, isPaused]);

  const startGame = () => {
    setIsGameRunning(true);
    setIsPaused(false);
    setCurrentScore(0);
    initializeGame();
  };

  const pauseResumeGame = () => {
    setIsPaused(prev => !prev);
  };

  const resetGame = () => {
    if (gameRef.current?.cleanup) {
      gameRef.current.cleanup();
    }
    setIsGameRunning(false);
    setIsPaused(false);
    setCurrentScore(0);
  };

  useEffect(() => {
    return () => {
      if (gameRef.current?.cleanup) {
        gameRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBackToMenu && (
              <Button onClick={onBackToMenu} variant="outline" size="sm" className="bg-white/10 border-white/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            )}
            <h1 className="text-3xl font-bold text-white">🐹 CapiRush</h1>
          </div>
          <div className="flex gap-2">
            {isGameRunning && (
              <Button onClick={pauseResumeGame} variant="secondary" size="sm" data-testid="button-pause-resume">
                {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            <Button onClick={resetGame} variant="destructive" size="sm" data-testid="button-reset">
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
                <p className="text-xl font-bold text-white" data-testid="text-current-score">{currentScore}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-white/70">High Score</p>
                <p className="text-xl font-bold text-white" data-testid="text-high-score">{gameStats.highScore}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm text-white/70">Games Played</p>
                <p className="text-xl font-bold text-white" data-testid="text-games-played">{gameStats.gamesPlayed}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/30">
          {!isGameRunning ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready for the Rush?</h2>
              <p className="text-white/80 mb-6">
                Help the capybara navigate through an endless runner adventure! Dodge obstacles and rack up points!
              </p>
              <Button onClick={startGame} size="lg" className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-start-game">
                🐹 Start CapiRush
              </Button>
            </div>
          ) : (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-lg">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎮</div>
                    <p>Loading CapiRush...</p>
                  </div>
                </div>
              )}
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 rounded-lg">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <p className="text-2xl">Game Paused</p>
                    <p className="text-sm mt-2">Press Resume to continue</p>
                  </div>
                </div>
              )}
              <canvas 
                ref={canvasRef}
                width={800}
                height={500}
                className="border-2 border-emerald-400/50 rounded-lg bg-gradient-to-b from-sky-300 to-green-400"
                style={{ width: '800px', height: '500px' }}
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
          <div className="text-white/80 space-y-1">
            <p>• Use <kbd className="bg-white/20 px-2 py-1 rounded">WASD</kbd> or <kbd className="bg-white/20 px-2 py-1 rounded">Arrow Keys</kbd> to move</p>
            <p>• Dodge red cars and green balls</p>
            <p>• Score points by surviving and avoiding obstacles</p>
            <p>• Press <kbd className="bg-white/20 px-2 py-1 rounded">C</kbd> to change camera view</p>
          </div>
        </div>
      </div>
    </div>
  );
};