import { Router } from "express";
import { upvoteCleanupProof } from "../controllers/proofController.js";

const router = Router();

// Upvote a cleanup proof and potentially trigger bounty release
router.post("/:proofId/upvote", upvoteCleanupProof);

export default router;

