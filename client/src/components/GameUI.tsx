import React, { useEffect, useState } from 'react';
import { useGameState } from '../lib/stores/useGameState';
import { useAuthStore } from '../lib/stores/useWallet';
import { AuthModal } from './AuthModal';
import { Button } from './ui/button';

interface GameUIProps {
    game: Phaser.Game;
}

export const GameUI: React.FC<GameUIProps> = ({ game }) => {
    const { currentScene, level, score, timeLeft, ink } = useGameState();
    const { user, isLoggedIn, logout } = useAuthStore();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <>
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

                {/* Game HUD - Only during gameplay */}
                {currentScene === 'game' && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <div className="bg-white/90 backdrop-blur text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                            <div className="text-xs text-gray-500 font-medium">Level</div>
                            <div className="font-bold text-lg">{level}</div>
                        </div>
                        <div className="bg-white/90 backdrop-blur text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                            <div className="text-xs text-gray-500 font-medium">Score</div>
                            <div className="font-bold text-lg">{score.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/90 backdrop-blur text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                            <div className="text-xs text-gray-500 font-medium">Time</div>
                            <div className="font-bold text-lg">{Math.round(timeLeft)}s</div>
                        </div>
                        <div className="bg-white/90 backdrop-blur text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                            <div className="text-xs text-gray-500 font-medium">Ink</div>
                            <div className="font-bold text-lg">{Math.round(ink)}%</div>
                        </div>
                    </div>
                )}

                {/* Instructions - Only during drawing phase */}
                {currentScene === 'game' && timeLeft > 5 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur text-gray-900 px-6 py-4 rounded-lg text-center shadow-lg border border-gray-200 max-w-md">
                        <div className="text-lg font-semibold mb-2">Draw to Protect the Capybara</div>
                        <div className="text-sm text-gray-600">Drag to draw barriers and use your ink wisely</div>
                    </div>
                )}

                {/* Survival phase indicator */}
                {currentScene === 'game' && timeLeft <= 5 && timeLeft > 0 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-lg text-center shadow-lg animate-pulse">
                        <div className="text-xl font-bold mb-1">SURVIVE!</div>
                        <div className="text-lg">{Math.round(timeLeft)} seconds left</div>
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
