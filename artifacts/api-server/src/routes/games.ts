import { Router, type IRouter } from "express";
import { eq, ilike, and, sql, gte, desc, asc } from "drizzle-orm";
import { db, gamesTable } from "@workspace/db";
import { requireAdmin } from "../lib/require-admin";
import {
  ListGamesQueryParams,
  ListGamesResponse,
  GetGameParams,
  GetGameResponse,
  TrackDownloadParams,
  TrackDownloadResponse,
  ListCategoriesResponse,
  GetGameStatsResponse,
  CreateGameBody,
  CreateGameResponse,
  UpdateGameParams,
  UpdateGameBody,
  UpdateGameResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /games
router.get("/games", async (req, res): Promise<void> => {
  const parsed = ListGamesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, featured, popular, minRating, sort } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(gamesTable.category, category));
  if (search) conditions.push(ilike(gamesTable.title, `%${search}%`));
  if (featured === true) conditions.push(eq(gamesTable.featured, true));
  if (popular === true) conditions.push(eq(gamesTable.popular, true));
  if (minRating !== undefined) conditions.push(gte(gamesTable.rating, minRating));

  let query = db.select().from(gamesTable);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (sort === "newest") {
    query = query.orderBy(desc(gamesTable.createdAt)) as typeof query;
  } else if (sort === "popular") {
    query = query.orderBy(desc(gamesTable.downloadCount)) as typeof query;
  } else if (sort === "rating") {
    query = query.orderBy(desc(gamesTable.rating)) as typeof query;
  } else if (sort === "alphabetical") {
    query = query.orderBy(asc(gamesTable.title)) as typeof query;
  }

  const games = await query;
  res.json(ListGamesResponse.parse(games.map(g => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  }))));
});

// POST /games
router.post("/games", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [created] = await db.insert(gamesTable).values(parsed.data).returning();

  res.status(201).json(CreateGameResponse.parse({ ...created, createdAt: created.createdAt.toISOString() }));
});

// PUT /games/:id
router.put("/games/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsedParams = UpdateGameParams.safeParse({ id: parseInt(rawId, 10) });
  if (!parsedParams.success) {
    res.status(400).json({ error: "Invalid game ID" });
    return;
  }

  const parsedBody = UpdateGameBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }

  const [updated] = await db
    .update(gamesTable)
    .set(parsedBody.data)
    .where(eq(gamesTable.id, parsedParams.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  res.json(UpdateGameResponse.parse({ ...updated, createdAt: updated.createdAt.toISOString() }));
});

// GET /games/stats
router.get("/games/stats", async (req, res): Promise<void> => {
  const games = await db.select().from(gamesTable);

  const categoryMap = new Map<string, { count: number; totalDownloads: number }>();
  for (const g of games) {
    const existing = categoryMap.get(g.category) ?? { count: 0, totalDownloads: 0 };
    categoryMap.set(g.category, {
      count: existing.count + 1,
      totalDownloads: existing.totalDownloads + g.downloadCount,
    });
  }

  const totalDownloads = games.reduce((sum, g) => sum + g.downloadCount, 0);
  const featuredCount = games.filter(g => g.featured).length;
  const popularCount = games.filter(g => g.popular).length;

  const topGames = [...games]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5)
    .map(g => ({
      id: g.id,
      title: g.title,
      downloadCount: g.downloadCount,
      category: g.category,
      imageUrl: g.imageUrl,
    }));

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    totalDownloads: data.totalDownloads,
  }));

  const stats = {
    totalGames: games.length,
    totalCategories: categoryMap.size,
    totalDownloads,
    featuredCount,
    popularCount,
    topGames,
    categoryBreakdown,
  };

  res.json(GetGameStatsResponse.parse(stats));
});

// GET /games/:id
router.get("/games/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetGameParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid game ID" });
    return;
  }

  const [game] = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.id, parsed.data.id));

  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  res.json(GetGameResponse.parse({ ...game, createdAt: game.createdAt.toISOString() }));
});

// POST /games/:id/download
router.post("/games/:id/download", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = TrackDownloadParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid game ID" });
    return;
  }

  const [updated] = await db
    .update(gamesTable)
    .set({ downloadCount: sql`${gamesTable.downloadCount} + 1` })
    .where(eq(gamesTable.id, parsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  res.json(TrackDownloadResponse.parse({ ...updated, createdAt: updated.createdAt.toISOString() }));
});

// GET /categories
router.get("/categories", async (req, res): Promise<void> => {
  const games = await db.select().from(gamesTable);

  const categoryMap = new Map<string, number>();
  for (const g of games) {
    categoryMap.set(g.category, (categoryMap.get(g.category) ?? 0) + 1);
  }

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  res.json(ListCategoriesResponse.parse(categories));
});

export default router;
