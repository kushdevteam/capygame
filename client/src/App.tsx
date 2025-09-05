import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './components/WalletProvider';
import { Game } from './components/Game';
import { LandingPage } from './pages/LandingPage';
import { Whitepaper } from './pages/Whitepaper';
import { Roadmap } from './pages/Roadmap';
import './index.css';

function App() {
  const [showGame, setShowGame] = useState(false);

  const handleEnterGame = () => {
    setShowGame(true);
  };

  const handleBackToLanding = () => {
    setShowGame(false);
  };

  return (
    <Router>
      <Routes>
        {/* Whitepaper route - opens in new window */}
        <Route path="/whitepaper" element={<Whitepaper />} />
        
        {/* Roadmap route - opens in new window */}
        <Route path="/roadmap" element={<Roadmap />} />
        
        {/* Main application route */}
        <Route path="/*" element={
          <WalletProvider>
            <div className="w-full h-full">
              {!showGame ? (
                <LandingPage onEnterGame={handleEnterGame} />
              ) : (
                <div className="relative w-full h-full">
                  {/* Back to Landing Button */}
                  <button
                    onClick={handleBackToLanding}
                    className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    ← Back to Landing
                  </button>
                  <Game />
                </div>
              )}
            </div>
          </WalletProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;