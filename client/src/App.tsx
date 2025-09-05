import React from 'react';
import { WalletProvider } from './components/WalletProvider';
import { Game } from './components/Game';
import './index.css';

function App() {
  return (
    <WalletProvider>
      <div className="w-full h-full">
        <Game />
      </div>
    </WalletProvider>
  );
}

export default App;
