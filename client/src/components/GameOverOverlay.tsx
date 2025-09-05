import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../lib/stores/useGameState';
import { getNextLevel } from '../lib/levels';

interface GameOverOverlayProps {
    won: boolean;
    onNextLevel: () => void;
    onRetry: () => void;
    onBackToMenu: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ 
    won, 
    onNextLevel, 
    onRetry, 
    onBackToMenu 
}) => {
    const { level, score } = useGameState();
    const hasNextLevel = getNextLevel(level) !== null;

    return (
        <AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center max-w-lg mx-4"
                >
                    <Card className={`backdrop-blur-md shadow-2xl border-2 ${
                        won 
                            ? 'bg-gradient-to-br from-green-500/90 to-emerald-600/90 border-green-400/50' 
                            : 'bg-gradient-to-br from-red-500/90 to-red-600/90 border-red-400/50'
                    }`}>
                        <CardContent className="p-10 text-center text-white">
                            {/* Result Icon & Title */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                                className="mb-6"
                            >
                                <div className={`text-8xl mb-4 ${won ? '🎉' : '💔'}`}>
                                    {won ? '🎉' : '💔'}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                    {won ? 'Victory!' : 'Defeat!'}
                                </h1>
                                <p className={`text-xl ${won ? 'text-green-100' : 'text-red-100'}`}>
                                    {won ? 'The capybara is safe!' : 'The bees got through!'}
                                </p>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="mb-8 grid grid-cols-2 gap-4 text-center"
                            >
                                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                                    <div className="text-2xl font-bold">{score.toLocaleString()}</div>
                                    <div className="text-sm opacity-80">Final Score</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                                    <div className="text-2xl font-bold">{level}</div>
                                    <div className="text-sm opacity-80">Level Reached</div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                {won && hasNextLevel && (
                                    <Button
                                        onClick={onNextLevel}
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        🚀 Next Level
                                    </Button>
                                )}
                                
                                {!won && (
                                    <Button
                                        onClick={onRetry}
                                        size="lg"
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        🔄 Try Again
                                    </Button>
                                )}
                                
                                <Button
                                    onClick={onBackToMenu}
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    🏠 Main Menu
                                </Button>
                            </motion.div>

                            {/* Special message for completing all levels */}
                            {won && !hasNextLevel && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="mt-6 p-4 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-xl border border-yellow-300/30"
                                >
                                    <div className="text-2xl font-bold text-yellow-200 mb-2">
                                        🏆 Congratulations!
                                    </div>
                                    <div className="text-yellow-100">
                                        You've completed all levels and mastered the art of capybara protection!
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};