import React, { useState } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { CapybaraDefense } from './CapybaraDefense';
import { BackgroundMusic } from './BackgroundMusic';
import { useGameState } from '../lib/stores/useGameState';

export const Game: React.FC = () => {
    const { currentScene } = useGameState();
    const [showLoading, setShowLoading] = useState(true);

    const handleLoadingComplete = () => {
        setShowLoading(false);
    };

    return (
        <div className="relative w-full h-full">
            {showLoading ? (
                <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            ) : (
                <CapybaraDefense />
            )}
            <BackgroundMusic isPlaying={currentScene === 'game'} />
        </div>
    );
};