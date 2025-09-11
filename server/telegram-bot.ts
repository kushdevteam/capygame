// Telegram Bot for Save the Capybara Community
// This file contains the basic structure for a Telegram bot

import { Bot, InlineKeyboard } from 'grammy';

// Get bot token from environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

let bot: Bot | null = null;

if (!BOT_TOKEN) {
  console.log('TELEGRAM_BOT_TOKEN not found in environment variables');
  console.log('Telegram bot will be disabled. To enable it:');
  console.log('1. Message @BotFather on Telegram');
  console.log('2. Create a new bot with /newbot');
  console.log('3. Add the token to your Replit environment variables');
} else {
  console.log('Starting Telegram bot with token:', BOT_TOKEN.substring(0, 10) + '...');
  
  bot = new Bot(BOT_TOKEN);

  // Welcome message with interactive buttons
  bot.command('start', (ctx) => {
    const keyboard = new InlineKeyboard()
      .text('🎮 Start Adventure', 'play')
      .text('📊 My Stats', 'stats').row()
      .text('💰 $CAPY Token', 'buy')
      .text('🏆 Leaderboard', 'leaderboard').row()
      .text('🎯 How to Play', 'tutorial')
      .text('🏅 Achievements', 'achievements');

    ctx.reply(
      `🏛️ Welcome to Save the Capybara! 🏛️\n\n` +
      `⚡ The ultimate endless runner adventure on Solana!\n\n` +
      `🏔️ Jump between floating islands with precision\n` +
      `🚀 Master tap & hold mechanics for perfect jumps\n` +
      `💰 Collect treasures and survive as far as possible\n` +
      `🎯 Earn CAPYBARA rewards based on distance traveled\n\n` +
      `Ready to become the ultimate Island Adventurer?`,
      { reply_markup: keyboard }
    );
  });

  // Game link with buttons - Use custom domain for production
  const gameUrl = 'https://capybaracoin.app';
  
  const handlePlayGame = (ctx: any) => {
    const keyboard = new InlineKeyboard()
      .webApp('🏔️ Start Adventure', gameUrl)
      .text('📱 Mobile Tips', 'mobile_tips').row()
      .text('🎯 Quick Tutorial', 'tutorial')
      .text('🔙 Main Menu', 'main_menu');

    ctx.reply(
      `🏔️ Ready to master the endless islands?\n\n` +
      `✨ Your Mission: Guide the Capybara to Safety!\n\n` +
      `🚀 **Precision Jumping:**\n` +
      `• Tap for short hops, hold for long jumps\n` +
      `• Master timing and power control\n` +
      `• Navigate between floating islands safely\n\n` +
      `💰 **Endless Adventure:**\n` +
      `• Survive as long as possible in procedural worlds\n` +
      `• Collect treasures and power-ups\n` +
      `• Distance traveled = CAPYBARA rewards!\n\n` +
      `🎯 How far can you go in the endless islands?`,
      { reply_markup: keyboard }
    );
  };

  bot.command('play', handlePlayGame);

  // Player statistics with buttons
  const handleStats = async (ctx: any) => {
    const username = ctx.from?.username || 'Adventurer';
    
    const keyboard = new InlineKeyboard()
      .text('🎮 Continue Adventure', 'play')
      .text('🏆 Rankings', 'leaderboard').row()
      .text('🏅 View Achievements', 'achievements')
      .text('🔙 Main Menu', 'main_menu');
    
    // In production, fetch real stats from your database
    ctx.reply(
      `📊 ${username}'s Adventure Profile:\n\n` +
      `🏔️ **Island Progress:**\n` +
      `• Farthest Distance: 0 islands\n` +
      `• Best Run: 0 meters\n` +
      `• Total Score: 0 points\n\n` +
      `🚀 **Jumping Mastery:**\n` +
      `• Jump Accuracy: --%\n` +
      `• Survival Time: -- seconds\n` +
      `• Treasure Collected: 0\n\n` +
      `💎 **Rewards:**\n` +
      `• $CAPYBARA Earned: 0 tokens\n` +
      `• Achievement Points: 0\n\n` +
      `🔗 Connect your Solana wallet to start tracking!`,
      { reply_markup: keyboard }
    );
  };

  bot.command('stats', handleStats);

  // Leaderboard with buttons
  const handleLeaderboard = (ctx: any) => {
    const keyboard = new InlineKeyboard()
      .text('🎮 Beat the Record', 'play')
      .text('📊 My Stats', 'stats').row()
      .text('🔄 Refresh Rankings', 'leaderboard')
      .text('🔙 Main Menu', 'main_menu');

    ctx.reply(
      `🏆 Top Island Adventurers (Weekly):\n\n` +
      `🥇 **IslandHopper** - 2,840m | 🏔️ 47 islands\n` +
      `🥈 **JumpMaster** - 2,240m | 🏔️ 38 islands\n` +
      `🥉 **EndlessRunner** - 1,920m | 🏔️ 32 islands\n` +
      `4️⃣ SkyLeaper - 1,670m | 🏔️ 28 islands\n` +
      `5️⃣ TreasureHunter - 1,450m | 🏔️ 24 islands\n` +
      `6️⃣ CapyRunner - 1,290m | 🏔️ 21 islands\n` +
      `7️⃣ QuickHop - 1,140m | 🏔️ 19 islands\n\n` +
      `🎯 Can you reach the top of the rankings?\n` +
      `Master the jumping mechanics and set a new record!`,
      { reply_markup: keyboard }
    );
  };

  bot.command('leaderboard', handleLeaderboard);

  // Token information with buttons
  const handleBuyToken = (ctx: any) => {
    const keyboard = new InlineKeyboard()
      .url('🚀 PumpFun Launch', 'https://pump.fun')
      .url('📊 Track Price', 'https://dextools.io').row()
      .text('📋 Copy Contract', 'copy_contract')
      .text('🔙 Main Menu', 'main_menu');

    ctx.reply(
      `💎 $CAPYBARA Token - Adventure Rewards:\n\n` +
      `🚀 **Token Launch:** Q1 2025\n` +
      `⚡ **Network:** Solana (Fast & Low Fees)\n` +
      `📋 **Contract:** Coming Soon\n\n` +
      `🏔️ **Adventure Utilities:**\n` +
      `• 🏆 Distance-Based Rewards (0.001 per meter)\n` +
      `• 🎮 Survival Tournament Entry\n` +
      `• 🎨 Exclusive Capybara & Island Skins\n` +
      `• 🗳️ Community Governance Rights\n` +
      `• 💰 Staking for Jump Bonus Multipliers\n` +
      `• 🎆 Premium Island Worlds Access\n\n` +
      `⚠️ Early Adventurer Program launching soon!`,
      { reply_markup: keyboard }
    );
  };

  bot.command('buy', handleBuyToken);

  // Whitepaper
  bot.command('whitepaper', (ctx) => {
    ctx.reply(
      `📖 Save the Capybara Whitepaper\n\n` +
      `Read our comprehensive whitepaper to learn about:\n` +
      `• Game mechanics and tokenomics\n` +
      `• Our vision for play-to-earn gaming\n` +
      `• Technology stack and security\n` +
      `• Community governance plans\n\n` +
      `📄 Read here: https://your-game-url.replit.app/whitepaper`
    );
  });

  // Roadmap
  bot.command('roadmap', (ctx) => {
    ctx.reply(
      `🗺️ Development Roadmap\n\n` +
      `See what we're building and what's coming next:\n` +
      `✅ Phase 1: Foundation & Launch (Completed)\n` +
      `🔄 Phase 2: Token Launch & Rewards (Q1 2025)\n` +
      `🎯 Phase 3: Community & Expansion (Q2 2025)\n` +
      `⭐ Phase 4: Advanced Features (Q3 2025)\n` +
      `🚀 Phase 5: Ecosystem Expansion (Q4 2025+)\n\n` +
      `📋 Full roadmap: https://your-game-url.replit.app/roadmap`
    );
  });

  // Achievements handler
  const handleAchievements = (ctx: any) => {
    const keyboard = new InlineKeyboard()
      .text('🎮 Earn More', 'play')
      .text('📊 My Progress', 'stats').row()
      .text('🔙 Main Menu', 'main_menu');

    ctx.reply(
      `🏛️ Adventure Achievement Gallery:\n\n` +
      `🎆 **Explorer Badges:**\n` +
      `• 🌟 First Jump - Complete your first adventure\n` +
      `• 🏔️ Island Hopper - Reach 10 islands in one run\n` +
      `• ⚡ Speed Runner - Travel 500m in under 60s\n` +
      `• 💰 Treasure Hunter - Collect 50 treasures total\n\n` +
      `💫 **Master Titles:**\n` +
      `• 🌍 Distance Champion - Travel 1000m+ in one run\n` +
      `• 🏆 Endless Survivor - 10 consecutive successful runs\n` +
      `• 🚀 Jump Master - Achieve 95%+ jump accuracy\n` +
      `• 🎆 Island Legend - Reach the global leaderboard\n\n` +
      `💰 Each achievement grants $CAPYBARA tokens!\n` +
      `Connect your wallet to start collecting!`,
      { reply_markup: keyboard }
    );
  };

  // Help command
  bot.command('help', (ctx) => {
    ctx.reply(
      `🤖 Capybara Adventure Bot Commands:\n\n` +
      `🎮 **Game Commands:**\n` +
      `/play - Start your endless island adventure\n` +
      `/stats - View your adventure profile\n` +
      `/leaderboard - Top island adventurers\n\n` +
      `💫 **Features:**\n` +
      `• Real-time distance leaderboards\n` +
      `• Achievement tracking for jumps & treasures\n` +
      `• Mobile-optimized jumping controls\n` +
      `• Solana wallet CAPYBARA rewards\n\n` +
      `💬 **Community:**\n` +
      `Share your epic distance records!\n` +
      `Challenge friends to beat your best run!\n` +
      `Suggest new island features and power-ups!\n\n` +
      `Ready to become an island legend? 🎆`
    );
  });

  // Whitepaper handler
  const handleWhitepaper = (ctx: any) => {
    const keyboard = new InlineKeyboard()
      .url('📖 Read Full Whitepaper', 'https://save-capybara.replit.app/whitepaper')
      .text('🔙 Main Menu', 'main_menu');

    ctx.reply(
      `📖 Save the Capybara Whitepaper\n\n` +
      `📋 What you'll learn:\n` +
      `• Complete game mechanics & tokenomics\n` +
      `• Our vision for play-to-earn gaming\n` +
      `• Technology stack and security measures\n` +
      `• Community governance plans\n` +
      `• Token utility and distribution\n\n` +
      `💡 Essential reading for serious players!`,
      { reply_markup: keyboard }
    );
  };


  // Handle callback queries (button presses)
  bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;
    
    switch (data) {
      case 'play':
        await handlePlayGame(ctx);
        break;
      case 'stats':
        await handleStats(ctx);
        break;
      case 'buy':
        await handleBuyToken(ctx);
        break;
      case 'leaderboard':
        await handleLeaderboard(ctx);
        break;
      case 'whitepaper':
        await handleWhitepaper(ctx);
        break;
      case 'achievements':
        await handleAchievements(ctx);
        break;
      case 'copy_contract':
        await ctx.answerCallbackQuery('Contract copied to clipboard!');
        await ctx.reply('📋 Contract Address: `CapyG4mE7oKr3nQs9vR2bXw8pT5aH6uL9mN3cZ1x`\n\n⚠️ This is a placeholder. Always verify from official sources!', { parse_mode: 'Markdown' });
        break;
      case 'mobile_tips':
        await ctx.answerCallbackQuery();
        await ctx.reply(
          `📱 Mobile Adventure Guide:\n\n` +
          `🔥 **Optimal Setup:**\n` +
          `• Use portrait mode for better jumping control\n` +
          `• Close background apps for smooth gameplay\n` +
          `• Stable internet for leaderboard sync\n` +
          `• Good screen brightness to see islands clearly\n\n` +
          `✨ **Jumping Mastery:**\n` +
          `• Quick tap for short, precise hops\n` +
          `• Hold longer for powerful long jumps\n` +
          `• Release at the right moment for distance\n` +
          `• Watch the arc trajectory carefully\n\n` +
          `🏆 **Pro Tips:**\n` +
          `• Practice timing on early islands\n` +
          `• Collect treasures for bonus points\n` +
          `• Plan your route ahead of time!`
        );
        break;
      case 'tutorial':
        await ctx.answerCallbackQuery();
        await ctx.reply(
          `🎓 Island Adventure Academy:\n\n` +
          `🚀 **Precision Jumping Controls:**\n` +
          `• TAP quickly for short hops to nearby islands\n` +
          `• HOLD & RELEASE for long, powerful jumps\n` +
          `• Watch the jump arc to land safely\n` +
          `• Time your release for maximum distance\n\n` +
          `🏔️ **Endless Adventure Mode:**\n` +
          `• Navigate through procedural island chains\n` +
          `• Collect treasures and power-ups as you go\n` +
          `• Survive as far as possible without falling\n` +
          `• Distance traveled = CAPYBARA token rewards\n\n` +
          `🏆 **Success Tips:**\n` +
          `• Practice makes perfect - start slow\n` +
          `• Each island chain gets more challenging\n` +
          `• Strategic treasure collection boosts score\n` +
          `• Connect Solana wallet for $CAPYBARA rewards!`
        );
        break;
      case 'main_menu':
        await ctx.answerCallbackQuery();
        // Re-send the main menu
        const keyboard = new InlineKeyboard()
          .text('🎮 Play Now', 'play')
          .text('📊 My Stats', 'stats').row()
          .text('💰 $CAPY Token', 'buy')
          .text('🏆 Leaderboard', 'leaderboard').row()
          .text('🎯 How to Play', 'tutorial')
          .text('🏅 Achievements', 'achievements');

        await ctx.editMessageText(
          `🏛️ Capybara Guardian Command Center\n\n` +
          `Choose your next adventure:`,
          { reply_markup: keyboard }
        );
        break;
      default:
        await ctx.answerCallbackQuery('Unknown action');
    }
  });

  // Handle non-command messages
  bot.on('message:text', (ctx) => {
    const text = ctx.message.text.toLowerCase();
    
    if (text.includes('hello') || text.includes('hi')) {
      ctx.reply('Hello Adventurer! 👋 Ready for an endless island adventure? Type /start to begin!');
    } else if (text.includes('capybara')) {
      ctx.reply('🏛️ The capybara needs your help to cross the endless islands! Master precision jumping - type /play!');
    } else if (text.includes('game') || text.includes('jump') || text.includes('island')) {
      ctx.reply('🏔️ Ready to hop between floating islands? Type /play to start your adventure!');
    } else if (text.includes('distance') || text.includes('achievement') || text.includes('record')) {
      ctx.reply('🏆 Track your distance records and achievements! Type /stats to see your adventure profile!');
    } else {
      ctx.reply('Type /help to see all adventure commands! ⚡');
    }
  });

  // Error handling
  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  // Test the bot token first
  bot.api.getMe().then((me) => {
    console.log('✅ Bot token is valid! Bot username:', me.username);
    console.log('Bot name:', me.first_name);
    
    // Start the bot without webhook operations
    bot!.start({
      onStart: () => {
        console.log('🤖 Capybara Guardian Bot is now active!');
        console.log(`Users can now interact with /start command`);
        console.log(`🎮 Game URL configured: ${gameUrl}`);
      }
    });
  }).catch(err => {
    console.error('❌ Bot token validation failed:', err.description || err.message);
    console.log('Please check your bot token with @BotFather on Telegram');
    console.log('Make sure the token is active and not revoked');
  });
}

export { bot };