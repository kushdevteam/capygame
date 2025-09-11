import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql, and } from 'drizzle-orm';
import { 
  users, 
  gameScores, 
  gameSessions, 
  userAchievements, 
  leaderboards,
  type User, 
  type InsertUser,
  type GameScore,
  type InsertScore,
  type GameSession,
  type InsertSession,
  type UserAchievement,
  type InsertAchievement
} from "../shared/schema";

// Use in-memory storage for better compatibility
let neonClient: any = null;
let db: any = null;
let useDatabase = false;

// For development, disable database and use in-memory storage
console.log('Using in-memory storage for development');
useDatabase = false;

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateUserStats(userId: number, stats: Partial<User>): Promise<void>;
  
  // Score management
  submitScore(score: InsertScore): Promise<GameScore>;
  getUserScores(userId: number): Promise<GameScore[]>;
  getTopScores(limit?: number): Promise<any[]>;
  
  // Session tracking
  createSession(session: InsertSession): Promise<GameSession>;
  endSession(sessionId: number, endTime: Date): Promise<void>;
  getUserSessions(userId: number): Promise<GameSession[]>;
  
  // Achievement system
  addAchievement(achievement: InsertAchievement): Promise<UserAchievement>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  
  // Leaderboards
  updateLeaderboards(): Promise<void>;
  getLeaderboard(type: 'daily' | 'weekly' | 'all_time', limit?: number): Promise<any[]>;
  
  // Admin data export
  getAirdropData(): Promise<any[]>;
}

class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private scores: GameScore[] = [];
  private sessions: GameSession[] = [];
  private achievements: UserAchievement[] = [];
  private idCounter = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return this.users.find(user => user.walletAddress === walletAddress);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.idCounter++,
      ...insertUser,
      createdAt: new Date(),
      lastLoginAt: new Date(),
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

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async updateUserStats(userId: number, stats: Partial<User>): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { 
        ...this.users[userIndex], 
        ...stats, 
        lastLoginAt: new Date() 
      };
    }
  }

  async submitScore(score: InsertScore): Promise<GameScore> {
    const gameScore: GameScore = {
      id: this.idCounter++,
      ...score,
      userId: score.userId!,
      timestamp: new Date()
    };
    this.scores.push(gameScore);
    await this.recalculateUserStats(score.userId!);
    return gameScore;
  }

  private async recalculateUserStats(userId: number): Promise<void> {
    const userScores = this.scores.filter(s => s.userId === userId);
    const completedLevels = userScores.filter(s => s.completed).length;
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
    const highestLevel = Math.max(...userScores.map(s => s.level), 1);
    const averageScore = userScores.length > 0 ? totalScore / userScores.length : 0;
    
    await this.updateUserStats(userId, {
      totalScore,
      levelsCompleted: completedLevels,
      highestLevel,
      gamesPlayed: userScores.length,
      averageScorePerLevel: averageScore
    });
  }

  async getUserScores(userId: number): Promise<GameScore[]> {
    return this.scores
      .filter(score => score.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getTopScores(limit = 100): Promise<any[]> {
    return this.scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((score, index) => {
        const user = this.users.find(u => u.id === score.userId);
        return {
          rank: index + 1,
          username: user?.username || 'Unknown',
          walletAddress: user?.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : 'N/A',
          score: score.score,
          level: score.level,
          completed: score.completed
        };
      });
  }

  async createSession(session: InsertSession): Promise<GameSession> {
    const gameSession: GameSession = {
      id: this.idCounter++,
      ...session,
      userId: session.userId!,
      startTime: new Date(),
      endTime: null
    };
    this.sessions.push(gameSession);
    return gameSession;
  }

  async endSession(sessionId: number, endTime: Date): Promise<void> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      this.sessions[sessionIndex].endTime = endTime;
    }
  }

  async getUserSessions(userId: number): Promise<GameSession[]> {
    return this.sessions
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async addAchievement(achievement: InsertAchievement): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: this.idCounter++,
      ...achievement,
      userId: achievement.userId!,
      unlockedAt: new Date()
    };
    this.achievements.push(userAchievement);
    
    // Update user achievement points
    await this.updateUserStats(achievement.userId!, {
      achievementPoints: (this.users.find(u => u.id === achievement.userId)?.achievementPoints || 0) + achievement.pointsAwarded
    });
    
    return userAchievement;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.achievements
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async updateLeaderboards(): Promise<void> {
    // In-memory doesn't need separate leaderboard storage
    // Leaderboards are calculated on-demand
  }

  async getLeaderboard(type: 'daily' | 'weekly' | 'all_time', limit = 50): Promise<any[]> {
    // For simplicity, return all-time leaderboard for all types in memory storage
    return await this.getTopScores(limit);
  }

  async getAirdropData(): Promise<any[]> {
    return this.users
      .filter(user => user.isEligibleForRewards)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map(user => ({
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      lastLoginAt: new Date(),
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

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async updateUserStats(userId: number, stats: Partial<User>): Promise<void> {
    await db.update(users).set({
      ...stats,
      lastLoginAt: new Date()
    }).where(eq(users.id, userId));
  }

  async submitScore(score: InsertScore): Promise<GameScore> {
    const result = await db.insert(gameScores).values({
      ...score,
      timestamp: new Date()
    }).returning();
    
    // Update user statistics
    await this.recalculateUserStats(score.userId!);
    
    return result[0];
  }

  private async recalculateUserStats(userId: number): Promise<void> {
    const userScores = await db.select().from(gameScores).where(eq(gameScores.userId, userId));
    const completedLevels = userScores.filter(s => s.completed).length;
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
    const highestLevel = Math.max(...userScores.map(s => s.level), 1);
    const averageScore = userScores.length > 0 ? totalScore / userScores.length : 0;
    
    await db.update(users).set({
      totalScore,
      levelsCompleted: completedLevels,
      highestLevel,
      gamesPlayed: userScores.length,
      averageScorePerLevel: averageScore
    }).where(eq(users.id, userId));
  }

  async getUserScores(userId: number): Promise<GameScore[]> {
    return await db.select().from(gameScores).where(eq(gameScores.userId, userId)).orderBy(desc(gameScores.timestamp));
  }

  async getTopScores(limit = 100): Promise<any[]> {
    const topScores = await db
      .select({
        score: gameScores.score,
        level: gameScores.level,
        completed: gameScores.completed,
        timestamp: gameScores.timestamp,
        username: users.username,
        walletAddress: users.walletAddress
      })
      .from(gameScores)
      .innerJoin(users, eq(gameScores.userId, users.id))
      .orderBy(desc(gameScores.score))
      .limit(limit);
    
    return topScores.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      walletAddress: `${score.walletAddress.slice(0, 4)}...${score.walletAddress.slice(-4)}`,
      score: score.score,
      level: score.level,
      completed: score.completed
    }));
  }

  async createSession(session: InsertSession): Promise<GameSession> {
    const result = await db.insert(gameSessions).values({
      ...session,
      startTime: new Date()
    }).returning();
    return result[0];
  }

  async endSession(sessionId: number, endTime: Date): Promise<void> {
    await db.update(gameSessions).set({ endTime }).where(eq(gameSessions.id, sessionId));
  }

  async getUserSessions(userId: number): Promise<GameSession[]> {
    return await db.select().from(gameSessions).where(eq(gameSessions.userId, userId)).orderBy(desc(gameSessions.startTime));
  }

  async addAchievement(achievement: InsertAchievement): Promise<UserAchievement> {
    const result = await db.insert(userAchievements).values({
      ...achievement,
      unlockedAt: new Date()
    }).returning();
    
    // Update user achievement points
    await db.update(users).set({
      achievementPoints: sql`${users.achievementPoints} + ${achievement.pointsAwarded}`
    }).where(eq(users.id, achievement.userId!));
    
    return result[0];
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId)).orderBy(desc(userAchievements.unlockedAt));
  }

  async updateLeaderboards(): Promise<void> {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    
    // Update daily leaderboard
    const dailyScores = await db
      .select({
        userId: gameScores.userId,
        score: sql<number>`MAX(${gameScores.score})`.as('max_score'),
        level: sql<number>`MAX(${gameScores.level})`.as('max_level')
      })
      .from(gameScores)
      .where(sql`DATE(${gameScores.timestamp}) = CURRENT_DATE`)
      .groupBy(gameScores.userId)
      .orderBy(desc(sql`MAX(${gameScores.score})`));
    
    // Clear existing daily leaderboard for today
    await db.delete(leaderboards).where(and(
      eq(leaderboards.leaderboardType, 'daily'),
      sql`DATE(${leaderboards.periodDate}) = CURRENT_DATE`
    ));
    
    // Insert new daily rankings
    for (let i = 0; i < dailyScores.length; i++) {
      await db.insert(leaderboards).values({
        userId: dailyScores[i].userId,
        leaderboardType: 'daily',
        score: dailyScores[i].score,
        level: dailyScores[i].level,
        rank: i + 1,
        periodDate: today.toISOString().split('T')[0]
      });
    }
  }

  async getLeaderboard(type: 'daily' | 'weekly' | 'all_time', limit = 50): Promise<any[]> {
    if (type === 'all_time') {
      return await this.getTopScores(limit);
    }
    
    const result = await db
      .select({
        rank: leaderboards.rank,
        score: leaderboards.score,
        level: leaderboards.level,
        username: users.username,
        walletAddress: users.walletAddress
      })
      .from(leaderboards)
      .innerJoin(users, eq(leaderboards.userId, users.id))
      .where(eq(leaderboards.leaderboardType, type))
      .orderBy(leaderboards.rank)
      .limit(limit);
    
    return result.map(entry => ({
      rank: entry.rank,
      username: entry.username,
      walletAddress: `${entry.walletAddress.slice(0, 4)}...${entry.walletAddress.slice(-4)}`,
      score: entry.score,
      level: entry.level
    }));
  }

  async getAirdropData(): Promise<any[]> {
    const result = await db
      .select({
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
      })
      .from(users)
      .where(eq(users.isEligibleForRewards, true))
      .orderBy(desc(users.totalScore));
    
    return result;
  }
}

// Use the appropriate storage implementation based on database availability
export const storage: IStorage = useDatabase ? new DatabaseStorage() : new InMemoryStorage();