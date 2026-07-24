import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gamesRouter from "./games";
import appsRouter from "./apps";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);
router.use(appsRouter);

export default router;
