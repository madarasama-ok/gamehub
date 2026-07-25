import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    res.status(500).json({ error: "Server misconfigured: ADMIN_KEY not set" });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (token !== adminKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
