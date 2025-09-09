import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, Star, Coins, ArrowLeft } from 'lucide-react';

interface GameStats {
  score: number;
  highScore: number;
  distanceTraveled: number;
  coinsCollected: number;
  gamesPlayed: number;
}

interface CapybaraDemoProps {
  onBackToMenu?: () => void;
}

export const CapybaraDemo: React.FC<CapybaraDemoProps> = ({ onBackToMenu }) => {
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('capybara-stats');
    return saved ? JSON.parse(saved) : {
      score: 0,
      highScore: 0,
      distanceTraveled: 0,
      coinsCollected: 0,
      gamesPlayed: 0
    };
  });
  
  const [showGame, setShowGame] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('capybara-stats', JSON.stringify(gameStats));
  }, [gameStats]);

  const calculateRewards = (score: number, coins: number, distance: number) => {
    // Reward calculation logic matching the Unity integration
    const baseReward = Math.floor(score / 100) * 0.001; // 0.001 SOL per 100 points
    const coinBonus = coins * 0.0001; // 0.0001 SOL per coin
    const distanceBonus = Math.floor(distance / 1000) * 0.0005; // 0.0005 SOL per 1000m
    
    const totalReward = baseReward + coinBonus + distanceBonus;
    
    if (totalReward > 0) {
      console.log(`Demo: Would earn ${totalReward.toFixed(6)} SOL rewards!`);
      // In real implementation, this would call your Solana reward system
    }
    
    return totalReward;
  };

  const startGame = () => {
    setShowGame(true);
    setIsPlaying(true);
    setCurrentScore(0);
    setCurrentCoins(0);
    setCurrentDistance(0);
    
    // Simulate game progression
    const interval = setInterval(() => {
      setCurrentScore(s => s + Math.floor(Math.random() * 10) + 5);
      setCurrentDistance(d => d + Math.floor(Math.random() * 15) + 10);
      
      // Random coin collection
      if (Math.random() > 0.7) {
        setCurrentCoins(c => c + 1);
      }
    }, 200);
    
    setGameInterval(interval);
    
    // Auto-end game after random time (10-30 seconds for demo)
    setTimeout(() => {
      endGame();
    }, Math.random() * 20000 + 10000);
  };

  const endGame = useCallback(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
      setGameInterval(null);
    }
    
    setIsPlaying(false);
    
    // Update stats
    const newStats = {
      score: currentScore,
      highScore: Math.max(gameStats.highScore, currentScore),
      distanceTraveled: gameStats.distanceTraveled + currentDistance,
      coinsCollected: gameStats.coinsCollected + currentCoins,
      gamesPlayed: gameStats.gamesPlayed + 1
    };
    
    setGameStats(newStats);
    
    // Calculate rewards
    const rewards = calculateRewards(currentScore, currentCoins, currentDistance);
    
    setTimeout(() => {
      alert(`Game Over!\nScore: ${currentScore}\nCoins: ${currentCoins}\nDistance: ${currentDistance}m\nSOL Earned: ${rewards.toFixed(6)}`);
      setShowGame(false);
    }, 1000);
  }, [currentScore, currentCoins, currentDistance, gameStats, gameInterval]);

  const pauseGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
      setGameInterval(null);
      setIsPlaying(false);
    }
  };

  const resumeGame = () => {
    if (!isPlaying && showGame) {
      const interval = setInterval(() => {
        setCurrentScore(s => s + Math.floor(Math.random() * 10) + 5);
        setCurrentDistance(d => d + Math.floor(Math.random() * 15) + 10);
        
        if (Math.random() > 0.7) {
          setCurrentCoins(c => c + 1);
        }
      }, 200);
      
      setGameInterval(interval);
      setIsPlaying(true);
    }
  };

  if (showGame) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-blue-400 via-green-400 to-green-600 overflow-hidden">
        {/* Game Controls Overlay */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {isPlaying ? (
            <Button
              onClick={pauseGame}
              variant="outline"
              size="sm"
              className="bg-black/50 text-white border-white/30"
            >
              Pause
            </Button>
          ) : (
            <Button
              onClick={resumeGame}
              variant="outline"
              size="sm"
              className="bg-black/50 text-white border-white/30"
            >
              Resume
            </Button>
          )}
          <Button
            onClick={endGame}
            variant="outline" 
            size="sm"
            className="bg-black/50 text-white border-white/30"
          >
            End Game
          </Button>
        </div>

        {/* Game Stats Overlay */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white p-4 rounded-lg">
          <div className="text-sm space-y-1">
            <div>Score: {currentScore}</div>
            <div>Distance: {currentDistance}m</div>
            <div>Coins: {currentCoins}</div>
            <div>{isPlaying ? '🏃 Running...' : '⏸️ Paused'}</div>
          </div>
        </div>

        {/* Demo Game Visual */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">🐹</div>
            <div className="text-xl mb-2">Capybara Adventure Demo</div>
            <div className="text-sm opacity-75">
              This is a demo version. Install the real Unity game for full experience!
            </div>
            
            {/* Floating islands animation */}
            <div className="mt-8 relative">
              <div className="absolute animate-pulse">🏝️</div>
              <div className="absolute left-20 animate-pulse delay-1000">🏝️</div>
              <div className="absolute left-40 animate-pulse delay-2000">🏝️</div>
            </div>
          </div>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl mb-4">Game Paused</div>
              <Button onClick={resumeGame} className="bg-green-500 hover:bg-green-600">
                Resume Adventure
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-y-auto" style={{ height: '100vh' }}>
      {/* Game Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/images/AAA_capybara_wetland_background_ab88ce49.png')`,
          filter: 'brightness(0.6) contrast(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {onBackToMenu && (
          <Button 
            onClick={onBackToMenu} 
            variant="outline" 
            className="mb-4 text-amber-100 border-amber-400/30 hover:bg-amber-500/20 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Capybara
            <span className="text-amber-300"> Adventure</span>
          </h1>
          <p className="text-xl text-amber-100 mb-6">
            Jump through endless islands and earn Solana rewards!
          </p>
          <div className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 rounded-lg p-4 mb-4">
            <p className="text-amber-200">
              🎮 <strong>Demo Version</strong> - This shows the integration concept.<br/>
              Build the real Unity game to replace this demo!
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{gameStats.highScore}</h3>
            <p className="text-amber-100">Best Score</p>
          </Card>
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 p-4 text-center">
            <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{gameStats.gamesPlayed}</h3>
            <p className="text-amber-100">Games Played</p>
          </Card>
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 p-4 text-center">
            <Coins className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{gameStats.coinsCollected}</h3>
            <p className="text-amber-100">Coins Collected</p>
          </Card>
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 p-4 text-center">
            <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
              m
            </div>
            <h3 className="text-2xl font-bold text-white">{Math.round(gameStats.distanceTraveled)}</h3>
            <p className="text-amber-100">Distance Traveled</p>
          </Card>
        </div>

        {/* Play Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold px-12 py-4 text-xl"
          >
            Start Demo Adventure!
          </Button>
        </div>

        {/* Game Instructions */}
        <Card className="mb-8 bg-amber-900/20 backdrop-blur-md border-amber-500/30">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
            <div className="text-amber-100 space-y-2">
              <p>🐾 <strong>Control:</strong> Tap/click to jump with varying strength</p>
              <p>🏝️ <strong>Goal:</strong> Jump between islands and travel as far as possible</p>
              <p>💰 <strong>Collect:</strong> Gather coins to increase your rewards</p>
              <p>🏆 <strong>Earn:</strong> Higher scores = more Solana token rewards</p>
              <p>⚡ <strong>Challenge:</strong> Precision jumping is key to survival</p>
            </div>
          </div>
        </Card>

        {/* Unity Build Instructions */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border-purple-400/30">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Build the Real Game</h2>
            <div className="text-blue-100 space-y-3">
              <p><strong>1. Download Unity Hub</strong> and install Unity 2021.3.16f1</p>
              <p><strong>2. Clone the repository:</strong></p>
              <code className="block bg-black/30 p-2 rounded text-sm">
                git clone https://github.com/revenkogrisha/CapybaraAdventure.git
              </code>
              <p><strong>3. Open in Unity</strong> and switch to WebGL platform</p>
              <p><strong>4. Build</strong> and copy the 4 files (.loader.js, .data, .framework.js, .wasm) to:</p>
              <code className="block bg-black/30 p-2 rounded text-sm">
                client/public/unity/Build/
              </code>
              <p><strong>5. Restart</strong> the server - your real Unity game will replace this demo!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};