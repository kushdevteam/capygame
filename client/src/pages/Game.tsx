import React, { useState } from 'react';
import { UnityGameLoader } from '../components/UnityGameLoader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Coins, Trophy, Timer, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface GamePageProps {
  onBack: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ onBack }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [totalCapybarasSaved, setTotalCapybarasSaved] = useState(0);
  const [longestSurvivalTime, setLongestSurvivalTime] = useState(0);
  const [totalCapyTokensEarned, setTotalCapyTokensEarned] = useState(0);

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const handleGameComplete = (survivalTime: number, capybarasProtected: number, finalScore: number) => {
    // Calculate $CAPY rewards
    const survivalReward = Math.floor(survivalTime / 30) * 0.002; // 0.002 $CAPY per 30 seconds
    const protectionReward = capybarasProtected * 0.005; // 0.005 $CAPY per capybara saved
    const totalReward = survivalReward + protectionReward;

    // Update stats
    setTotalCapybarasSaved(prev => prev + capybarasProtected);
    setLongestSurvivalTime(prev => Math.max(prev, survivalTime));
    setTotalCapyTokensEarned(prev => prev + totalReward);

    // Show completion message
    console.log(`Game Complete! Earned ${totalReward.toFixed(3)} $CAPY tokens`);
    
    // Here you would typically send rewards to the user's wallet
    // or update their balance in your backend
  };

  const handleCapybaraSaved = (count: number) => {
    // Real-time capybara save tracking
    console.log(`Capybara saved! +${count * 0.005} $CAPY`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Capybara Adventure
            </h1>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-emerald-600">
                <Coins className="w-4 h-4 mr-1" />
                {totalCapyTokensEarned.toFixed(3)} $CAPY
              </div>
              <div className="flex items-center text-amber-600">
                <Trophy className="w-4 h-4 mr-1" />
                {currentScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white/50 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardContent className="p-6 h-full">
                <div className="h-full rounded-lg overflow-hidden shadow-inner">
                  <UnityGameLoader
                    onScoreUpdate={handleScoreUpdate}
                    onGameComplete={handleGameComplete}
                    onCapybaraSaved={handleCapybaraSaved}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* Current Game Stats */}
            <Card className="bg-white/50 backdrop-blur-sm border-amber-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Current Game
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-600">Score:</span>
                    <span className="font-semibold text-amber-800">{currentScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Stats */}
            <Card className="bg-white/50 backdrop-blur-sm border-emerald-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-emerald-800 mb-3 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  All-Time Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600">Capybaras Saved:</span>
                    <motion.span 
                      className="font-semibold text-emerald-800"
                      key={totalCapybarasSaved}
                      initial={{ scale: 1.2, color: '#059669' }}
                      animate={{ scale: 1, color: '#065f46' }}
                      transition={{ duration: 0.3 }}
                    >
                      {totalCapybarasSaved}
                    </motion.span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Best Survival:</span>
                    <span className="font-semibold text-emerald-800 flex items-center">
                      <Timer className="w-3 h-3 mr-1" />
                      {longestSurvivalTime}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Total Earned:</span>
                    <motion.span 
                      className="font-semibold text-emerald-800 flex items-center"
                      key={totalCapyTokensEarned}
                      initial={{ scale: 1.2, color: '#059669' }}
                      animate={{ scale: 1, color: '#065f46' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {totalCapyTokensEarned.toFixed(3)} $CAPY
                    </motion.span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Info */}
            <Card className="bg-white/50 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-orange-800 mb-3">Reward System</h3>
                <div className="space-y-2 text-xs text-orange-700">
                  <div className="flex justify-between">
                    <span>Per Capybara Saved:</span>
                    <span className="font-semibold">+0.005 $CAPY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per 30s Survival:</span>
                    <span className="font-semibold">+0.002 $CAPY</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};