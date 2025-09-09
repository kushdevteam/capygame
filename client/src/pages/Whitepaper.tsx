import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Shield, Gamepad2, Coins, Users, Zap, Target } from 'lucide-react';

export const Whitepaper: React.FC = () => {
  const handleBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen relative overflow-y-auto" style={{ height: '100vh' }}>
      {/* Game Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ 
          backgroundImage: `url('/images/AAA_capybara_wetland_background_ab88ce49.png')`,
          filter: 'brightness(0.6) contrast(1.1)',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Atmospheric overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 -z-10" />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="mb-4 text-amber-100 border-amber-400/30 hover:bg-amber-500/20 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Save the Capybara
            <span className="text-amber-300"> Whitepaper</span>
          </h1>
          <p className="text-xl text-amber-100">
            The Future of Play-to-Earn Gaming on Solana
          </p>
        </div>

        <div className="space-y-8">
          {/* Executive Summary */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-6 w-6 text-amber-400" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <p>
                Save the Capybara is a thrilling endless adventure game built on the Solana blockchain. 
                Players guide brave capybaras through challenging island landscapes using precision jumping mechanics, 
                earning CAPYBARA rewards based on distance traveled, survival time, and collected treasures.
              </p>
              <p>
                Our mission is to create the most engaging and rewarding gaming experience in the Solana ecosystem, 
                combining addictive gameplay with real economic value for our community.
              </p>
            </CardContent>
          </Card>

          {/* Game Mechanics */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-emerald-400" />
                Game Mechanics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Precision Jumping System</h3>
                <p>Players control jump strength and distance with intuitive tap/hold mechanics. Master the art of timing and power to navigate between floating islands successfully.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Endless Adventure Mode</h3>
                <p>Survive as long as possible in procedurally generated island chains. Each run presents unique challenges with increasing difficulty and greater reward potential.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Treasure Collection</h3>
                <p>Collect coins, power-ups, and special items scattered throughout the island world. Strategic collection paths maximize both score and CAPYBARA token earnings.</p>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="h-6 w-6 text-amber-400" />
                Tokenomics (CAPYBARA)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Token Distribution</h3>
                  <ul className="space-y-1">
                    <li>• 40% - Play-to-Earn Rewards</li>
                    <li>• 25% - Liquidity Pool</li>
                    <li>• 20% - Community Treasury</li>
                    <li>• 10% - Development Team</li>
                    <li>• 5% - Marketing & Partnerships</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Earning Mechanisms</h3>
                  <ul className="space-y-1">
                    <li>• Daily achievement rewards</li>
                    <li>• Weekly tournament prizes</li>
                    <li>• Level completion bonuses</li>
                    <li>• Streak multipliers</li>
                    <li>• Community challenges</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Blockchain</h3>
                  <p>Built on Solana for fast, low-cost transactions and seamless user experience.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Game Engine</h3>
                  <p>Phaser 3 game engine with React for smooth gameplay and modern UI.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Wallet Integration</h3>
                  <p>Support for major Solana wallets including Phantom, Solflare, and Backpack.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
                  <p>Smart contract audits and secure player data management with PostgreSQL.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-green-400" />
                Community & Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <p>
                Our community is at the heart of Save the Capybara. Token holders will have voting rights 
                on key decisions including new features, tournament formats, and reward distributions.
              </p>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Community Features</h3>
                <ul className="space-y-1">
                  <li>• Global leaderboards and competitions</li>
                  <li>• Player guilds and team challenges</li>
                  <li>• Community-created level contests</li>
                  <li>• Regular AMAs and developer updates</li>
                  <li>• Telegram bot for community management</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-amber-900/20 backdrop-blur-md border-amber-500/30 hover:bg-amber-900/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-400" />
                Security & Fair Play
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-50 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Anti-Cheat Measures</h3>
                <ul className="space-y-1">
                  <li>• Server-side validation of all game actions</li>
                  <li>• One wallet per player restriction</li>
                  <li>• Behavioral analysis for bot detection</li>
                  <li>• Community reporting system</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Protection</h3>
                <p>
                  All player data is encrypted and stored securely. We follow GDPR compliance standards 
                  and never share personal information with third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conclusion */}
          <Card className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 backdrop-blur-md border-amber-400/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Join the Capybara Revolution</h2>
              <p className="text-amber-50 mb-6">
                Save the Capybara represents the next evolution in play-to-earn gaming. With our unique 
                blend of skill-based gameplay, fair tokenomics, and community-driven development, 
                we're building more than just a game – we're creating a sustainable gaming economy.
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold px-8 py-3">
                Start Playing Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};