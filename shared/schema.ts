import { pgTable, text, serial, integer, boolean, timestamp, date, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username").notNull(),
  pin: text("pin").notNull(), // Store hashed PIN
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
  isEligibleForRewards: boolean("is_eligible_for_rewards").default(true),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  level: integer("level").notNull(),
  score: integer("score").notNull(),
  completed: boolean("completed").default(false),
  playTimeSeconds: integer("play_time_seconds").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalPlayTimeMinutes: integer("total_play_time_minutes").default(0),
  levelsPlayed: integer("levels_played").default(0),
  date: date("date").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(), // e.g., "COMPLETE_5_LEVELS", "SCORE_10K", "PLAY_7_DAYS"
  achievementName: text("achievement_name").notNull(),
  pointsAwarded: integer("points_awarded").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  leaderboardType: text("leaderboard_type").notNull(), // "daily", "weekly", "all_time"
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  rank: integer("rank"),
  periodDate: date("period_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  username: true,
  pin: true,
});

export const insertScoreSchema = createInsertSchema(gameScores).pick({
  userId: true,
  level: true,
  score: true,
  completed: true,
  playTimeSeconds: true,
});

export const insertSessionSchema = createInsertSchema(gameSessions).pick({
  userId: true,
  totalPlayTimeMinutes: true,
  levelsPlayed: true,
});

export const insertAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementType: true,
  achievementName: true,
  pointsAwarded: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
