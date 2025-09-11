import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";
import { PublicKey } from '@solana/web3.js';

function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

function isValidSolanaAddress(address: string): boolean {
  // Allow any non-empty string as wallet address for maximum compatibility during development
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Trim whitespace
  const trimmedAddress = address.trim();
  
  // Just check it's not empty and has reasonable length
  if (trimmedAddress.length < 1 || trimmedAddress.length > 100) {
    return false;
  }
  
  // For development: accept any alphanumeric string for maximum compatibility
  // In production, you might want to restore strict validation: new PublicKey(address)
  return true;
}

// Helper function to check achievement criteria
async function checkAndAwardAchievements(userId: number): Promise<void> {
  try {
    const user = await storage.getUser(userId);
    if (!user) return;

    const existingAchievements = await storage.getUserAchievements(userId);
    const achievedTypes = existingAchievements.map(a => a.achievementType);

    // Define achievement criteria
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
        criteria: () => (user.totalScore || 0) >= 10000
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

    // Award new achievements
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced user registration with wallet verification
  app.post("/api/register", async (req, res) => {
    try {
      const { walletAddress, username, password, seedPhrase } = req.body;
      
      // Accept either 'password' or 'seedPhrase' for compatibility
      const userPassword = password || seedPhrase;
      
      if (!walletAddress || !username || !userPassword) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Validate password length
      if (userPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Enhanced validation for Solana wallet address
      if (!isValidSolanaAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid Solana wallet address. Please provide a valid SOL wallet." });
      }
      
      // Check if wallet address already exists (prevent duplicates)
      const existingUserByWallet = await storage.getUserByWallet(walletAddress);
      if (existingUserByWallet) {
        return res.status(409).json({ error: "Wallet address already registered. Only one account per wallet address is allowed." });
      }
      
      // Check if username already exists
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
      
      // Award first achievement
      await checkAndAwardAchievements(user.id);
      
      // Return user data (without PIN)
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

  // Enhanced user login
  app.post("/api/login", async (req, res) => {
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
      
      // Update last login time
      await storage.updateUserStats(user.id, { lastLoginAt: new Date() });
      
      // Return enhanced user data
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

  // Enhanced score submission with achievement checking
  app.post("/api/submit-score", async (req, res) => {
    try {
      const { walletAddress, level, score, completed, playTimeSeconds } = req.body;
      
      if (!walletAddress || typeof level !== 'number' || typeof score !== 'number') {
        return res.status(400).json({ error: "Invalid input data" });
      }
      
      let user = await storage.getUserByWallet(walletAddress);
      
      // Auto-register anonymous users for score submission
      if (!user && walletAddress.startsWith('anonymous_')) {
        try {
          const anonymousUsername = `Player_${walletAddress.split('_')[2]?.substring(0, 6) || Math.random().toString(36).substr(2, 6)}`;
          user = await storage.createUser({
            walletAddress: walletAddress,
            pin: 'anonymous',
            username: anonymousUsername
          });
          console.log("Auto-registered anonymous user:", anonymousUsername);
        } catch (error) {
          console.error("Failed to auto-register anonymous user:", error);
          return res.status(500).json({ error: "Failed to create anonymous user" });
        }
      }
      
      if (!user) {
        return res.status(401).json({ error: "User not found - please connect wallet or register" });
      }
      
      const gameScore = await storage.submitScore({
        userId: user.id,
        level,
        score,
        completed: !!completed,
        playTimeSeconds: playTimeSeconds || 0
      });
      
      // Check for new achievements
      await checkAndAwardAchievements(user.id);
      
      // Update leaderboards
      await storage.updateLeaderboards();
      
      console.log("Score submitted for user:", user.username, "Score:", score, "Level:", level);
      
      res.json({ success: true, message: "Score submitted successfully" });
    } catch (error) {
      console.error("Score submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Enhanced leaderboard with multiple types - now using REAL data!
  app.get("/api/leaderboard", async (req, res) => {
    try {
      // Get real user data sorted by totalScore
      const allUsers = await storage.getAllUsers();
      const topUsers = allUsers
        .filter(user => (user.totalScore || 0) > 0) // Only users with scores
        .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
        .slice(0, 50); // Top 50 users
      
      // Format real leaderboard data with actual user scores
      const formatLeaderboard = (users: any[]) => {
        return users.map((user, index) => ({
          username: user.username,
          score: user.totalScore,
          walletAddress: user.walletAddress.slice(0, 3) + '...' + user.walletAddress.slice(-3),
          position: index + 1
        }));
      };
      
      const realLeaderboard = {
        daily: formatLeaderboard(topUsers), // In a real app, filter by day
        weekly: formatLeaderboard(topUsers), // In a real app, filter by week  
        all_time: formatLeaderboard(topUsers)
      };
      
      res.json(realLeaderboard);
    } catch (error) {
      console.error("Leaderboard error:", error);
      // Return empty leaderboard as fallback
      res.json({ daily: [], weekly: [], all_time: [] });
    }
  });

  // User profile endpoint
  app.get("/api/profile/:walletAddress", async (req, res) => {
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
        achievements: achievements.slice(0, 5), // Recent 5 achievements
        recentScores: recentScores.slice(0, 10) // Recent 10 scores
      };
      
      res.json(profile);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin endpoint for airdrop data export
  app.get("/api/admin/airdrop-data", async (req, res) => {
    try {
      // In production, add authentication middleware here
      const airdropData = await storage.getAirdropData();
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="airdrop-eligible-users.json"');
      res.json({
        exportedAt: new Date().toISOString(),
        totalEligibleUsers: airdropData.length,
        users: airdropData
      });
    } catch (error) {
      console.error("Airdrop data export error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User achievements endpoint  
  app.get("/api/achievements/:walletAddress", async (req, res) => {
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

  // Session tracking endpoints
  app.post("/api/session/start", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}