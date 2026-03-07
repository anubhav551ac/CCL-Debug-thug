import { Router } from "express";
import { getCommunityUpdates } from "../controllers/communityController.js";

const router = Router();

router.get("/updates", getCommunityUpdates);

export default router;
