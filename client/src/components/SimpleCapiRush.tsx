import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, ArrowLeft, Heart, Zap, Play, Pause, RotateCcw } from 'lucide-react';

interface SimpleCapiRushProps {
  onBackToMenu?: () => void;
}

interface GameStats {
  score: number;
  highScore: number;
  gamesPlayed: number;
}

export const SimpleCapiRush: React.FC<SimpleCapiRushProps> = ({ onBackToMenu }) => {
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
  const [currentScore, setCurrentScore] = useState(0);

  const initializeGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 40,
        height: 30,
        speed: 200,
        velocityY: 0,
        onGround: true
      },
      obstacles: [] as any[],
      score: 0,
      keys: {} as { [key: string]: boolean },
      gameRunning: true,
      lastTime: 0,
      gravity: 800
    };

    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys[e.key.toLowerCase()] = true;
      gameState.keys[e.code] = true;
      
      // Jump
      if ((e.key.toLowerCase() === 'w' || e.code === 'ArrowUp' || e.code === 'Space') && gameState.player.onGround) {
        gameState.player.velocityY = -400;
        gameState.player.onGround = false;
      }
      
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.key.toLowerCase()] = false;
      gameState.keys[e.code] = false;
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Create obstacle
    const createObstacle = () => {
      return {
        x: canvas.width - 100,
        y: canvas.height - 80,
        width: 30,
        height: 30,
        speed: 150,
        color: ['#FF0000', '#00FF00', '#0000FF'][Math.floor(Math.random() * 3)]
      };
    };

    // Collision detection
    const checkCollision = (rect1: any, rect2: any) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
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

      // Clear canvas
      ctx.fillStyle = '#87CEEB'; // Sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Update player
      const player = gameState.player;
      
      // Horizontal movement
      if (gameState.keys['a'] || gameState.keys['arrowleft']) {
        player.x = Math.max(0, player.x - player.speed * modifier);
      }
      if (gameState.keys['d'] || gameState.keys['arrowright']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed * modifier);
      }

      // Gravity
      if (!player.onGround) {
        player.velocityY += gameState.gravity * modifier;
        player.y += player.velocityY * modifier;
        
        if (player.y >= canvas.height - 80) {
          player.y = canvas.height - 80;
          player.onGround = true;
          player.velocityY = 0;
        }
      }

      // Draw player (capybara)
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Draw head
      ctx.fillStyle = '#654321';
      ctx.fillRect(player.x + 25, player.y - 5, 20, 15);

      // Update obstacles
      gameState.obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed * modifier;
        
        // Draw obstacle
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Remove if off screen
        if (obstacle.x + obstacle.width < 0) {
          gameState.obstacles.splice(index, 1);
          gameState.score += 10;
          setCurrentScore(gameState.score);
        }

        // Check collision
        if (checkCollision(player, obstacle)) {
          endGame(gameState.score);
          return;
        }
      });

      // Spawn obstacles
      if (Math.random() < 0.01) {
        gameState.obstacles.push(createObstacle());
      }

      // Update score
      gameState.score += Math.floor(modifier * 5);
      setCurrentScore(gameState.score);

      // Draw score
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);

      // Draw instructions
      ctx.font = '14px Arial';
      ctx.fillText('WASD/Arrows to move, W/Up/Space to jump', 10, canvas.height - 10);
      
      // Debug info
      ctx.fillText(`Player: ${Math.round(gameState.player.x)}, ${Math.round(gameState.player.y)}`, 10, 50);
      ctx.fillText(`Obstacles: ${gameState.obstacles.length}`, 10, 70);

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
      
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

    // Start game immediately with visible elements
    gameState.obstacles.push(createObstacle());
    
    // Force first render
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw player immediately
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    
    // Draw head
    ctx.fillStyle = '#654321';
    ctx.fillRect(gameState.player.x + 25, gameState.player.y - 5, 20, 15);
    
    // Draw initial obstacle
    const firstObstacle = gameState.obstacles[0];
    if (firstObstacle) {
      ctx.fillStyle = firstObstacle.color;
      ctx.fillRect(firstObstacle.x, firstObstacle.y, firstObstacle.width, firstObstacle.height);
    }
    
    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    gameRef.current = {
      ...gameState,
      cleanup: () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };
  };

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
    <div className="min-h-screen p-4 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBackToMenu && (
              <Button onClick={onBackToMenu} variant="outline" size="sm" className="bg-white/10 border-white/30" data-testid="button-back-menu">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            )}
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🐹 <span>CapiRush</span>
            </h1>
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
              <Button onClick={startGame} size="lg" className="bg-teal-600 hover:bg-teal-700" data-testid="button-start-capirush">
                🐹 Start CapiRush
              </Button>
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
              <canvas 
                ref={canvasRef}
                width={800}
                height={500}
                className="border-2 border-teal-400/50 rounded-lg bg-sky-200"
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
            <p>• Dodge red, green, and blue obstacles</p>
            <p>• Score points by surviving and avoiding obstacles</p>
            <p>• Press <kbd className="bg-white/20 px-2 py-1 rounded">W/Up/Space</kbd> to jump</p>
          </div>
        </div>
      </div>
    </div>
  );
};