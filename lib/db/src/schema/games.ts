import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gamesTable = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  badge: text("badge"),
  badgeColor: text("badge_color"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull().default(0),
  platform: text("platform").notNull().default("Android"),
  size: text("size").notNull().default(""),
  sizeMb: integer("size_mb").notNull().default(0),
  version: text("version").notNull().default(""),
  downloadUrl: text("download_url").notNull().default("#"),
  featured: boolean("featured").notNull().default(false),
  popular: boolean("popular").notNull().default(false),
  modFeatures: text("mod_features").array().notNull().default([]),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGameSchema = createInsertSchema(gamesTable).omit({ id: true, createdAt: true });
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof gamesTable.$inferSelect;
