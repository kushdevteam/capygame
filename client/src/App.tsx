import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './components/WalletProvider';
import { WorkingCapiRush } from './components/WorkingCapiRush';
import { LandingPage } from './pages/LandingPage';
import { Whitepaper } from './pages/Whitepaper';
import { GamePage } from './pages/Game';
import './index.css';

function App() {
  const [currentGame, setCurrentGame] = useState<'none' | 'capirush'>('none');

  const handleEnterGame = () => {
    setCurrentGame('capirush');
  };

  const handleBackToLanding = () => {
    setCurrentGame('none');
  };

  return (
    <Router>
      <Routes>
        {/* Whitepaper route - opens in new window */}
        <Route path="/whitepaper" element={<Whitepaper />} />
        
        
        {/* Game route - New CAPYBARA COIN Infinite Runner */}
        <Route path="/game" element={
          <WalletProvider>
            <WorkingCapiRush onBackToMenu={() => window.location.href = '/'} />
          </WalletProvider>
        } />
        
        {/* Main application route */}
        <Route path="/*" element={
          <WalletProvider>
            <div className="w-full h-full">
              {currentGame === 'none' ? (
                <LandingPage 
                  onEnterGame={handleEnterGame}
                  onEnterAdventure={handleEnterGame}
                />
              ) : currentGame === 'capirush' ? (
                <WorkingCapiRush onBackToMenu={handleBackToLanding} />
              ) : null}
            </div>
          </WalletProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;