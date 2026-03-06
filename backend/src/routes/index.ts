import { Router } from "express";
import { getRoot } from "../controllers/healthController.js";
import pinRoutes from "./pinRoutes.js";

const router = Router();

router.get("/", getRoot);
router.use("/pins", pinRoutes);

export default router;

