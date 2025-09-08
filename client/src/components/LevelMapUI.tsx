import React, { useState } from 'react';
import { Play, Star, Lock, Home } from 'lucide-react';
import { useGameState } from '../lib/stores/useGameState';

interface LevelMapUIProps {
  onLevelSelect: (level: number) => void;
  onBackToMenu: () => void;
  gameMode: 'drawing' | 'tower-defense';
}

const LevelMapUI: React.FC<LevelMapUIProps> = ({ onLevelSelect, onBackToMenu, gameMode }) => {
  const { level: currentLevel, score } = useGameState();
  
  // Level data with different themes and difficulties
  const levels = [
    { id: 1, name: "Garden Start", color: "bg-green-500", unlocked: true, stars: 3 },
    { id: 2, name: "Pond Defense", color: "bg-blue-500", unlocked: currentLevel >= 1, stars: 2 },
    { id: 3, name: "Forest Path", color: "bg-emerald-600", unlocked: currentLevel >= 2, stars: 0 },
    { id: 4, name: "River Crossing", color: "bg-cyan-500", unlocked: currentLevel >= 3, stars: 0 },
    { id: 5, name: "Meadow Battle", color: "bg-lime-500", unlocked: currentLevel >= 4, stars: 0 },
    { id: 6, name: "Rocky Hills", color: "bg-amber-600", unlocked: currentLevel >= 5, stars: 0 },
    { id: 7, name: "Sunset Valley", color: "bg-orange-500", unlocked: currentLevel >= 6, stars: 0 },
    { id: 8, name: "Purple Peaks", color: "bg-purple-500", unlocked: currentLevel >= 7, stars: 0 },
    { id: 9, name: "Golden Fields", color: "bg-yellow-500", unlocked: currentLevel >= 8, stars: 0 },
    { id: 10, name: "Crystal Cave", color: "bg-indigo-500", unlocked: currentLevel >= 9, stars: 0 },
    { id: 11, name: "Volcanic Ridge", color: "bg-red-500", unlocked: currentLevel >= 10, stars: 0 },
    { id: 12, name: "Final Hive", color: "bg-gray-800", unlocked: currentLevel >= 11, stars: 0 },
  ];

  const modeTitle = gameMode === 'drawing' ? 'Save the Capybara' : 'Tower Defense';
  const modeDescription = gameMode === 'drawing' 
    ? 'Draw magical barriers to protect the capybara!'
    : 'Build capybara towers to defend against bee invasions!';

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-sky-400 flex flex-col z-[9999]">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg p-4 flex items-center justify-between">
        <button 
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Home size={20} />
          Back to Menu
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{modeTitle}</h1>
          <p className="text-gray-600">{modeDescription}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-800">Score: {score}</div>
          <div className="text-sm text-gray-600">Level: {currentLevel}</div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          <div className="absolute inset-0 opacity-20 bg-repeat" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}>
          </div>
        </div>

        {/* Level Grid */}
        <div className="relative z-10 p-8 h-full flex items-center justify-center">
          <div className="grid grid-cols-4 gap-6 max-w-4xl">
            {levels.map((levelData) => (
              <LevelCard
                key={levelData.id}
                level={levelData}
                isCurrentLevel={levelData.id === currentLevel}
                onSelect={() => levelData.unlocked && onLevelSelect(levelData.id)}
              />
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-purple-300 rounded-full opacity-50"></div>
        <div className="absolute bottom-40 right-10 w-14 h-14 bg-green-300 rounded-full opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
};

interface LevelCardProps {
  level: {
    id: number;
    name: string;
    color: string;
    unlocked: boolean;
    stars: number;
  };
  isCurrentLevel: boolean;
  onSelect: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isCurrentLevel, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!level.unlocked) {
    return (
      <div className="relative group">
        <div className="w-24 h-24 bg-gray-300 rounded-xl flex items-center justify-center shadow-lg">
          <Lock size={24} className="text-gray-500" />
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-medium">
          Level {level.id}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Main Level Button */}
      <div className={`
        w-24 h-24 ${level.color} rounded-xl flex items-center justify-center shadow-lg 
        transform transition-all duration-200 relative overflow-hidden
        ${isHovered ? 'scale-110 shadow-2xl' : ''}
        ${isCurrentLevel ? 'ring-4 ring-yellow-400 ring-opacity-70' : ''}
      `}>
        {/* Level Number */}
        <span className="text-2xl font-bold text-white z-10">
          {level.id}
        </span>
        
        {/* Play Icon on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Play size={28} className="text-white" fill="currentColor" />
          </div>
        )}
        
        {/* Current Level Indicator */}
        {isCurrentLevel && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Level Name */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 font-medium text-center whitespace-nowrap">
        {level.name}
      </div>

      {/* Stars */}
      {level.stars > 0 && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < level.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-20">
          {level.name}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default LevelMapUI;