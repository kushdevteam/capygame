import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, ArrowLeft, Heart, Zap } from 'lucide-react';

interface CapybaraAdventureGameProps {
  onBackToMenu?: () => void;
}

interface GameStats {
  score: number;
  highScore: number;
  gamesPlayed: number;
}

export const CapybaraAdventureGame: React.FC<CapybaraAdventureGameProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);
  
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('capybara-adventure-stats');
    return saved ? JSON.parse(saved) : {
      score: 0,
      highScore: 0,
      gamesPlayed: 0
    };
  });
  
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = {
      capybara: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 60,
        height: 40,
        speed: 200,
        health: 3
      },
      collectibles: [],
      obstacles: [],
      score: 0,
      keys: {},
      gameRunning: true,
      lastTime: 0
    };

    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys[e.key] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.key] = false;
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const spawnCollectible = () => {
      const item = {
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 25,
        height: 25,
        type: 'pumpkin'
      };
      gameState.collectibles.push(item);
    };

    const spawnObstacle = () => {
      const obstacle = {
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * (canvas.height - 40),
        width: 40,
        height: 40,
        type: 'danger'
      };
      gameState.obstacles.push(obstacle);
    };

    const isColliding = (rect1: any, rect2: any) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const update = (deltaTime: number) => {
      if (!gameState.gameRunning || isPaused) return;
      
      const modifier = deltaTime / 1000;
      
      // Move capybara
      if (gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys['W']) {
        gameState.capybara.y = Math.max(0, gameState.capybara.y - gameState.capybara.speed * modifier);
      }
      if (gameState.keys['ArrowDown'] || gameState.keys['s'] || gameState.keys['S']) {
        gameState.capybara.y = Math.min(canvas.height - gameState.capybara.height, gameState.capybara.y + gameState.capybara.speed * modifier);
      }
      if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        gameState.capybara.x = Math.max(0, gameState.capybara.x - gameState.capybara.speed * modifier);
      }
      if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        gameState.capybara.x = Math.min(canvas.width - gameState.capybara.width, gameState.capybara.x + gameState.capybara.speed * modifier);
      }
      
      // Check collectible collisions
      gameState.collectibles.forEach((item: any, index: number) => {
        if (isColliding(gameState.capybara, item)) {
          gameState.collectibles.splice(index, 1);
          gameState.score += 10;
        }
      });
      
      // Check obstacle collisions
      gameState.obstacles.forEach((obstacle: any) => {
        if (isColliding(gameState.capybara, obstacle)) {
          gameState.capybara.health -= 1;
          // Remove the obstacle that hit us
          const index = gameState.obstacles.indexOf(obstacle);
          gameState.obstacles.splice(index, 1);
          
          if (gameState.capybara.health <= 0) {
            gameState.gameRunning = false;
            endGame(gameState.score);
          }
        }
      });
      
      // Spawn new items periodically
      if (Math.random() < 0.02) spawnCollectible();
      if (Math.random() < 0.01) spawnObstacle();
    };

    const drawRect = (obj: any, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    };

    const drawCapybara = () => {
      // Body
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(gameState.capybara.x, gameState.capybara.y, gameState.capybara.width, gameState.capybara.height);
      
      // Face
      ctx.fillStyle = '#654321';
      ctx.fillRect(gameState.capybara.x + gameState.capybara.width - 15, gameState.capybara.y + 5, 10, 15);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(gameState.capybara.x + gameState.capybara.width - 12, gameState.capybara.y + 8, 2, 2);
      ctx.fillRect(gameState.capybara.x + gameState.capybara.width - 8, gameState.capybara.y + 8, 2, 2);
      
      // Nose
      ctx.fillStyle = '#333';
      ctx.fillRect(gameState.capybara.x + gameState.capybara.width - 10, gameState.capybara.y + 12, 2, 2);
    };

    const render = () => {
      // Clear canvas with wetland background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(1, '#90EE90'); // Light green
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw game objects
      drawCapybara();
      
      // Draw collectibles (pumpkins)
      gameState.collectibles.forEach((item: any) => {
        drawRect(item, '#FFD700'); // Gold
        // Add a simple pumpkin pattern
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(item.x + 5, item.y + 3, 15, 19);
        ctx.fillStyle = '#228B22';
        ctx.fillRect(item.x + 10, item.y, 5, 8);
      });
      
      // Draw obstacles (red dangers)
      gameState.obstacles.forEach((obstacle: any) => {
        drawRect(obstacle, '#FF6347'); // Tomato red
        // Add danger symbol
        ctx.fillStyle = '#FFFF00';
        ctx.font = '20px Arial';
        ctx.fillText('!', obstacle.x + 15, obstacle.y + 25);
      });
      
      // Draw HUD
      ctx.fillStyle = '#333';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);
      ctx.fillText(`Health: ${'❤️'.repeat(gameState.capybara.health)}`, 10, 60);
      
      // Draw instructions
      ctx.font = '14px Arial';
      ctx.fillText('Use WASD or Arrow Keys to move', 10, canvas.height - 40);
      ctx.fillText('Collect golden pumpkins, avoid red dangers!', 10, canvas.height - 20);
      
      if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '30px Arial';
        ctx.fillText('PAUSED', canvas.width/2 - 60, canvas.height/2);
        ctx.font = '16px Arial';
        ctx.fillText('Press P to resume', canvas.width/2 - 70, canvas.height/2 + 30);
      }
    };

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - gameState.lastTime;
      gameState.lastTime = currentTime;
      
      update(deltaTime);
      render();
      
      if (gameState.gameRunning || isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    const endGame = (finalScore: number) => {
      setIsGameRunning(false);
      const newHighScore = Math.max(gameStats.highScore, finalScore);
      const newStats = {
        score: finalScore,
        highScore: newHighScore,
        gamesPlayed: gameStats.gamesPlayed + 1
      };
      
      setGameStats(newStats);
      localStorage.setItem('capybara-adventure-stats', JSON.stringify(newStats));
      
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

    // Handle pause
    const handlePause = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handlePause);

    // Initialize game
    spawnCollectible();
    spawnCollectible();
    gameLoop(0);

    gameStateRef.current = {
      ...gameState,
      cleanup: () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handlePause);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

  }, [gameStats, isPaused]);

  const startGame = () => {
    setIsGameRunning(true);
    setIsPaused(false);
    initializeGame();
  };

  const pauseResumeGame = () => {
    setIsPaused(prev => !prev);
  };

  const resetGame = () => {
    if (gameStateRef.current?.cleanup) {
      gameStateRef.current.cleanup();
    }
    setIsGameRunning(false);
    setIsPaused(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (gameStateRef.current?.cleanup) {
        gameStateRef.current.cleanup();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBackToMenu} variant="outline" size="sm" className="bg-white/10 border-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <h1 className="text-3xl font-bold text-white">Capybara Adventure</h1>
          </div>
          <div className="flex gap-2">
            {isGameRunning && (
              <Button onClick={pauseResumeGame} variant="secondary" size="sm">
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Button>
            )}
            <Button onClick={resetGame} variant="destructive" size="sm">
              🔄 Reset
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
                <p className="text-xl font-bold text-white">{gameStats.score}</p>
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
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/30">
          {!isGameRunning ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready for Adventure?</h2>
              <p className="text-white/80 mb-6">
                Help the capybara collect golden pumpkins while avoiding red dangers!
              </p>
              <Button onClick={startGame} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                🐹 Start Adventure
              </Button>
            </div>
          ) : (
            <canvas 
              ref={canvasRef}
              width={800}
              height={500}
              className="border-2 border-emerald-400/50 rounded-lg bg-gradient-to-b from-sky-200 to-green-300"
            />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
          <div className="text-white/80 space-y-1">
            <p>• Use <kbd className="bg-white/20 px-2 py-1 rounded">WASD</kbd> or <kbd className="bg-white/20 px-2 py-1 rounded">Arrow Keys</kbd> to move</p>
            <p>• Collect 🥇 golden pumpkins for points</p>
            <p>• Avoid ❗ red dangers (they reduce health)</p>
            <p>• Press <kbd className="bg-white/20 px-2 py-1 rounded">P</kbd> to pause/resume</p>
          </div>
        </div>
      </div>
    </div>
  );
};