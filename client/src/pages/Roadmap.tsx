import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, CheckCircle, Clock, Star, Rocket, Trophy, Users, Zap } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const handleBack = () => {
    window.close();
  };

  const phases = [
    {
      phase: "Phase 1",
      title: "Foundation & Launch",
      status: "completed",
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      timeline: "Q4 2024",
      items: [
        "✅ Game core mechanics development",
        "✅ Solana wallet integration",
        "✅ 12 handcrafted levels",
        "✅ Achievement system implementation",
        "✅ User registration and authentication",
        "✅ Basic leaderboards",
        "✅ Community Telegram bot setup"
      ]
    },
    {
      phase: "Phase 2",
      title: "Token Launch & Rewards",
      status: "in-progress",
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
      timeline: "Q1 2025",
      items: [
        "🔄 $CAPY token deployment on PumpFun",
        "🔄 Play-to-earn reward system activation",
        "📅 Daily and weekly tournaments",
        "📅 Enhanced anti-cheat measures",
        "📅 Mobile responsive optimization",
        "📅 Social sharing features",
        "📅 Referral reward program"
      ]
    },
    {
      phase: "Phase 3",
      title: "Community & Expansion",
      status: "planned",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      timeline: "Q2 2025",
      items: [
        "🎯 Guild system and team battles",
        "🎯 Player-created level editor",
        "🎯 NFT capybara skins and customization",
        "🎯 Cross-platform mobile app launch",
        "🎯 Community governance voting",
        "🎯 Expanded Telegram bot features",
        "🎯 Partnership integrations"
      ]
    },
    {
      phase: "Phase 4",
      title: "Advanced Features",
      status: "planned",
      icon: <Star className="h-6 w-6 text-purple-400" />,
      timeline: "Q3 2025",
      items: [
        "⭐ PvP multiplayer battles",
        "⭐ Seasonal events and special levels",
        "⭐ Advanced analytics dashboard",
        "⭐ AI-powered level generation",
        "⭐ VR/AR experimental features",
        "⭐ Cross-chain bridge to Ethereum",
        "⭐ Merchandise and real-world rewards"
      ]
    },
    {
      phase: "Phase 5",
      title: "Ecosystem Expansion",
      status: "future",
      icon: <Rocket className="h-6 w-6 text-pink-400" />,
      timeline: "Q4 2025 & Beyond",
      items: [
        "🚀 Save the Capybara franchise expansion",
        "🚀 Developer SDK for third-party levels",
        "🚀 Metaverse integration and virtual worlds",
        "🚀 Educational partnerships and gamification",
        "🚀 Real-world capybara conservation initiatives",
        "🚀 Blockchain gaming conference sponsorships",
        "🚀 Global esports tournament series"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-400/30 bg-green-400/10';
      case 'in-progress': return 'border-yellow-400/30 bg-yellow-400/10';
      case 'planned': return 'border-blue-400/30 bg-blue-400/10';
      case 'future': return 'border-purple-400/30 bg-purple-400/10';
      default: return 'border-white/20 bg-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="mb-4 text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Development
            <span className="text-cyan-400"> Roadmap</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            Our journey to build the ultimate play-to-earn gaming experience on Solana. 
            Track our progress and see what's coming next.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">12</h3>
              <p className="text-blue-200">Levels Complete</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">1000+</h3>
              <p className="text-blue-200">Early Players</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
            <CardContent className="p-6">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">5</h3>
              <p className="text-blue-200">Major Phases</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
            <CardContent className="p-6">
              <Rocket className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">Q1 2025</h3>
              <p className="text-blue-200">Token Launch</p>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-8">
          {phases.map((phase, index) => (
            <Card key={index} className={`backdrop-blur-md ${getStatusColor(phase.status)} transition-all duration-300 hover:scale-[1.02]`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3">
                    {phase.icon}
                    <div>
                      <h2 className="text-2xl font-bold">{phase.phase}: {phase.title}</h2>
                      <p className="text-sm text-blue-200 font-normal">{phase.timeline}</p>
                    </div>
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    phase.status === 'completed' ? 'bg-green-400/20 text-green-300' :
                    phase.status === 'in-progress' ? 'bg-yellow-400/20 text-yellow-300' :
                    phase.status === 'planned' ? 'bg-blue-400/20 text-blue-300' :
                    'bg-purple-400/20 text-purple-300'
                  }`}>
                    {phase.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {phase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-blue-100 flex items-start gap-2">
                      <span className="text-sm mt-1">{item.substring(0, 2)}</span>
                      <span className="flex-1">{item.substring(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-cyan-400/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Be Part of Our Journey</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of players already enjoying Save the Capybara. Connect your wallet, 
              start playing, and earn rewards as we build the future of gaming together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-3">
                Start Playing Now
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10 px-8 py-3"
                onClick={() => window.open('https://t.me/SaveCapybaraBot', '_blank')}
              >
                Join Telegram Community
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-blue-300/70">
          <p className="text-sm">
            Roadmap is subject to change based on community feedback and market conditions.
            <br />
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};