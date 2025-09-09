import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trophy, Shield, Coins, ArrowLeft, Heart, Zap, Timer } from "lucide-react";

interface GameStats {
  capybarasSaved: number;
  totalScore: number;
  bestSurvivalTime: number;
  tokensEarned: number;
  gamesPlayed: number;
  currentStreak: number;
}

interface CapybaraDefenseProps {
  onBackToMenu?: () => void;
}

export const CapybaraDefense: React.FC<CapybaraDefenseProps> = ({ onBackToMenu }) => {
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('capybara-defense-stats');
    return saved ? JSON.parse(saved) : {
      capybarasSaved: 0,
      totalScore: 0,
      bestSurvivalTime: 0,
      tokensEarned: 0,
      gamesPlayed: 0,
      currentStreak: 0
    };
  });
  
  const [showGame, setShowGame] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [unityError, setUnityError] = useState<string | null>(null);

  const { unityProvider, loadingProgression, isLoaded, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "unity-build/Build/WebGLBuild.loader.js",
    dataUrl: "unity-build/Build/WebGLBuild.data.unityweb",
    frameworkUrl: "unity-build/Build/WebGLBuild.framework.js.unityweb",
    codeUrl: "unity-build/Build/WebGLBuild.wasm.unityweb",
    companyName: "Capybara Team",
    productName: "Save the Capybara",
    productVersion: "1.0.0",
    streamingAssetsUrl: "unity-build/StreamingAssets",
  });

  // Unity will load automatically through the provider

  // Handle Unity events for the survival defense game
  const handleCapybaraSaved = useCallback((count: number) => {
    setGameStats(prev => ({
      ...prev,
      capybarasSaved: prev.capybarasSaved + count
    }));
  }, []);

  const handleGameComplete = useCallback((survivalTime: number, capybarasProtected: number, finalScore: number) => {
    const newStats = {
      capybarasSaved: gameStats.capybarasSaved + capybarasProtected,
      totalScore: gameStats.totalScore + finalScore,
      bestSurvivalTime: Math.max(gameStats.bestSurvivalTime, survivalTime),
      tokensEarned: gameStats.tokensEarned,
      gamesPlayed: gameStats.gamesPlayed + 1,
      currentStreak: capybarasProtected > 0 ? gameStats.currentStreak + 1 : 0
    };

    // Calculate $CAPY rewards based on protection performance
    const tokensEarned = calculateTokenRewards(survivalTime, capybarasProtected, finalScore);
    newStats.tokensEarned += tokensEarned;
    
    setGameStats(newStats);
  }, [gameStats]);

  const calculateTokenRewards = (survivalTime: number, capybarasProtected: number, score: number) => {
    // Reward calculation for capybara protection game
    const timeBonus = Math.floor(survivalTime / 30) * 0.002; // 0.002 $CAPY per 30 seconds survived
    const protectionBonus = capybarasProtected * 0.005; // 0.005 $CAPY per capybara saved
    const scoreBonus = Math.floor(score / 500) * 0.001; // 0.001 $CAPY per 500 points
    const streakMultiplier = Math.min(gameStats.currentStreak * 0.1, 1.0); // Up to 100% bonus for streaks
    
    const baseReward = timeBonus + protectionBonus + scoreBonus;
    const totalReward = baseReward * (1 + streakMultiplier);
    
    if (totalReward > 0) {
      console.log(`Earned ${totalReward.toFixed(6)} $CAPY for protecting ${capybarasProtected} capybaras!`);
      // TODO: Integrate with actual Solana reward distribution
    }
    
    return totalReward;
  };

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('capybara-defense-stats', JSON.stringify(gameStats));
  }, [gameStats]);

  useEffect(() => {
    if (isLoaded) {
      setGameReady(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    addEventListener("CapybaraSaved", handleCapybaraSaved);
    addEventListener("GameComplete", handleGameComplete);
    
    return () => {
      removeEventListener("CapybaraSaved", handleCapybaraSaved);
      removeEventListener("GameComplete", handleGameComplete);
    };
  }, [addEventListener, removeEventListener, handleCapybaraSaved, handleGameComplete]);

  const startGame = () => {
    if (gameReady) {
      setShowGame(true);
      sendMessage("GameManager", "StartDefenseMode");
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
          className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ 
            backgroundImage: `url('/images/AAA_capybara_wetland_background_ab88ce49.png')`,
            filter: 'brightness(0.7) contrast(1.2)',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="fixed inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-700/20 to-blue-800/40 -z-10" />
        
        <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
          {onBackToMenu && (
            <Button 
              onClick={onBackToMenu} 
              variant="outline" 
              className="mb-4 text-emerald-100 border-emerald-400/30 hover:bg-emerald-500/20 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Save the
              <span className="text-emerald-300"> Capybara</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-6">
              Protect our beloved capybaras from the buzzing danger and earn $CAPY rewards!
            </p>
          </div>

          {/* Game Stats Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.capybarasSaved}</h3>
              <p className="text-emerald-100">Capybaras Saved</p>
            </Card>
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Timer className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.bestSurvivalTime}s</h3>
              <p className="text-emerald-100">Best Survival</p>
            </Card>
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.currentStreak}</h3>
              <p className="text-emerald-100">Win Streak</p>
            </Card>
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Trophy className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.totalScore.toLocaleString()}</h3>
              <p className="text-emerald-100">Total Score</p>
            </Card>
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Coins className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.tokensEarned.toFixed(4)}</h3>
              <p className="text-emerald-100">$CAPY Earned</p>
            </Card>
            <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 p-4 text-center">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{gameStats.gamesPlayed}</h3>
              <p className="text-emerald-100">Missions Completed</p>
            </Card>
          </div>

          {/* Unity WebGL Game Section */}
          <div className="w-full mb-8">
            <div className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 rounded-lg p-4">
              {!gameReady ? (
                <div className="text-center p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Loading Game...</h2>
                  <div className="w-full bg-emerald-700/30 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-emerald-100">{Math.round(loadingProgression * 100)}% Ready</p>
                  {unityError && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-200 text-sm">{unityError}</p>
                      <p className="text-red-300 text-xs mt-2">
                        Check browser console (F12) for detailed error messages.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full" style={{ height: '600px' }}>
                  <Unity 
                    unityProvider={unityProvider} 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  />
                  
                  {/* Game Controls Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      onClick={pauseGame}
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                    >
                      ⏸️ Pause
                    </Button>
                    <Button
                      onClick={resumeGame}
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                    >
                      ▶️ Resume
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Description */}
          <Card className="mt-8 bg-emerald-900/20 backdrop-blur-md border-emerald-500/30">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🐾 Mission Briefing</h2>
              <div className="text-emerald-100 space-y-3">
                <p>
                  <strong>🚨 Situation:</strong> Swarms of aggressive bees are threatening our peaceful capybara sanctuary! 
                  As the chief protector, you must use advanced defense systems to keep them safe.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">🎮 How to Play:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• 🏗️ Build magical barriers to block bee swarms</li>
                      <li>• ⚡ Use power-ups to strengthen your defenses</li>
                      <li>• 💖 Keep all capybaras safe to earn maximum rewards</li>
                      <li>• ⏱️ Survive as long as possible for bonus points</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">💰 Rewards System:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• 🐾 +0.005 $CAPY per capybara saved</li>
                      <li>• ⏰ +0.002 $CAPY per 30 seconds survived</li>
                      <li>• 🏆 Score bonuses for perfect protection</li>
                      <li>• 🔥 Streak multipliers up to 100% extra</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Unity Build Status */}
          <Card className="mt-6 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 backdrop-blur-md border-purple-400/30">
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-white mb-2">🎯 Ready to Build Your Unity Game?</h3>
              <p className="text-purple-100 text-sm">
                Create the capybara defense mechanics in Unity, then build for WebGL and place the files in the unity/Build folder. 
                The game will automatically connect to our $CAPY reward system!
              </p>
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
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/80 z-40">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🛡️</div>
              <p className="text-xl mb-4">Initializing Defense Systems...</p>
              <div className="w-64 bg-emerald-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-4 rounded-full transition-all"
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