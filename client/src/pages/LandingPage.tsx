import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ShoppingCart, MessageCircle, Zap, User, LogOut, Wallet, Music, Trophy } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { Leaderboard } from '../components/Leaderboard';
import { useAuthStore } from '../lib/stores/useWallet';

const backgroundImage = '/images/AAA_capybara_wetland_background_ab88ce49.png';
const heroImage = '/images/AAA_capybara_hero_character_0a40b727.png';
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
  onEnterAdventure?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterGame, onEnterAdventure }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { user, isLoggedIn, logout } = useAuthStore();

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


  const handleTelegram = () => {
    window.open('https://t.me/SaveCapybaraBot', '_blank');
  };

  const handleTikTok = () => {
    window.open('https://www.tiktok.com/@capybarahouse.t', '_blank');
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
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <GlowingText className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight font-serif">
            CAPYBARA COIN
          </GlowingText>
          <motion.p 
            className="text-xl md:text-2xl text-amber-100 font-light tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Epic Island-Hopping Adventure with Play-to-Earn Rewards
          </motion.p>
        </motion.div>

        {/* Primary Actions Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-10"
        >
          {/* Main Game Button */}
          <div className="mb-6">
            <Button
              onClick={onEnterGame}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-400 hover:via-green-500 hover:to-emerald-400 text-white font-bold px-16 py-8 text-2xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 border-2 border-emerald-400 transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden"
              data-testid="button-start-capirush"
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
              
              <span className="relative z-10 flex items-center gap-4">
                <span className="text-3xl">🐹</span>
                <span className="text-3xl">ENTER</span>
                <span className="text-3xl">✨</span>
              </span>
            </Button>
          </div>

          {/* Connect Wallet */}
          <div className="flex justify-center">
            {isLoggedIn ? (
              <Card className="bg-gradient-to-r from-violet-500/20 to-purple-600/20 backdrop-blur-md border-violet-400/40 hover:border-violet-300/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/25">
                <CardContent className="px-8 py-4">
                  <Button
                    onClick={logout}
                    variant="ghost"
                    className="text-violet-100 hover:text-white flex items-center gap-3 h-auto p-3 text-lg font-semibold"
                  >
                    <User className="h-6 w-6" />
                    <span>Welcome, {user?.username || 'Player'}!</span>
                    <LogOut className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-violet-500/20 to-purple-600/20 backdrop-blur-md border-violet-400/40 hover:border-violet-300/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/25">
                <CardContent className="px-8 py-4">
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="ghost"
                    className="text-violet-100 hover:text-white flex items-center gap-3 h-auto p-3 text-lg font-semibold"
                  >
                    <Wallet className="h-6 w-6" />
                    <span>Connect Wallet</span>
                    <Zap className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Game Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="bg-emerald-900/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30">
            <h4 className="text-emerald-300 font-semibold text-xl mb-3">🎮 Master precision jumping through endless floating islands</h4>
            <p className="text-emerald-100/80 text-base leading-relaxed">
              Guide our beloved capybara through mystical landscapes! Collect coins, dodge obstacles, and earn crypto rewards!
            </p>
          </div>
        </motion.div>

        {/* Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {/* Whitepaper Button */}
            <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <CardContent className="p-4">
                <Button
                  onClick={handleWhitepaper}
                  variant="ghost"
                  className="text-amber-100 hover:text-amber-300 flex flex-col items-center gap-2 h-auto p-3 w-full"
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
                  className="text-emerald-100 hover:text-emerald-300 flex flex-col items-center gap-2 h-auto p-3 w-full"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm font-semibold">Buy CAPYBARA</span>
                </Button>
              </CardContent>
            </Card>


            {/* Telegram Button */}
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30 hover:bg-blue-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <CardContent className="p-4">
                <Button
                  onClick={handleTelegram}
                  variant="ghost"
                  className="text-blue-100 hover:text-blue-300 flex flex-col items-center gap-2 h-auto p-3 w-full"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-sm font-semibold">Telegram Bot</span>
                </Button>
              </CardContent>
            </Card>

            {/* TikTok Button */}
            <Card className="bg-pink-900/20 backdrop-blur-md border-pink-500/30 hover:bg-pink-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <CardContent className="p-4">
                <Button
                  onClick={handleTikTok}
                  variant="ghost"
                  className="text-pink-100 hover:text-pink-300 flex flex-col items-center gap-2 h-auto p-3 w-full"
                >
                  <Music className="h-6 w-6" />
                  <span className="text-sm font-semibold">TikTok</span>
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard Button */}
            <Card className="bg-yellow-900/20 backdrop-blur-md border-yellow-500/30 hover:bg-yellow-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowLeaderboard(true)}
                  variant="ghost"
                  className="text-yellow-100 hover:text-yellow-300 flex flex-col items-center gap-2 h-auto p-3 w-full"
                >
                  <Trophy className="h-6 w-6" />
                  <span className="text-sm font-semibold">Leaderboard</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Footer Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center text-amber-100/60"
        >
          <p className="text-base font-light tracking-wide">
            Connect Solana wallet • Jump • Survive • Earn CAPYBARA
          </p>
        </motion.div>
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Leaderboard Modal */}
      <Leaderboard
        isVisible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};