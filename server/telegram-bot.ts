// Telegram Bot for Save the Capybara Community
// This file contains the basic structure for a Telegram bot

import { Bot } from 'grammy';

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

// Welcome message
bot.command('start', (ctx) => {
  ctx.reply(
    `🏛️ Welcome to Save the Capybara! 🏛️\n\n` +
    `The most chill play-to-earn tower defense game on Solana!\n\n` +
    `🎮 Commands:\n` +
    `/play - Get the game link\n` +
    `/stats - View your game statistics\n` +
    `/leaderboard - See top players\n` +
    `/whitepaper - Read our whitepaper\n` +
    `/roadmap - View development roadmap\n` +
    `/buy - Get $CAPY token info\n` +
    `/help - Show all commands\n\n` +
    `Connect your Solana wallet and start earning rewards!`
  );
});

// Game link
bot.command('play', (ctx) => {
  ctx.reply(
    `🎮 Ready to save some capybaras?\n\n` +
    `Play now: https://your-game-url.replit.app\n\n` +
    `💡 Tips:\n` +
    `• Draw barriers during the 4.5-second drawing phase\n` +
    `• Protect the capybara for 5 seconds to win\n` +
    `• Complete achievements to earn more rewards\n` +
    `• Connect your Solana wallet to track progress`
  );
});

// Player statistics (placeholder)
bot.command('stats', async (ctx) => {
  const username = ctx.from?.username || 'Player';
  
  // In production, fetch real stats from your database
  ctx.reply(
    `📊 ${username}'s Stats:\n\n` +
    `🏆 Total Score: Coming soon!\n` +
    `🎯 Levels Completed: Connect wallet to view\n` +
    `⭐ Achievement Points: Register to see stats\n` +
    `🔥 Current Streak: Play to start tracking\n\n` +
    `Connect your wallet in-game to see real stats!`
  );
});

// Leaderboard
bot.command('leaderboard', (ctx) => {
  ctx.reply(
    `🏆 Top Capybara Protectors:\n\n` +
    `🥇 Player1 - 15,420 points\n` +
    `🥈 Player2 - 12,890 points\n` +
    `🥉 Player3 - 11,250 points\n` +
    `4️⃣ Player4 - 9,870 points\n` +
    `5️⃣ Player5 - 8,650 points\n\n` +
    `🎮 Think you can make it to the top?\n` +
    `Play now and show your skills!`
  );
});

// Token information
bot.command('buy', (ctx) => {
  ctx.reply(
    `💰 $CAPY Token Information:\n\n` +
    `🚀 Launch: Coming Q1 2025\n` +
    `💎 Platform: PumpFun (Solana)\n` +
    `🎯 Use Cases:\n` +
    `• Play-to-earn rewards\n` +
    `• Tournament prizes\n` +
    `• NFT purchases\n` +
    `• Governance voting\n\n` +
    `📍 Contract Address: TBA\n` +
    `Stay tuned for the official launch announcement!`
  );
});

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
if (process.env.NODE_ENV === 'production') {
  console.log('Starting Telegram bot...');
  bot.start();
} else {
  console.log('Telegram bot code ready. Set TELEGRAM_BOT_TOKEN to start.');
}

export { bot };