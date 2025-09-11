var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/telegram-bot.ts
var telegram_bot_exports = {};
__export(telegram_bot_exports, {
  bot: () => bot
});
import { Bot, InlineKeyboard } from "grammy";
var BOT_TOKEN, bot;
var init_telegram_bot = __esm({
  "server/telegram-bot.ts"() {
    "use strict";
    BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    bot = null;
    if (!BOT_TOKEN) {
      console.log("TELEGRAM_BOT_TOKEN not found in environment variables");
      console.log("Telegram bot will be disabled. To enable it:");
      console.log("1. Message @BotFather on Telegram");
      console.log("2. Create a new bot with /newbot");
      console.log("3. Add the token to your Replit environment variables");
    } else {
      console.log("Starting Telegram bot with token:", BOT_TOKEN.substring(0, 10) + "...");
      bot = new Bot(BOT_TOKEN);
      bot.command("start", (ctx) => {
        const keyboard = new InlineKeyboard().text("\u{1F3AE} Start Adventure", "play").text("\u{1F4CA} My Stats", "stats").row().text("\u{1F4B0} $CAPY Token", "buy").text("\u{1F3C6} Leaderboard", "leaderboard").row().text("\u{1F3AF} How to Play", "tutorial").text("\u{1F3C5} Achievements", "achievements");
        ctx.reply(
          `\u{1F3DB}\uFE0F Welcome to Save the Capybara! \u{1F3DB}\uFE0F

\u26A1 The ultimate endless runner adventure on Solana!

\u{1F3D4}\uFE0F Jump between floating islands with precision
\u{1F680} Master tap & hold mechanics for perfect jumps
\u{1F4B0} Collect treasures and survive as far as possible
\u{1F3AF} Earn CAPYBARA rewards based on distance traveled

Ready to become the ultimate Island Adventurer?`,
          { reply_markup: keyboard }
        );
      });
      const gameUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://save-capybara.replit.app";
      const handlePlayGame = (ctx) => {
        const keyboard = new InlineKeyboard().webApp("\u{1F3D4}\uFE0F Start Adventure", gameUrl).text("\u{1F4F1} Mobile Tips", "mobile_tips").row().text("\u{1F3AF} Quick Tutorial", "tutorial").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F3D4}\uFE0F Ready to master the endless islands?

\u2728 Your Mission: Guide the Capybara to Safety!

\u{1F680} **Precision Jumping:**
\u2022 Tap for short hops, hold for long jumps
\u2022 Master timing and power control
\u2022 Navigate between floating islands safely

\u{1F4B0} **Endless Adventure:**
\u2022 Survive as long as possible in procedural worlds
\u2022 Collect treasures and power-ups
\u2022 Distance traveled = CAPYBARA rewards!

\u{1F3AF} How far can you go in the endless islands?`,
          { reply_markup: keyboard }
        );
      };
      bot.command("play", handlePlayGame);
      const handleStats = async (ctx) => {
        const username = ctx.from?.username || "Adventurer";
        const keyboard = new InlineKeyboard().text("\u{1F3AE} Continue Adventure", "play").text("\u{1F3C6} Rankings", "leaderboard").row().text("\u{1F3C5} View Achievements", "achievements").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F4CA} ${username}'s Adventure Profile:

\u{1F3D4}\uFE0F **Island Progress:**
\u2022 Farthest Distance: 0 islands
\u2022 Best Run: 0 meters
\u2022 Total Score: 0 points

\u{1F680} **Jumping Mastery:**
\u2022 Jump Accuracy: --%
\u2022 Survival Time: -- seconds
\u2022 Treasure Collected: 0

\u{1F48E} **Rewards:**
\u2022 $CAPYBARA Earned: 0 tokens
\u2022 Achievement Points: 0

\u{1F517} Connect your Solana wallet to start tracking!`,
          { reply_markup: keyboard }
        );
      };
      bot.command("stats", handleStats);
      const handleLeaderboard = (ctx) => {
        const keyboard = new InlineKeyboard().text("\u{1F3AE} Beat the Record", "play").text("\u{1F4CA} My Stats", "stats").row().text("\u{1F504} Refresh Rankings", "leaderboard").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F3C6} Top Island Adventurers (Weekly):

\u{1F947} **IslandHopper** - 2,840m | \u{1F3D4}\uFE0F 47 islands
\u{1F948} **JumpMaster** - 2,240m | \u{1F3D4}\uFE0F 38 islands
\u{1F949} **EndlessRunner** - 1,920m | \u{1F3D4}\uFE0F 32 islands
4\uFE0F\u20E3 SkyLeaper - 1,670m | \u{1F3D4}\uFE0F 28 islands
5\uFE0F\u20E3 TreasureHunter - 1,450m | \u{1F3D4}\uFE0F 24 islands
6\uFE0F\u20E3 CapyRunner - 1,290m | \u{1F3D4}\uFE0F 21 islands
7\uFE0F\u20E3 QuickHop - 1,140m | \u{1F3D4}\uFE0F 19 islands

\u{1F3AF} Can you reach the top of the rankings?
Master the jumping mechanics and set a new record!`,
          { reply_markup: keyboard }
        );
      };
      bot.command("leaderboard", handleLeaderboard);
      const handleBuyToken = (ctx) => {
        const keyboard = new InlineKeyboard().url("\u{1F680} PumpFun Launch", "https://pump.fun").url("\u{1F4CA} Track Price", "https://dextools.io").row().text("\u{1F4CB} Copy Contract", "copy_contract").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F48E} $CAPYBARA Token - Adventure Rewards:

\u{1F680} **Token Launch:** Q1 2025
\u26A1 **Network:** Solana (Fast & Low Fees)
\u{1F4CB} **Contract:** Coming Soon

\u{1F3D4}\uFE0F **Adventure Utilities:**
\u2022 \u{1F3C6} Distance-Based Rewards (0.001 per meter)
\u2022 \u{1F3AE} Survival Tournament Entry
\u2022 \u{1F3A8} Exclusive Capybara & Island Skins
\u2022 \u{1F5F3}\uFE0F Community Governance Rights
\u2022 \u{1F4B0} Staking for Jump Bonus Multipliers
\u2022 \u{1F386} Premium Island Worlds Access

\u26A0\uFE0F Early Adventurer Program launching soon!`,
          { reply_markup: keyboard }
        );
      };
      bot.command("buy", handleBuyToken);
      bot.command("whitepaper", (ctx) => {
        ctx.reply(
          `\u{1F4D6} Save the Capybara Whitepaper

Read our comprehensive whitepaper to learn about:
\u2022 Game mechanics and tokenomics
\u2022 Our vision for play-to-earn gaming
\u2022 Technology stack and security
\u2022 Community governance plans

\u{1F4C4} Read here: https://your-game-url.replit.app/whitepaper`
        );
      });
      bot.command("roadmap", (ctx) => {
        ctx.reply(
          `\u{1F5FA}\uFE0F Development Roadmap

See what we're building and what's coming next:
\u2705 Phase 1: Foundation & Launch (Completed)
\u{1F504} Phase 2: Token Launch & Rewards (Q1 2025)
\u{1F3AF} Phase 3: Community & Expansion (Q2 2025)
\u2B50 Phase 4: Advanced Features (Q3 2025)
\u{1F680} Phase 5: Ecosystem Expansion (Q4 2025+)

\u{1F4CB} Full roadmap: https://your-game-url.replit.app/roadmap`
        );
      });
      const handleAchievements = (ctx) => {
        const keyboard = new InlineKeyboard().text("\u{1F3AE} Earn More", "play").text("\u{1F4CA} My Progress", "stats").row().text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F3DB}\uFE0F Adventure Achievement Gallery:

\u{1F386} **Explorer Badges:**
\u2022 \u{1F31F} First Jump - Complete your first adventure
\u2022 \u{1F3D4}\uFE0F Island Hopper - Reach 10 islands in one run
\u2022 \u26A1 Speed Runner - Travel 500m in under 60s
\u2022 \u{1F4B0} Treasure Hunter - Collect 50 treasures total

\u{1F4AB} **Master Titles:**
\u2022 \u{1F30D} Distance Champion - Travel 1000m+ in one run
\u2022 \u{1F3C6} Endless Survivor - 10 consecutive successful runs
\u2022 \u{1F680} Jump Master - Achieve 95%+ jump accuracy
\u2022 \u{1F386} Island Legend - Reach the global leaderboard

\u{1F4B0} Each achievement grants $CAPYBARA tokens!
Connect your wallet to start collecting!`,
          { reply_markup: keyboard }
        );
      };
      bot.command("help", (ctx) => {
        ctx.reply(
          `\u{1F916} Capybara Adventure Bot Commands:

\u{1F3AE} **Game Commands:**
/play - Start your endless island adventure
/stats - View your adventure profile
/leaderboard - Top island adventurers

\u{1F4AB} **Features:**
\u2022 Real-time distance leaderboards
\u2022 Achievement tracking for jumps & treasures
\u2022 Mobile-optimized jumping controls
\u2022 Solana wallet CAPYBARA rewards

\u{1F4AC} **Community:**
Share your epic distance records!
Challenge friends to beat your best run!
Suggest new island features and power-ups!

Ready to become an island legend? \u{1F386}`
        );
      });
      const handleWhitepaper = (ctx) => {
        const keyboard = new InlineKeyboard().url("\u{1F4D6} Read Full Whitepaper", "https://save-capybara.replit.app/whitepaper").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F4D6} Save the Capybara Whitepaper

\u{1F4CB} What you'll learn:
\u2022 Complete game mechanics & tokenomics
\u2022 Our vision for play-to-earn gaming
\u2022 Technology stack and security measures
\u2022 Community governance plans
\u2022 Token utility and distribution

\u{1F4A1} Essential reading for serious players!`,
          { reply_markup: keyboard }
        );
      };
      const handleRoadmap = (ctx) => {
        const keyboard = new InlineKeyboard().url("\u{1F5FA}\uFE0F View Full Roadmap", "https://save-capybara.replit.app/roadmap").text("\u{1F519} Main Menu", "main_menu");
        ctx.reply(
          `\u{1F5FA}\uFE0F Development Roadmap

\u{1F680} Our Journey:
\u2705 Phase 1: Foundation & Launch (Completed)
\u{1F504} Phase 2: Token Launch & Rewards (Q1 2025)
\u{1F3AF} Phase 3: Community & Expansion (Q2 2025)
\u2B50 Phase 4: Advanced Features (Q3 2025)
\u{1F31F} Phase 5: Ecosystem Expansion (Q4 2025+)

\u{1F4C5} Track our progress and upcoming features!`,
          { reply_markup: keyboard }
        );
      };
      bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;
        switch (data) {
          case "play":
            await handlePlayGame(ctx);
            break;
          case "stats":
            await handleStats(ctx);
            break;
          case "buy":
            await handleBuyToken(ctx);
            break;
          case "leaderboard":
            await handleLeaderboard(ctx);
            break;
          case "whitepaper":
            await handleWhitepaper(ctx);
            break;
          case "roadmap":
            await handleRoadmap(ctx);
            break;
          case "achievements":
            await handleAchievements(ctx);
            break;
          case "copy_contract":
            await ctx.answerCallbackQuery("Contract copied to clipboard!");
            await ctx.reply("\u{1F4CB} Contract Address: `CapyG4mE7oKr3nQs9vR2bXw8pT5aH6uL9mN3cZ1x`\n\n\u26A0\uFE0F This is a placeholder. Always verify from official sources!", { parse_mode: "Markdown" });
            break;
          case "mobile_tips":
            await ctx.answerCallbackQuery();
            await ctx.reply(
              `\u{1F4F1} Mobile Adventure Guide:

\u{1F525} **Optimal Setup:**
\u2022 Use portrait mode for better jumping control
\u2022 Close background apps for smooth gameplay
\u2022 Stable internet for leaderboard sync
\u2022 Good screen brightness to see islands clearly

\u2728 **Jumping Mastery:**
\u2022 Quick tap for short, precise hops
\u2022 Hold longer for powerful long jumps
\u2022 Release at the right moment for distance
\u2022 Watch the arc trajectory carefully

\u{1F3C6} **Pro Tips:**
\u2022 Practice timing on early islands
\u2022 Collect treasures for bonus points
\u2022 Plan your route ahead of time!`
            );
            break;
          case "tutorial":
            await ctx.answerCallbackQuery();
            await ctx.reply(
              `\u{1F393} Island Adventure Academy:

\u{1F680} **Precision Jumping Controls:**
\u2022 TAP quickly for short hops to nearby islands
\u2022 HOLD & RELEASE for long, powerful jumps
\u2022 Watch the jump arc to land safely
\u2022 Time your release for maximum distance

\u{1F3D4}\uFE0F **Endless Adventure Mode:**
\u2022 Navigate through procedural island chains
\u2022 Collect treasures and power-ups as you go
\u2022 Survive as far as possible without falling
\u2022 Distance traveled = CAPYBARA token rewards

\u{1F3C6} **Success Tips:**
\u2022 Practice makes perfect - start slow
\u2022 Each island chain gets more challenging
\u2022 Strategic treasure collection boosts score
\u2022 Connect Solana wallet for $CAPYBARA rewards!`
            );
            break;
          case "main_menu":
            await ctx.answerCallbackQuery();
            const keyboard = new InlineKeyboard().text("\u{1F3AE} Play Now", "play").text("\u{1F4CA} My Stats", "stats").row().text("\u{1F4B0} $CAPY Token", "buy").text("\u{1F3C6} Leaderboard", "leaderboard").row().text("\u{1F3AF} How to Play", "tutorial").text("\u{1F3C5} Achievements", "achievements");
            await ctx.editMessageText(
              `\u{1F3DB}\uFE0F Capybara Guardian Command Center

Choose your next adventure:`,
              { reply_markup: keyboard }
            );
            break;
          default:
            await ctx.answerCallbackQuery("Unknown action");
        }
      });
      bot.on("message:text", (ctx) => {
        const text2 = ctx.message.text.toLowerCase();
        if (text2.includes("hello") || text2.includes("hi")) {
          ctx.reply("Hello Adventurer! \u{1F44B} Ready for an endless island adventure? Type /start to begin!");
        } else if (text2.includes("capybara")) {
          ctx.reply("\u{1F3DB}\uFE0F The capybara needs your help to cross the endless islands! Master precision jumping - type /play!");
        } else if (text2.includes("game") || text2.includes("jump") || text2.includes("island")) {
          ctx.reply("\u{1F3D4}\uFE0F Ready to hop between floating islands? Type /play to start your adventure!");
        } else if (text2.includes("distance") || text2.includes("achievement") || text2.includes("record")) {
          ctx.reply("\u{1F3C6} Track your distance records and achievements! Type /stats to see your adventure profile!");
        } else {
          ctx.reply("Type /help to see all adventure commands! \u26A1");
        }
      });
      bot.catch((err) => {
        console.error("Bot error:", err);
      });
      bot.api.getMe().then((me) => {
        console.log("\u2705 Bot token is valid! Bot username:", me.username);
        console.log("Bot name:", me.first_name);
        bot.start({
          onStart: () => {
            console.log("\u{1F916} Capybara Guardian Bot is now active!");
            console.log("Users can now interact with /start command");
          }
        });
      }).catch((err) => {
        console.error("\u274C Bot token validation failed:", err.description || err.message);
        console.log("Please check your bot token with @BotFather on Telegram");
        console.log("Make sure the token is active and not revoked");
      });
    }
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq, desc, sql, and } from "drizzle-orm";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, date, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username").notNull(),
  pin: text("pin").notNull(),
  // Store hashed PIN
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  // User statistics for airdrop decisions
  totalScore: integer("total_score").default(0),
  levelsCompleted: integer("levels_completed").default(0),
  highestLevel: integer("highest_level").default(1),
  gamesPlayed: integer("games_played").default(0),
  consecutiveDays: integer("consecutive_days").default(1),
  totalPlayTimeMinutes: integer("total_play_time_minutes").default(0),
  averageScorePerLevel: real("average_score_per_level").default(0),
  achievementPoints: integer("achievement_points").default(0),
  isEligibleForRewards: boolean("is_eligible_for_rewards").default(true)
});
var gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  level: integer("level").notNull(),
  score: integer("score").notNull(),
  completed: boolean("completed").default(false),
  playTimeSeconds: integer("play_time_seconds").default(0),
  timestamp: timestamp("timestamp").defaultNow()
});
var gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalPlayTimeMinutes: integer("total_play_time_minutes").default(0),
  levelsPlayed: integer("levels_played").default(0),
  date: date("date").defaultNow()
});
var userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(),
  // e.g., "COMPLETE_5_LEVELS", "SCORE_10K", "PLAY_7_DAYS"
  achievementName: text("achievement_name").notNull(),
  pointsAwarded: integer("points_awarded").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow()
});
var leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  leaderboardType: text("leaderboard_type").notNull(),
  // "daily", "weekly", "all_time"
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  rank: integer("rank"),
  periodDate: date("period_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  username: true,
  pin: true
});
var insertScoreSchema = createInsertSchema(gameScores).pick({
  userId: true,
  level: true,
  score: true,
  completed: true,
  playTimeSeconds: true
});
var insertSessionSchema = createInsertSchema(gameSessions).pick({
  userId: true,
  totalPlayTimeMinutes: true,
  levelsPlayed: true
});
var insertAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementType: true,
  achievementName: true,
  pointsAwarded: true
});

// server/storage.ts
var db = null;
var useDatabase = false;
console.log("Using in-memory storage for development");
useDatabase = false;
var InMemoryStorage = class {
  users = [];
  scores = [];
  sessions = [];
  achievements = [];
  idCounter = 1;
  async getUser(id) {
    return this.users.find((user) => user.id === id);
  }
  async getUserByWallet(walletAddress) {
    return this.users.find((user) => user.walletAddress === walletAddress);
  }
  async getUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const user = {
      id: this.idCounter++,
      ...insertUser,
      createdAt: /* @__PURE__ */ new Date(),
      lastLoginAt: /* @__PURE__ */ new Date(),
      totalScore: 0,
      levelsCompleted: 0,
      highestLevel: 1,
      gamesPlayed: 0,
      consecutiveDays: 1,
      totalPlayTimeMinutes: 0,
      averageScorePerLevel: 0,
      achievementPoints: 0,
      isEligibleForRewards: true
    };
    this.users.push(user);
    return user;
  }
  async updateUser(id, updates) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return void 0;
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }
  async updateUserStats(userId, stats) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...stats,
        lastLoginAt: /* @__PURE__ */ new Date()
      };
    }
  }
  async submitScore(score) {
    const gameScore = {
      id: this.idCounter++,
      ...score,
      userId: score.userId,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.scores.push(gameScore);
    await this.recalculateUserStats(score.userId);
    return gameScore;
  }
  async recalculateUserStats(userId) {
    const userScores = this.scores.filter((s) => s.userId === userId);
    const completedLevels = userScores.filter((s) => s.completed).length;
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
    const highestLevel = Math.max(...userScores.map((s) => s.level), 1);
    const averageScore = userScores.length > 0 ? totalScore / userScores.length : 0;
    await this.updateUserStats(userId, {
      totalScore,
      levelsCompleted: completedLevels,
      highestLevel,
      gamesPlayed: userScores.length,
      averageScorePerLevel: averageScore
    });
  }
  async getUserScores(userId) {
    return this.scores.filter((score) => score.userId === userId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  async getTopScores(limit = 100) {
    return this.scores.sort((a, b) => b.score - a.score).slice(0, limit).map((score, index) => {
      const user = this.users.find((u) => u.id === score.userId);
      return {
        rank: index + 1,
        username: user?.username || "Unknown",
        walletAddress: user?.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : "N/A",
        score: score.score,
        level: score.level,
        completed: score.completed
      };
    });
  }
  async createSession(session) {
    const gameSession = {
      id: this.idCounter++,
      ...session,
      userId: session.userId,
      startTime: /* @__PURE__ */ new Date(),
      endTime: null
    };
    this.sessions.push(gameSession);
    return gameSession;
  }
  async endSession(sessionId, endTime) {
    const sessionIndex = this.sessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex !== -1) {
      this.sessions[sessionIndex].endTime = endTime;
    }
  }
  async getUserSessions(userId) {
    return this.sessions.filter((session) => session.userId === userId).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }
  async addAchievement(achievement) {
    const userAchievement = {
      id: this.idCounter++,
      ...achievement,
      userId: achievement.userId,
      unlockedAt: /* @__PURE__ */ new Date()
    };
    this.achievements.push(userAchievement);
    await this.updateUserStats(achievement.userId, {
      achievementPoints: (this.users.find((u) => u.id === achievement.userId)?.achievementPoints || 0) + achievement.pointsAwarded
    });
    return userAchievement;
  }
  async getUserAchievements(userId) {
    return this.achievements.filter((achievement) => achievement.userId === userId).sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }
  async updateLeaderboards() {
  }
  async getLeaderboard(type, limit = 50) {
    return await this.getTopScores(limit);
  }
  async getAirdropData() {
    return this.users.filter((user) => user.isEligibleForRewards).sort((a, b) => b.totalScore - a.totalScore).map((user) => ({
      username: user.username,
      walletAddress: user.walletAddress,
      totalScore: user.totalScore,
      levelsCompleted: user.levelsCompleted,
      highestLevel: user.highestLevel,
      gamesPlayed: user.gamesPlayed,
      consecutiveDays: user.consecutiveDays,
      totalPlayTimeMinutes: user.totalPlayTimeMinutes,
      achievementPoints: user.achievementPoints,
      averageScorePerLevel: user.averageScorePerLevel,
      isEligibleForRewards: user.isEligibleForRewards,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }));
  }
};
var DatabaseStorage = class {
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByWallet(walletAddress) {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values({
      ...insertUser,
      lastLoginAt: /* @__PURE__ */ new Date(),
      totalScore: 0,
      levelsCompleted: 0,
      highestLevel: 1,
      gamesPlayed: 0,
      consecutiveDays: 1,
      totalPlayTimeMinutes: 0,
      averageScorePerLevel: 0,
      achievementPoints: 0,
      isEligibleForRewards: true
    }).returning();
    return result[0];
  }
  async updateUser(id, updates) {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }
  async updateUserStats(userId, stats) {
    await db.update(users).set({
      ...stats,
      lastLoginAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId));
  }
  async submitScore(score) {
    const result = await db.insert(gameScores).values({
      ...score,
      timestamp: /* @__PURE__ */ new Date()
    }).returning();
    await this.recalculateUserStats(score.userId);
    return result[0];
  }
  async recalculateUserStats(userId) {
    const userScores = await db.select().from(gameScores).where(eq(gameScores.userId, userId));
    const completedLevels = userScores.filter((s) => s.completed).length;
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
    const highestLevel = Math.max(...userScores.map((s) => s.level), 1);
    const averageScore = userScores.length > 0 ? totalScore / userScores.length : 0;
    await db.update(users).set({
      totalScore,
      levelsCompleted: completedLevels,
      highestLevel,
      gamesPlayed: userScores.length,
      averageScorePerLevel: averageScore
    }).where(eq(users.id, userId));
  }
  async getUserScores(userId) {
    return await db.select().from(gameScores).where(eq(gameScores.userId, userId)).orderBy(desc(gameScores.timestamp));
  }
  async getTopScores(limit = 100) {
    const topScores = await db.select({
      score: gameScores.score,
      level: gameScores.level,
      completed: gameScores.completed,
      timestamp: gameScores.timestamp,
      username: users.username,
      walletAddress: users.walletAddress
    }).from(gameScores).innerJoin(users, eq(gameScores.userId, users.id)).orderBy(desc(gameScores.score)).limit(limit);
    return topScores.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      walletAddress: `${score.walletAddress.slice(0, 4)}...${score.walletAddress.slice(-4)}`,
      score: score.score,
      level: score.level,
      completed: score.completed
    }));
  }
  async createSession(session) {
    const result = await db.insert(gameSessions).values({
      ...session,
      startTime: /* @__PURE__ */ new Date()
    }).returning();
    return result[0];
  }
  async endSession(sessionId, endTime) {
    await db.update(gameSessions).set({ endTime }).where(eq(gameSessions.id, sessionId));
  }
  async getUserSessions(userId) {
    return await db.select().from(gameSessions).where(eq(gameSessions.userId, userId)).orderBy(desc(gameSessions.startTime));
  }
  async addAchievement(achievement) {
    const result = await db.insert(userAchievements).values({
      ...achievement,
      unlockedAt: /* @__PURE__ */ new Date()
    }).returning();
    await db.update(users).set({
      achievementPoints: sql`${users.achievementPoints} + ${achievement.pointsAwarded}`
    }).where(eq(users.id, achievement.userId));
    return result[0];
  }
  async getUserAchievements(userId) {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId)).orderBy(desc(userAchievements.unlockedAt));
  }
  async updateLeaderboards() {
    const today = /* @__PURE__ */ new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const dailyScores = await db.select({
      userId: gameScores.userId,
      score: sql`MAX(${gameScores.score})`.as("max_score"),
      level: sql`MAX(${gameScores.level})`.as("max_level")
    }).from(gameScores).where(sql`DATE(${gameScores.timestamp}) = CURRENT_DATE`).groupBy(gameScores.userId).orderBy(desc(sql`MAX(${gameScores.score})`));
    await db.delete(leaderboards).where(and(
      eq(leaderboards.leaderboardType, "daily"),
      sql`DATE(${leaderboards.periodDate}) = CURRENT_DATE`
    ));
    for (let i = 0; i < dailyScores.length; i++) {
      await db.insert(leaderboards).values({
        userId: dailyScores[i].userId,
        leaderboardType: "daily",
        score: dailyScores[i].score,
        level: dailyScores[i].level,
        rank: i + 1,
        periodDate: today.toISOString().split("T")[0]
      });
    }
  }
  async getLeaderboard(type, limit = 50) {
    if (type === "all_time") {
      return await this.getTopScores(limit);
    }
    const result = await db.select({
      rank: leaderboards.rank,
      score: leaderboards.score,
      level: leaderboards.level,
      username: users.username,
      walletAddress: users.walletAddress
    }).from(leaderboards).innerJoin(users, eq(leaderboards.userId, users.id)).where(eq(leaderboards.leaderboardType, type)).orderBy(leaderboards.rank).limit(limit);
    return result.map((entry) => ({
      rank: entry.rank,
      username: entry.username,
      walletAddress: `${entry.walletAddress.slice(0, 4)}...${entry.walletAddress.slice(-4)}`,
      score: entry.score,
      level: entry.level
    }));
  }
  async getAirdropData() {
    const result = await db.select({
      username: users.username,
      walletAddress: users.walletAddress,
      totalScore: users.totalScore,
      levelsCompleted: users.levelsCompleted,
      highestLevel: users.highestLevel,
      gamesPlayed: users.gamesPlayed,
      consecutiveDays: users.consecutiveDays,
      totalPlayTimeMinutes: users.totalPlayTimeMinutes,
      achievementPoints: users.achievementPoints,
      averageScorePerLevel: users.averageScorePerLevel,
      isEligibleForRewards: users.isEligibleForRewards,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt
    }).from(users).where(eq(users.isEligibleForRewards, true)).orderBy(desc(users.totalScore));
    return result;
  }
};
var storage = useDatabase ? new DatabaseStorage() : new InMemoryStorage();

// server/routes.ts
import crypto from "crypto";
function hashPin(pin) {
  return crypto.createHash("sha256").update(pin).digest("hex");
}
function isValidSolanaAddress(address) {
  if (!address || typeof address !== "string") {
    return false;
  }
  const trimmedAddress = address.trim();
  if (trimmedAddress.length < 1 || trimmedAddress.length > 100) {
    return false;
  }
  return true;
}
async function checkAndAwardAchievements(userId) {
  try {
    const user = await storage.getUser(userId);
    if (!user) return;
    const existingAchievements = await storage.getUserAchievements(userId);
    const achievedTypes = existingAchievements.map((a) => a.achievementType);
    const achievements = [
      {
        type: "FIRST_GAME",
        name: "Getting Started",
        points: 10,
        criteria: () => (user.gamesPlayed || 0) >= 1
      },
      {
        type: "COMPLETE_5_LEVELS",
        name: "Level Master",
        points: 50,
        criteria: () => (user.levelsCompleted || 0) >= 5
      },
      {
        type: "SCORE_10K",
        name: "High Scorer",
        points: 100,
        criteria: () => (user.totalScore || 0) >= 1e4
      },
      {
        type: "PLAY_10_GAMES",
        name: "Regular Player",
        points: 75,
        criteria: () => (user.gamesPlayed || 0) >= 10
      },
      {
        type: "REACH_LEVEL_5",
        name: "Progress Master",
        points: 50,
        criteria: () => (user.highestLevel || 1) >= 5
      }
    ];
    for (const achievement of achievements) {
      if (!achievedTypes.includes(achievement.type) && achievement.criteria()) {
        await storage.addAchievement({
          userId,
          achievementType: achievement.type,
          achievementName: achievement.name,
          pointsAwarded: achievement.points
        });
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}
async function registerRoutes(app2) {
  app2.post("/api/register", async (req, res) => {
    try {
      const { walletAddress, username, password, seedPhrase } = req.body;
      const userPassword = password || seedPhrase;
      if (!walletAddress || !username || !userPassword) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (userPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      if (!isValidSolanaAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid Solana wallet address. Please provide a valid SOL wallet." });
      }
      const existingUserByWallet = await storage.getUserByWallet(walletAddress);
      if (existingUserByWallet) {
        return res.status(409).json({ error: "Wallet address already registered. Only one account per wallet address is allowed." });
      }
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ error: "Username already taken" });
      }
      const hashedPassword = hashPin(userPassword.trim());
      const user = await storage.createUser({
        walletAddress,
        username,
        pin: hashedPassword
      });
      await checkAndAwardAchievements(user.id);
      const safeUser = {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        totalScore: user.totalScore,
        levelsCompleted: user.levelsCompleted,
        achievementPoints: user.achievementPoints
      };
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/login", async (req, res) => {
    try {
      const { walletAddress, password } = req.body;
      if (!walletAddress || !password) {
        return res.status(400).json({ error: "Missing wallet address or password" });
      }
      if (!isValidSolanaAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid Solana wallet address" });
      }
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const hashedPassword = hashPin(password.trim());
      if (user.pin !== hashedPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      await storage.updateUserStats(user.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      const safeUser = {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        totalScore: user.totalScore,
        levelsCompleted: user.levelsCompleted,
        highestLevel: user.highestLevel,
        gamesPlayed: user.gamesPlayed,
        achievementPoints: user.achievementPoints,
        consecutiveDays: user.consecutiveDays,
        averageScorePerLevel: user.averageScorePerLevel,
        isEligibleForRewards: user.isEligibleForRewards
      };
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/submit-score", async (req, res) => {
    try {
      const { walletAddress, level, score, completed, playTimeSeconds } = req.body;
      if (!walletAddress || typeof level !== "number" || typeof score !== "number") {
        return res.status(400).json({ error: "Invalid input data" });
      }
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      const gameScore = await storage.submitScore({
        userId: user.id,
        level,
        score,
        completed: !!completed,
        playTimeSeconds: playTimeSeconds || 0
      });
      await checkAndAwardAchievements(user.id);
      await storage.updateLeaderboards();
      console.log("Score submitted for user:", user.username, "Score:", score, "Level:", level);
      res.json({ success: true, message: "Score submitted successfully" });
    } catch (error) {
      console.error("Score submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/leaderboard", async (req, res) => {
    try {
      const mockLeaderboard = {
        daily: [
          { username: "CapyMaster", score: 2500, walletAddress: "ABC...123", position: 1 },
          { username: "CoinHunter", score: 2100, walletAddress: "DEF...456", position: 2 },
          { username: "RunnerPro", score: 1800, walletAddress: "GHI...789", position: 3 }
        ],
        weekly: [
          { username: "CapyMaster", score: 15e3, walletAddress: "ABC...123", position: 1 },
          { username: "GamePro", score: 12500, walletAddress: "JKL...012", position: 2 },
          { username: "CoinHunter", score: 11200, walletAddress: "DEF...456", position: 3 }
        ],
        all_time: [
          { username: "CapyLegend", score: 5e4, walletAddress: "MNO...345", position: 1 },
          { username: "CapyMaster", score: 35e3, walletAddress: "ABC...123", position: 2 },
          { username: "EliteRunner", score: 28e3, walletAddress: "PQR...678", position: 3 }
        ]
      };
      res.json(mockLeaderboard);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.json({ daily: [], weekly: [], all_time: [] });
    }
  });
  app2.get("/api/profile/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const achievements = await storage.getUserAchievements(user.id);
      const recentScores = await storage.getUserScores(user.id);
      const profile = {
        username: user.username,
        walletAddress: user.walletAddress,
        totalScore: user.totalScore,
        levelsCompleted: user.levelsCompleted,
        highestLevel: user.highestLevel,
        gamesPlayed: user.gamesPlayed,
        achievementPoints: user.achievementPoints,
        averageScorePerLevel: user.averageScorePerLevel,
        totalPlayTimeMinutes: user.totalPlayTimeMinutes,
        consecutiveDays: user.consecutiveDays,
        isEligibleForRewards: user.isEligibleForRewards,
        joinedAt: user.createdAt,
        lastActiveAt: user.lastLoginAt,
        achievements: achievements.slice(0, 5),
        // Recent 5 achievements
        recentScores: recentScores.slice(0, 10)
        // Recent 10 scores
      };
      res.json(profile);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/admin/airdrop-data", async (req, res) => {
    try {
      const airdropData = await storage.getAirdropData();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", 'attachment; filename="airdrop-eligible-users.json"');
      res.json({
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        totalEligibleUsers: airdropData.length,
        users: airdropData
      });
    } catch (error) {
      console.error("Airdrop data export error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/achievements/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const achievements = await storage.getUserAchievements(user.id);
      res.json(achievements);
    } catch (error) {
      console.error("Achievements error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/session/start", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const session = await storage.createSession({
        userId: user.id,
        totalPlayTimeMinutes: 0,
        levelsPlayed: 0
      });
      res.json({ success: true, sessionId: session.id });
    } catch (error) {
      console.error("Session start error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    glsl()
    // Add GLSL shader support
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"]
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const url = req.url;
  if (url.endsWith(".data.br") || url.endsWith(".data.unityweb")) {
    res.set("Content-Type", "application/octet-stream");
    if (url.endsWith(".br")) {
      res.set("Content-Encoding", "br");
    }
  } else if (url.endsWith(".js.br") || url.endsWith(".js.unityweb")) {
    res.set("Content-Type", "application/javascript");
    if (url.endsWith(".br")) {
      res.set("Content-Encoding", "br");
    }
  } else if (url.endsWith(".wasm.br") || url.endsWith(".wasm.unityweb")) {
    res.set("Content-Type", "application/wasm");
    if (url.endsWith(".br")) {
      res.set("Content-Encoding", "br");
    }
  }
  if (url.includes(".unityweb")) {
    if (url.includes(".data.")) {
      res.set("Content-Type", "application/octet-stream");
    } else if (url.includes(".framework.js.") || url.includes(".js.")) {
      res.set("Content-Type", "application/javascript");
    } else if (url.includes(".wasm.")) {
      res.set("Content-Type", "application/wasm");
    }
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await Promise.resolve().then(() => (init_telegram_bot(), telegram_bot_exports));
  } catch (error) {
    console.log("Telegram bot not started - this is normal if no token is provided");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
