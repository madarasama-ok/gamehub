import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appsTable = pgTable("apps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  developer: text("developer").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull().default(0),
  platform: text("platform").notNull().default("Android"),
  size: text("size").notNull().default(""),
  sizeMb: integer("size_mb").notNull().default(0),
  version: text("version").notNull().default(""),
  downloadUrl: text("download_url").notNull().default("#"),
  featured: boolean("featured").notNull().default(false),
  popular: boolean("popular").notNull().default(false),
  features: text("features").array().notNull().default([]),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAppSchema = createInsertSchema(appsTable).omit({ id: true, createdAt: true });
export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof appsTable.$inferSelect;
