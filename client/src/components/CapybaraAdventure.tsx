import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trophy, Star, Coins, ArrowLeft } from "lucide-react";

interface GameStats {
  score: number;
  highScore: number;
  distanceTraveled: number;
  coinsCollected: number;
  gamesPlayed: number;
}

interface CapybaraAdventureProps {
  onBackToMenu?: () => void;
}

export const CapybaraAdventure: React.FC<CapybaraAdventureProps> = ({ onBackToMenu }) => {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    distanceTraveled: 0,
    coinsCollected: 0,
    gamesPlayed: 0
  });
  
  const [showGame, setShowGame] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  const { unityProvider, loadingProgression, isLoaded, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "unity/Build/CapybaraAdventure.loader.js",
    dataUrl: "unity/Build/CapybaraAdventure.data",
    frameworkUrl: "unity/Build/CapybaraAdventure.framework.js",
    codeUrl: "unity/Build/CapybaraAdventure.wasm",
  });

  // Handle Unity events for stats tracking and rewards
  const handleScoreUpdate = useCallback((score: number) => {
    setGameStats(prev => ({
      ...prev,
      score,
      highScore: Math.max(prev.highScore, score)
    }));
  }, []);

  const handleGameEnd = useCallback((finalScore: number, coins: number, distance: number) => {
    setGameStats(prev => ({
      ...prev,
      score: finalScore,
      highScore: Math.max(prev.highScore, finalScore),
      coinsCollected: prev.coinsCollected + coins,
      distanceTraveled: prev.distanceTraveled + distance,
      gamesPlayed: prev.gamesPlayed + 1
    }));

    // Calculate Solana rewards based on performance
    calculateRewards(finalScore, coins, distance);
  }, []);

  const calculateRewards = (score: number, coins: number, distance: number) => {
    // Reward calculation logic - can be customized
    const baseReward = Math.floor(score / 100) * 0.001; // 0.001 SOL per 100 points
    const coinBonus = coins * 0.0001; // 0.0001 SOL per coin
    const distanceBonus = Math.floor(distance / 1000) * 0.0005; // 0.0005 SOL per 1000m
    
    const totalReward = baseReward + coinBonus + distanceBonus;
    
    if (totalReward > 0) {
      // Here you would integrate with your Solana reward system
      console.log(`Earned ${totalReward} SOL rewards!`);
      // TODO: Call your Solana reward distribution API
    }
  };

  useEffect(() => {
    if (isLoaded) {
      setGameReady(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    addEventListener("ScoreUpdated", handleScoreUpdate);
    addEventListener("GameEnded", handleGameEnd);
    
    return () => {
      removeEventListener("ScoreUpdated", handleScoreUpdate);
      removeEventListener("GameEnded", handleGameEnd);
    };
  }, [addEventListener, removeEventListener, handleScoreUpdate, handleGameEnd]);

  const startGame = () => {
    if (gameReady) {
      setShowGame(true);
      // Send start command to Unity
      sendMessage("GameManager", "StartGame");
    }
  };

  const pauseGame = () => {
    sendMessage("GameManager", "PauseGame");
  };

  const resumeGame = () => {
    sendMessage("GameManager", "ResumeGame");
  };

  if (!showGame) {
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

          {/* Game Loading or Play Button */}
          <div className="text-center">
            {!gameReady ? (
              <div className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Loading Game...</h2>
                <div className="w-full bg-amber-700/30 rounded-full h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                  ></div>
                </div>
                <p className="text-amber-100">{Math.round(loadingProgression * 100)}% Complete</p>
                <p className="text-sm text-amber-200 mt-2">
                  Note: The Unity game files need to be placed in the public/unity/Build/ directory
                </p>
              </div>
            ) : (
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold px-12 py-4 text-xl"
              >
                Start Adventure!
              </Button>
            )}
          </div>

          {/* Game Instructions */}
          <Card className="mt-8 bg-amber-900/20 backdrop-blur-md border-amber-500/30">
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
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Game Controls Overlay */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={pauseGame}
          variant="outline"
          size="sm"
          className="bg-black/50 text-white border-white/30"
        >
          Pause
        </Button>
        <Button
          onClick={() => setShowGame(false)}
          variant="outline" 
          size="sm"
          className="bg-black/50 text-white border-white/30"
        >
          Menu
        </Button>
      </div>

      {/* Unity Game */}
      <Fragment>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
            <div className="text-center text-white">
              <p className="text-xl mb-4">Loading Game...</p>
              <div className="w-64 bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-4 rounded-full transition-all"
                  style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                ></div>
              </div>
              <p className="mt-2">{Math.round(loadingProgression * 100)}%</p>
            </div>
          </div>
        )}
        <Unity 
          unityProvider={unityProvider}
          style={{ 
            visibility: isLoaded ? "visible" : "hidden",
            width: "100%", 
            height: "100vh",
            display: "block"
          }} 
        />
      </Fragment>
    </div>
  );
};