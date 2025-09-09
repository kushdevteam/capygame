import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Medal, Crown, Star, Timer, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  username: string;
  walletAddress: string;
  score: number;
  position?: number;
  rank?: number;
}

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'all_time'>('all_time');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaderboard = async (type: 'daily' | 'weekly' | 'all_time') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/leaderboard?type=${type}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      // Extract the correct leaderboard array based on the type
      const leaderboardData = data[type] || data.leaderboard || [];
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchLeaderboard(activeTab);
    }
  }, [isVisible, activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'bg-emerald-900/20 border-emerald-500/30';
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-b from-emerald-900/30 to-emerald-800/30 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-red-500/20 hover:text-red-300"
            >
              ✕
            </Button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all_time', label: 'All Time', icon: <Target className="h-4 w-4" /> },
              { key: 'weekly', label: 'Weekly', icon: <Timer className="h-4 w-4" /> },
              { key: 'daily', label: 'Daily', icon: <Star className="h-4 w-4" /> }
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key as any)}
                variant={activeTab === key ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${
                  activeTab === key 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700/30'
                }`}
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
                <p className="text-emerald-100 mt-2">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
                <Button 
                  onClick={() => fetchLeaderboard(activeTab)}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  Retry
                </Button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-emerald-400 mx-auto mb-4 opacity-50" />
                <p className="text-emerald-100">No scores yet. Be the first to play!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = entry.position || entry.rank || (index + 1);
                  return (
                    <motion.div
                      key={`${entry.username}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`${getRankBg(rank)} backdrop-blur-sm hover:scale-[1.02] transition-all duration-200`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getRankIcon(rank)}
                                <span className="text-white font-bold text-lg">#{rank}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">{entry.username}</h3>
                                <p className="text-emerald-200 text-sm">{formatWalletAddress(entry.walletAddress)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-400">{entry.score.toLocaleString()}</div>
                              <div className="text-emerald-200 text-sm">Champion</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-emerald-200 text-sm">
              🏆 Play CAPYBARA COIN to climb the ranks! 🏆
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};