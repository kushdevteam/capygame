import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";

// Simple in-memory storage for demo (replace with database in production)
const users: Map<string, { walletAddress: string; username: string; pin: string; id: string }> = new Map();
const scores: Array<{ userId: string; level: number; score: number; completed: boolean; timestamp: string }> = [];

function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const { walletAddress, username, pin } = req.body;
      
      if (!walletAddress || !username || !pin) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        return res.status(400).json({ error: "PIN must be exactly 4 digits" });
      }
      
      // Check if wallet address already exists
      if (users.has(walletAddress)) {
        return res.status(409).json({ error: "Wallet address already registered" });
      }
      
      const userId = crypto.randomUUID();
      const hashedPin = hashPin(pin);
      
      const user = {
        id: userId,
        walletAddress,
        username,
        pin: hashedPin
      };
      
      users.set(walletAddress, user);
      
      // Return user data (without PIN)
      const safeUser = {
        id: userId,
        walletAddress,
        username
      };
      
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { walletAddress, pin } = req.body;
      
      if (!walletAddress || !pin) {
        return res.status(400).json({ error: "Missing wallet address or PIN" });
      }
      
      const user = users.get(walletAddress);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const hashedPin = hashPin(pin);
      if (user.pin !== hashedPin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Return user data (without PIN)
      const safeUser = {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username
      };
      
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Score submission endpoint
  app.post("/api/submit-score", async (req, res) => {
    try {
      const { walletAddress, level, score, completed } = req.body;
      
      if (!walletAddress || typeof level !== 'number' || typeof score !== 'number') {
        return res.status(400).json({ error: "Invalid input data" });
      }
      
      const user = users.get(walletAddress);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const scoreData = {
        userId: user.id,
        level,
        score,
        completed: !!completed,
        timestamp: new Date().toISOString()
      };
      
      scores.push(scoreData);
      console.log("Score submitted:", scoreData);
      
      res.json({ success: true, message: "Score submitted successfully" });
    } catch (error) {
      console.error("Score submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Leaderboard endpoint
  app.get("/api/leaderboard", async (req, res) => {
    try {
      // Get top scores with user info
      const topScores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 100)
        .map((score, index) => {
          const user = Array.from(users.values()).find(u => u.id === score.userId);
          return {
            rank: index + 1,
            username: user?.username || 'Unknown',
            walletAddress: user?.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : 'N/A',
            score: score.score,
            level: score.level,
            completed: score.completed
          };
        });
      
      res.json(topScores);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
