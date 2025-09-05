import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import { FileText, ShoppingCart, Map, MessageCircle, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnterGame: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterGame }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          {/* Logo/Title Area */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
              className="text-8xl mb-4"
            >
              🏛️
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Save the
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {' '}Capybara
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              The most chill play-to-earn tower defense game on Solana. 
              Draw barriers, protect the capybara, earn rewards.
            </p>
          </div>

          {/* Main Enter Button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Button
              onClick={onEnterGame}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 border-2 border-cyan-400/30"
            >
              <Zap className="mr-3 h-8 w-8" />
              ENTER GAME
            </Button>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {/* Whitepaper Button */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <Button
                onClick={handleWhitepaper}
                variant="ghost"
                className="text-white hover:text-cyan-300 flex flex-col items-center gap-3 h-auto p-4"
              >
                <FileText className="h-8 w-8" />
                <span className="text-lg font-semibold">Whitepaper</span>
                <span className="text-sm text-blue-200 text-center">Learn about our vision</span>
              </Button>
            </CardContent>
          </Card>

          {/* Buy Button */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <Button
                onClick={handleBuy}
                variant="ghost"
                className="text-white hover:text-green-300 flex flex-col items-center gap-3 h-auto p-4"
              >
                <ShoppingCart className="h-8 w-8" />
                <span className="text-lg font-semibold">Buy $CAPY</span>
                <span className="text-sm text-blue-200 text-center">Get tokens on PumpFun</span>
              </Button>
            </CardContent>
          </Card>

          {/* Roadmap Button */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <Button
                onClick={handleRoadmap}
                variant="ghost"
                className="text-white hover:text-purple-300 flex flex-col items-center gap-3 h-auto p-4"
              >
                <Map className="h-8 w-8" />
                <span className="text-lg font-semibold">Roadmap</span>
                <span className="text-sm text-blue-200 text-center">Our journey ahead</span>
              </Button>
            </CardContent>
          </Card>

          {/* Telegram Button */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <CardContent className="p-6">
              <Button
                onClick={handleTelegram}
                variant="ghost"
                className="text-white hover:text-blue-300 flex flex-col items-center gap-3 h-auto p-4"
              >
                <MessageCircle className="h-8 w-8" />
                <span className="text-lg font-semibold">Telegram Bot</span>
                <span className="text-sm text-blue-200 text-center">Join our community</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-blue-300/70 text-sm"
        >
          <p>Connect your Solana wallet • Play • Earn • Repeat</p>
        </motion.div>
      </div>
    </div>
  );
};