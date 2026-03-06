import { Router } from "express";
import { getRoot } from "../controllers/healthController.js";
import pinRoutes from "./pinRoutes.js";
import proofRoutes from "./proofRoutes.js";

const router = Router();

router.get("/", getRoot);
router.use("/pins", pinRoutes);
router.use("/proofs", proofRoutes);

export default router;

