import React, { useEffect, useState } from 'react';
import { useGameState } from '../lib/stores/useGameState';
import { useAuthStore } from '../lib/stores/useWallet';
import { AuthModal } from './AuthModal';
import { MenuOverlay } from './MenuOverlay';
import { GameOverOverlay } from './GameOverOverlay';
import { Button } from './ui/button';

interface GameUIProps {
    game: Phaser.Game;
}

export const GameUI: React.FC<GameUIProps> = ({ game }) => {
    const { currentScene, level, score, timeLeft, ink } = useGameState();
    const { user, isLoggedIn, logout } = useAuthStore();
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    const handleStartGame = () => {
        if (game && game.scene) {
            game.scene.start('GameScene');
        }
    };
    
    const handleNextLevel = () => {
        const gameState = useGameState.getState();
        gameState.setLevel(gameState.level + 1);
        if (game && game.scene) {
            game.scene.start('GameScene');
        }
    };
    
    const handleRetry = () => {
        const gameState = useGameState.getState();
        gameState.setScore(Math.max(0, gameState.score - 50)); // Small penalty
        if (game && game.scene) {
            game.scene.start('GameScene');
        }
    };
    
    const handleBackToMenu = () => {
        useGameState.getState().resetGame();
        if (game && game.scene) {
            game.scene.start('MenuScene');
        }
    };

    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <>
            {/* Menu Overlay */}
            {currentScene === 'menu' && (
                <MenuOverlay onStartGame={handleStartGame} />
            )}
            
            {/* Game Over Overlay */}
            {currentScene === 'gameover' && (
                <GameOverOverlay 
                    won={useGameState.getState().capybaraAlive}
                    onNextLevel={handleNextLevel}
                    onRetry={handleRetry}
                    onBackToMenu={handleBackToMenu}
                />
            )}
            
            <div className="absolute inset-0 pointer-events-none">
                {/* Account Button - Always visible */}
                <div className="absolute top-6 right-6 pointer-events-auto">
                    {isLoggedIn ? (
                        <div className="flex gap-3 items-center">
                            <div className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg shadow-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">{user?.username}</span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">{formatWalletAddress(user?.walletAddress || '')}</div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={logout}
                                className="bg-white/90 hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => setShowAuthModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-colors"
                        >
                            Sign In
                        </Button>
                    )}
                </div>

                {/* Enhanced Game HUD - Only during gameplay */}
                {currentScene === 'game' && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <div className="bg-gradient-to-br from-blue-600/90 to-blue-800/90 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-400/30">
                            <div className="text-xs text-blue-200 font-medium mb-1">Level</div>
                            <div className="font-bold text-2xl text-center">{level}</div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/30">
                            <div className="text-xs text-emerald-200 font-medium mb-1">Score</div>
                            <div className="font-bold text-2xl text-center">{score.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-600/90 to-amber-800/90 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/30">
                            <div className="text-xs text-amber-200 font-medium mb-1">Time</div>
                            <div className="font-bold text-2xl text-center">{Math.round(timeLeft)}s</div>
                        </div>
                        
                        {/* Beautiful Ink Progress Bar */}
                        <div className="bg-gradient-to-br from-purple-600/90 to-purple-800/90 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-400/30 min-w-[120px]">
                            <div className="text-xs text-purple-200 font-medium mb-2">Magical Ink</div>
                            <div className="relative">
                                {/* Background bar */}
                                <div className="w-full h-3 bg-purple-900/50 rounded-full overflow-hidden">
                                    {/* Progress bar with color transitions */}
                                    <div 
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            ink > 60 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                            ink > 30 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                                            'bg-gradient-to-r from-red-400 to-red-600'
                                        }`}
                                        style={{ width: `${Math.max(0, ink)}%` }}
                                    />
                                    {/* Shine effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                </div>
                                {/* Percentage text */}
                                <div className="text-center mt-1 font-bold text-sm">{Math.round(ink)}%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Instructions - Only during drawing phase */}
                {currentScene === 'game' && timeLeft > 5 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-indigo-600/95 to-purple-600/95 backdrop-blur text-white px-8 py-6 rounded-2xl text-center shadow-2xl border border-indigo-400/30 max-w-md">
                        <div className="text-xl font-bold mb-3 text-yellow-300">✨ Draw Phase Active ✨</div>
                        <div className="text-lg font-semibold mb-2">Protect the Capybara!</div>
                        <div className="text-sm text-indigo-100">Drag to draw magical barriers and use your ink wisely</div>
                        <div className="mt-2 text-xs text-indigo-200">🖱️ Mouse • 👆 Touch • 🎯 Strategic placement</div>
                    </div>
                )}

                {/* Enhanced Survival phase indicator */}
                {currentScene === 'game' && timeLeft <= 5 && timeLeft > 0 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-red-500 to-red-700 text-white px-8 py-6 rounded-2xl text-center shadow-2xl border-2 border-red-300 animate-pulse">
                        <div className="text-2xl font-bold mb-2 text-yellow-300">🛡️ SURVIVE! 🛡️</div>
                        <div className="text-xl font-bold">{Math.round(timeLeft)} seconds left</div>
                        <div className="text-sm text-red-100 mt-2">Your barriers are protecting the capybara!</div>
                    </div>
                )}

                {/* Not logged in warning during game */}
                {currentScene === 'game' && !isLoggedIn && (
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-center text-sm border border-amber-200">
                        Sign in to save your scores
                    </div>
                )}
            </div>

            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
        </>
    );
};
