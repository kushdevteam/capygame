import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const backgroundImage = '/images/AAA_capybara_wetland_background_ab88ce49.png';
const heroImage = '/images/AAA_capybara_hero_character_0a40b727.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Entering the mystical wetlands...');

  const loadingMessages = [
    'Entering the mystical wetlands...',
    'Awakening the capybara guardian...',
    'Preparing magical barriers...',
    'Summoning protective spirits...',
    'Ready for adventure!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update loading text based on progress
        const messageIndex = Math.floor((newProgress / 100) * loadingMessages.length);
        if (messageIndex < loadingMessages.length) {
          setLoadingText(loadingMessages[messageIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.6) contrast(1.1)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Enhanced floating elements with better animations */}
        <motion.div className="mb-8">
          <div className="w-72 h-72 relative">
            {/* Rotating sparkles */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >✨</motion.div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >✨</motion.div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >✨</motion.div>
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >✨</motion.div>
              </div>
            </motion.div>
            
            {/* Floating bees with more natural movement */}
            <motion.div
              className="absolute top-1/4 right-1/4"
              animate={{ 
                x: [0, 20, -10, 15, 0], 
                y: [0, -15, 10, -5, 0],
                rotate: [0, 10, -5, 8, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-3xl">🐝</div>
            </motion.div>
            
            <motion.div
              className="absolute bottom-1/4 left-1/4"
              animate={{ 
                x: [0, -15, 20, -10, 0], 
                y: [0, 10, -20, 15, 0],
                rotate: [0, -8, 12, -6, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="text-3xl">🐝</div>
            </motion.div>
            
            {/* Additional floating magical elements */}
            <motion.div
              className="absolute top-1/3 left-1/3 text-2xl opacity-60"
              animate={{ 
                y: [0, -20, 0], 
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >🌟</motion.div>
            
            <motion.div
              className="absolute bottom-1/3 right-1/3 text-2xl opacity-60"
              animate={{ 
                y: [0, 20, 0], 
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >🌟</motion.div>
          </div>
        </motion.div>
        
        {/* Loading text */}
        <motion.h2 
          className="text-3xl font-bold text-amber-100 mb-8"
          key={loadingText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loadingText}
        </motion.h2>
        
        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="bg-amber-900/30 rounded-full h-4 backdrop-blur-sm border border-amber-500/30">
            <motion.div 
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 h-full rounded-full relative overflow-hidden"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
          
          {/* Progress percentage */}
          <motion.p 
            className="text-amber-200 text-lg mt-4 font-light"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress}%
          </motion.p>
        </div>
      </div>
    </div>
  );
};