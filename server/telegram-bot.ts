// Telegram Bot for Save the Capybara Community
// This file contains the basic structure for a Telegram bot

import { Bot, InlineKeyboard } from 'grammy';

// You'll need to get a bot token from @BotFather on Telegram
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log('TELEGRAM_BOT_TOKEN not found in environment variables');
  console.log('To set up the bot:');
  console.log('1. Message @BotFather on Telegram');
  console.log('2. Create a new bot with /newbot');
  console.log('3. Copy the token to your environment variables');
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

// Welcome message with interactive buttons
bot.command('start', (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('🎮 Play Game', 'play')
    .text('📊 My Stats', 'stats').row()
    .text('💰 Buy $CAPY', 'buy')
    .text('🏆 Leaderboard', 'leaderboard').row()
    .text('📖 Whitepaper', 'whitepaper')
    .text('🗺️ Roadmap', 'roadmap');

  ctx.reply(
    `🏛️ Welcome to Save the Capybara! 🏛️\n\n` +
    `The most chill play-to-earn tower defense game on Solana!\n\n` +
    `🎯 Protect cute capybaras by drawing magical barriers\n` +
    `💎 Earn $CAPY tokens for your skills\n` +
    `🌟 Complete 12 handcrafted levels\n\n` +
    `Choose an option below to get started:`,
    { reply_markup: keyboard }
  );
});

// Game link with buttons
const handlePlayGame = (ctx: any) => {
  const keyboard = new InlineKeyboard()
    .url('🎮 Play Now', 'https://save-capybara.replit.app')
    .text('📱 Mobile Tips', 'mobile_tips').row()
    .text('🎯 Tutorial', 'tutorial')
    .text('🔙 Main Menu', 'main_menu');

  ctx.reply(
    `🎮 Ready to save some capybaras?\n\n` +
    `🏛️ Master the ancient art of protective drawing!\n\n` +
    `💡 How to Play:\n` +
    `• ⚡ Draw Phase (2.5s): Draw magical barriers\n` +
    `• 🛡️ Survive Phase (5s): Protect the capybara\n` +
    `• 🎯 Complete all 12 levels to become a master\n` +
    `• 💰 Connect Solana wallet to earn rewards\n\n` +
    `Click 'Play Now' to start your adventure!`,
    { reply_markup: keyboard }
  );
};

bot.command('play', handlePlayGame);

// Player statistics with buttons
const handleStats = async (ctx: any) => {
  const username = ctx.from?.username || 'Player';
  
  const keyboard = new InlineKeyboard()
    .text('🎮 Play Game', 'play')
    .text('🏆 Leaderboard', 'leaderboard').row()
    .text('🔄 Refresh Stats', 'stats')
    .text('🔙 Main Menu', 'main_menu');
  
  // In production, fetch real stats from your database
  ctx.reply(
    `📊 ${username}'s Capybara Protection Stats:\n\n` +
    `🏆 Total Score: 0 (Connect wallet)\n` +
    `🎯 Levels Completed: 0/12\n` +
    `⭐ Achievement Points: 0\n` +
    `🔥 Current Streak: 0 days\n` +
    `💰 $CAPY Earned: 0 tokens\n` +
    `🏅 Best Time: -- seconds\n\n` +
    `🔗 Connect your Solana wallet in-game to track real stats!`,
    { reply_markup: keyboard }
  );
};

bot.command('stats', handleStats);

// Leaderboard with buttons
const handleLeaderboard = (ctx: any) => {
  const keyboard = new InlineKeyboard()
    .text('🎮 Challenge Top Player', 'play')
    .text('📊 My Stats', 'stats').row()
    .text('🔄 Refresh Rankings', 'leaderboard')
    .text('🔙 Main Menu', 'main_menu');

  ctx.reply(
    `🏆 Top Capybara Protectors (Weekly):\n\n` +
    `🥇 CapyMaster - 15,420 points\n` +
    `🥈 BeeStopper - 12,890 points\n` +
    `🥉 MagicInk - 11,250 points\n` +
    `4️⃣ BarrierKing - 9,870 points\n` +
    `5️⃣ QuickDraw - 8,650 points\n` +
    `6️⃣ SafeCapy - 7,420 points\n` +
    `7️⃣ SpeedRun - 6,890 points\n\n` +
    `🎯 Think you can claim the throne?\n` +
    `Play now and prove your skills!`,
    { reply_markup: keyboard }
  );
};

bot.command('leaderboard', handleLeaderboard);

// Token information with buttons
const handleBuyToken = (ctx: any) => {
  const keyboard = new InlineKeyboard()
    .url('🚀 PumpFun Launch', 'https://pump.fun')
    .url('📊 DEXTools', 'https://dextools.io').row()
    .text('📋 Copy Contract', 'copy_contract')
    .text('🔙 Main Menu', 'main_menu');

  ctx.reply(
    `💰 $CAPY Token Information:\n\n` +
    `🚀 Launch: Q1 2025 on PumpFun\n` +
    `💎 Network: Solana\n` +
    `📍 Contract: CapyG4mE7oKr3nQs9vR2bXw8pT5aH6uL9mN3cZ1x (placeholder)\n\n` +
    `🎯 Utilities:\n` +
    `• Play-to-earn rewards\n` +
    `• Tournament entry & prizes\n` +
    `• Exclusive NFT capybara skins\n` +
    `• Community governance voting\n` +
    `• Staking for bonus rewards\n\n` +
    `⚠️ Always verify official contract address!`,
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

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    `🤖 Save the Capybara Bot Commands:\n\n` +
    `🎮 Game Commands:\n` +
    `/play - Get the game link\n` +
    `/stats - View your statistics\n` +
    `/leaderboard - Top players\n\n` +
    `📚 Information:\n` +
    `/whitepaper - Read our whitepaper\n` +
    `/roadmap - Development roadmap\n` +
    `/buy - Token information\n\n` +
    `💬 Community:\n` +
    `Share screenshots of your best scores!\n` +
    `Ask questions about gameplay\n` +
    `Suggest new features\n\n` +
    `Happy gaming! 🏛️`
  );
});

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
    case 'roadmap':
      await handleRoadmap(ctx);
      break;
    case 'copy_contract':
      await ctx.answerCallbackQuery('Contract copied to clipboard!');
      await ctx.reply('📋 Contract Address: `CapyG4mE7oKr3nQs9vR2bXw8pT5aH6uL9mN3cZ1x`\\n\\n⚠️ This is a placeholder. Always verify from official sources!', { parse_mode: 'Markdown' });
      break;
    case 'mobile_tips':
      await ctx.answerCallbackQuery();
      await ctx.reply(
        `📱 Mobile Gaming Tips:\\n\\n` +
        `🔥 Performance:\\n` +
        `• Use landscape mode for better view\\n` +
        `• Close other apps for smooth gameplay\\n` +
        `• Ensure stable internet connection\\n\\n` +
        `✨ Drawing Tips:\\n` +
        `• Use your finger like a magic wand\\n` +
        `• Draw smooth, connected barriers\\n` +
        `• Plan your barriers before drawing\\n` +
        `• Save ink for emergency patches!`
      );
      break;
    case 'tutorial':
      await ctx.answerCallbackQuery();
      await ctx.reply(
        `🎓 Capybara Protection Tutorial:\\n\\n` +
        `⚡ Phase 1 - Drawing (2.5s):\\n` +
        `• Click and drag to draw magical barriers\\n` +
        `• Barriers block bee movement\\n` +
        `• Use ink wisely - you have limited supply\\n\\n` +
        `🛡️ Phase 2 - Survival (5s):\\n` +
        `• Bees spawn and move toward capybara\\n` +
        `• Your barriers must hold them off\\n` +
        `• If capybara is touched, you lose\\n\\n` +
        `🏆 Victory Conditions:\\n` +
        `• Keep capybara safe for full 5 seconds\\n` +
        `• Bonus points for leftover ink\\n` +
        `• Progress through all 12 levels!`
      );
      break;
    case 'main_menu':
      await ctx.answerCallbackQuery();
      // Re-send the main menu
      const keyboard = new InlineKeyboard()
        .text('🎮 Play Game', 'play')
        .text('📊 My Stats', 'stats').row()
        .text('💰 Buy $CAPY', 'buy')
        .text('🏆 Leaderboard', 'leaderboard').row()
        .text('📖 Whitepaper', 'whitepaper')
        .text('🗺️ Roadmap', 'roadmap');

      await ctx.editMessageText(
        `🏛️ Save the Capybara Main Menu\\n\\n` +
        `Choose an option:`,
        { reply_markup: keyboard }
      );
      break;
    default:
      await ctx.answerCallbackQuery('Unknown action');
  }
});

// Whitepaper handler
const handleWhitepaper = (ctx: any) => {
  const keyboard = new InlineKeyboard()
    .url('📖 Read Full Whitepaper', 'https://save-capybara.replit.app/whitepaper')
    .text('🔙 Main Menu', 'main_menu');

  ctx.reply(
    `📖 Save the Capybara Whitepaper\\n\\n` +
    `📋 What you'll learn:\\n` +
    `• Complete game mechanics & tokenomics\\n` +
    `• Our vision for play-to-earn gaming\\n` +
    `• Technology stack and security measures\\n` +
    `• Community governance plans\\n` +
    `• Token utility and distribution\\n\\n` +
    `💡 Essential reading for serious players!`,
    { reply_markup: keyboard }
  );
};

// Roadmap handler
const handleRoadmap = (ctx: any) => {
  const keyboard = new InlineKeyboard()
    .url('🗺️ View Full Roadmap', 'https://save-capybara.replit.app/roadmap')
    .text('🔙 Main Menu', 'main_menu');

  ctx.reply(
    `🗺️ Development Roadmap\\n\\n` +
    `🚀 Our Journey:\\n` +
    `✅ Phase 1: Foundation & Launch (Completed)\\n` +
    `🔄 Phase 2: Token Launch & Rewards (Q1 2025)\\n` +
    `🎯 Phase 3: Community & Expansion (Q2 2025)\\n` +
    `⭐ Phase 4: Advanced Features (Q3 2025)\\n` +
    `🌟 Phase 5: Ecosystem Expansion (Q4 2025+)\\n\\n` +
    `📅 Track our progress and upcoming features!`,
    { reply_markup: keyboard }
  );
};

// Handle non-command messages
bot.on('message:text', (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  if (text.includes('hello') || text.includes('hi')) {
    ctx.reply('Hello! 👋 Type /start to see what I can do!');
  } else if (text.includes('capybara')) {
    ctx.reply('🏛️ Did someone say capybara? They need saving! Type /play to start protecting them!');
  } else if (text.includes('game')) {
    ctx.reply('🎮 Ready to play? Type /play to get the game link!');
  } else {
    ctx.reply('Type /help to see all available commands! 🤖');
  }
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
console.log('Starting Telegram bot...');
bot.start().catch(err => {
  console.error('Failed to start Telegram bot:', err);
});

export { bot };