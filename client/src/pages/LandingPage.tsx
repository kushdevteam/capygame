import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ShoppingCart, Map, MessageCircle, Zap } from 'lucide-react';

const backgroundImage = '/images/AAA_capybara_wetland_background_ab88ce49.png';
const heroImage = '/images/custom_capybara.png';
const barrierImage = '/images/AAA_magical_barrier_UI_b6d0d11f.png';

const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => (
    <motion.div
        className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-60"
        initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 10,
            opacity: 0 
        }}
        animate={{ 
            y: -10,
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
        }}
        transition={{ 
            duration: 8,
            delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
            ease: "linear"
        }}
    />
);

const GlowingText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`relative ${className}`}>
        <div className="absolute inset-0 text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text blur-[1px]">
            {children}
        </div>
        <div className="relative bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">{children}</div>
    </div>
);

interface LandingPageProps {
  onEnterGame: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterGame }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate floating particles
    const particleArray = Array.from({ length: 15 }, (_, i) => i);
    setParticles(particleArray);
  }, []);

  const handleWhitepaper = () => {
    window.open('/whitepaper', '_blank');
  };

  const handleBuy = () => {
    // Placeholder for pump.fun link - will be updated when contract address is available
    alert('Contract address coming soon! Stay tuned to our Telegram for updates.');
  };

  const handleRoadmap = () => {
    window.open('/roadmap', '_blank');
  };

  const handleTelegram = () => {
    window.open('https://t.me/SaveCapybaraBot', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Game Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      />
      
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <FloatingParticle key={particle} delay={particle * 0.4} />
        ))}
      </AnimatePresence>
      
      {/* Magical barrier effect */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-screen"
        style={{ 
          backgroundImage: `url(${barrierImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'pulse 4s infinite ease-in-out'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          {/* Hero character */}
          <motion.div
            initial={{ y: -100, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: 2,
              transition: { duration: 0.3 }
            }}
            className="mb-8 relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-green-300/30 rounded-full blur-2xl scale-150" />
            <div className="w-32 h-32 relative z-10">
              <img 
                src={heroImage} 
                alt="Capybara Hero" 
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 235, 59, 0.3))'
                }}
              />
            </div>
            
            {/* Floating crown effect */}
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          {/* Title */}
          <div className="mb-8">
            <GlowingText className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight font-serif">
              SAVE THE
            </GlowingText>
            <GlowingText className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight font-serif">
              CAPYBARA
            </GlowingText>
            <motion.p 
              className="text-lg md:text-xl text-amber-100 mt-4 font-light tracking-wide max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Master the Ancient Art of Protective Drawing on Solana
            </motion.p>
          </div>

          {/* Main Enter Button */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="mb-12"
          >
            <Button
              onClick={onEnterGame}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-400 hover:via-green-500 hover:to-emerald-400 text-white font-bold px-12 py-4 text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/50 border-2 border-emerald-400 transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />
              
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={isHovered ? {
                  x: ['-100%', '200%'],
                  transition: { duration: 0.8, ease: "easeInOut" }
                } : {}}
              />
              
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-3xl">⚔️</span>
                <span>ENTER QUEST</span>
                <span className="text-3xl">✨</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>


        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {/* Whitepaper Button */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-4">
              <Button
                onClick={handleWhitepaper}
                variant="ghost"
                className="text-amber-100 hover:text-amber-300 flex flex-col items-center gap-2 h-auto p-3"
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-semibold">Whitepaper</span>
              </Button>
            </CardContent>
          </Card>

          {/* Buy Button */}
          <Card className="bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 hover:bg-emerald-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-4">
              <Button
                onClick={handleBuy}
                variant="ghost"
                className="text-emerald-100 hover:text-emerald-300 flex flex-col items-center gap-2 h-auto p-3"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm font-semibold">Buy $CAPY</span>
              </Button>
            </CardContent>
          </Card>

          {/* Roadmap Button */}
          <Card className="bg-purple-900/20 backdrop-blur-md border-purple-500/30 hover:bg-purple-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-4">
              <Button
                onClick={handleRoadmap}
                variant="ghost"
                className="text-purple-100 hover:text-purple-300 flex flex-col items-center gap-2 h-auto p-3"
              >
                <Map className="h-6 w-6" />
                <span className="text-sm font-semibold">Roadmap</span>
              </Button>
            </CardContent>
          </Card>

          {/* Telegram Button */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30 hover:bg-blue-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-4">
              <Button
                onClick={handleTelegram}
                variant="ghost"
                className="text-blue-100 hover:text-blue-300 flex flex-col items-center gap-2 h-auto p-3"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm font-semibold">Telegram Bot</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-8 text-center text-amber-100/80"
        >
          <p className="text-lg font-light tracking-wide">
            Draw magical barriers with your cursor or finger
          </p>
          <p className="text-sm mt-2 text-amber-200/60">
            Connect Solana wallet • Play • Earn • Repeat
          </p>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};