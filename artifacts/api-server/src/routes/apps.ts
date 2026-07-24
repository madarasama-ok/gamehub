import { Router, type IRouter } from "express";
import { eq, ilike, and, sql, gte, desc } from "drizzle-orm";
import { db, appsTable } from "@workspace/db";
import {
  ListAppsQueryParams,
  ListAppsResponse,
  GetAppParams,
  GetAppResponse,
  TrackAppDownloadParams,
  TrackAppDownloadResponse,
  ListAppCategoriesResponse,
  CreateAppBody,
  CreateAppResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /apps
router.get("/apps", async (req, res): Promise<void> => {
  const parsed = ListAppsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, featured, popular, minRating, sort } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(appsTable.category, category));
  if (search) conditions.push(ilike(appsTable.title, `%${search}%`));
  if (featured === true) conditions.push(eq(appsTable.featured, true));
  if (popular === true) conditions.push(eq(appsTable.popular, true));
  if (minRating !== undefined) conditions.push(gte(appsTable.rating, minRating));

  let query = db.select().from(appsTable);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (sort === "newest") {
    query = query.orderBy(desc(appsTable.createdAt)) as typeof query;
  } else if (sort === "popular") {
    query = query.orderBy(desc(appsTable.downloadCount)) as typeof query;
  } else if (sort === "rating") {
    query = query.orderBy(desc(appsTable.rating)) as typeof query;
  }

  const apps = await query;
  res.json(ListAppsResponse.parse(apps.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }))));
});

// POST /apps
router.post("/apps", async (req, res): Promise<void> => {
  const parsed = CreateAppBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [created] = await db.insert(appsTable).values(parsed.data).returning();

  res.status(201).json(CreateAppResponse.parse({ ...created, createdAt: created.createdAt.toISOString() }));
});

// GET /apps/:id
router.get("/apps/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetAppParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid app ID" });
    return;
  }

  const [app] = await db
    .select()
    .from(appsTable)
    .where(eq(appsTable.id, parsed.data.id));

  if (!app) {
    res.status(404).json({ error: "App not found" });
    return;
  }

  res.json(GetAppResponse.parse({ ...app, createdAt: app.createdAt.toISOString() }));
});

// POST /apps/:id/download
router.post("/apps/:id/download", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = TrackAppDownloadParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid app ID" });
    return;
  }

  const [updated] = await db
    .update(appsTable)
    .set({ downloadCount: sql`${appsTable.downloadCount} + 1` })
    .where(eq(appsTable.id, parsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "App not found" });
    return;
  }

  res.json(TrackAppDownloadResponse.parse({ ...updated, createdAt: updated.createdAt.toISOString() }));
});

// GET /app-categories
router.get("/app-categories", async (req, res): Promise<void> => {
  const apps = await db.select().from(appsTable);

  const categoryMap = new Map<string, number>();
  for (const a of apps) {
    categoryMap.set(a.category, (categoryMap.get(a.category) ?? 0) + 1);
  }

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  res.json(ListAppCategoriesResponse.parse(categories));
});

export default router;
