import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
const backgroundImage = '/images/AAA_capybara_wetland_background_ab88ce49.png';
const heroImage = '/images/AAA_capybara_hero_character_0a40b727.png';
const barrierImage = '/images/AAA_magical_barrier_UI_b6d0d11f.png';

interface MenuOverlayProps {
    onStartGame: () => void;
}

const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => (
    <motion.div
        className="absolute w-1 h-1 bg-green-300 rounded-full opacity-60"
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
        <div className="absolute inset-0 text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text blur-sm">
            {children}
        </div>
        <div className="relative">{children}</div>
    </div>
);

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ onStartGame }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        // Generate floating particles
        const particleArray = Array.from({ length: 20 }, (_, i) => i);
        setParticles(particleArray);
    }, []);

    return (
        <>
            {/* Background with parallax effect */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: `url(${backgroundImage})`,
                    filter: 'brightness(0.8) contrast(1.1)'
                }}
            />
            
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            
            {/* Floating particles */}
            <AnimatePresence>
                {particles.map(particle => (
                    <FloatingParticle key={particle} delay={particle * 0.4} />
                ))}
            </AnimatePresence>
            
            {/* Magical barrier effect */}
            <div 
                className="absolute inset-0 opacity-30 mix-blend-screen"
                style={{ 
                    backgroundImage: `url(${barrierImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'pulse 4s infinite ease-in-out'
                }}
            />

            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        duration: 1.2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        staggerChildren: 0.2
                    }}
                    className="flex flex-col items-center max-w-4xl mx-8 text-center"
                >
                    {/* Hero character */}
                    <motion.div
                        initial={{ y: -100, opacity: 0, rotate: -10 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ 
                            duration: 1.5, 
                            delay: 0.3,
                            type: "spring",
                            stiffness: 100,
                            damping: 10
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            rotate: 2,
                            transition: { duration: 0.3 }
                        }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-green-300/30 rounded-full blur-2xl scale-150" />
                        <img 
                            src={heroImage} 
                            alt="Capybara Hero" 
                            className="w-48 h-48 object-contain drop-shadow-2xl relative z-10"
                        />
                        
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
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mb-6"
                    >
                        <GlowingText className="text-6xl md:text-8xl font-bold text-white mb-2 leading-tight font-serif">
                            SAVE THE
                        </GlowingText>
                        <GlowingText className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight font-serif">
                            CAPYBARA
                        </GlowingText>
                        
                        {/* Subtitle */}
                        <motion.p 
                            className="text-xl md:text-2xl text-amber-100 mt-4 font-light tracking-wide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            Master the Ancient Art of Protective Drawing
                        </motion.p>
                    </motion.div>

                    {/* Game mechanics display */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mb-10 flex gap-8 text-center"
                    >
                        <div className="backdrop-blur-md bg-blue-600/30 border-2 border-blue-400/50 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                            <div className="text-3xl mb-2">⚡</div>
                            <div className="font-bold text-blue-200 text-lg">DRAW PHASE</div>
                            <div className="text-blue-100 text-sm">2.5 Seconds</div>
                        </div>
                        
                        <div className="backdrop-blur-md bg-red-600/30 border-2 border-red-400/50 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                            <div className="text-3xl mb-2">🛡️</div>
                            <div className="font-bold text-red-200 text-lg">SURVIVE PHASE</div>
                            <div className="text-red-100 text-sm">5 Seconds</div>
                        </div>
                    </motion.div>

                    {/* Start button */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            delay: 1.2, 
                            duration: 0.8,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                    >
                        <Button
                            onClick={onStartGame}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative group bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-400 hover:via-green-500 hover:to-emerald-400 text-white font-bold px-12 py-6 text-2xl rounded-2xl shadow-2xl hover:shadow-emerald-500/50 border-2 border-emerald-400 transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden"
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
                                <span>BEGIN QUEST</span>
                                <span className="text-3xl">✨</span>
                            </span>
                        </Button>
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                        className="mt-8 text-center text-amber-100/80 text-lg"
                    >
                        <p className="font-light tracking-wide">
                            Draw magical barriers with your cursor or finger
                        </p>
                        <p className="text-sm mt-2 text-amber-200/60">
                            Wisdom lies in strategic ink usage
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.02); }
                }
            `}</style>
        </>
    );
};