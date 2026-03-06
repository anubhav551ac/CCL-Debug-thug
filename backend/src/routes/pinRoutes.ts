import { Router } from "express";
import { getPins, createPin, createPledge, upvotePin, removeUpvotePin } from "../controllers/pinController.js";
import { createCleanupProof } from "../controllers/proofController.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.get("/", getPins);
router.post("/", protect, createPin);

// Existing pledge route (kept for compatibility)
router.post("/:id/pledge", protect, createPledge);
// Alias using :pinId for clearer semantics
router.post("/:pinId/pledge", protect, createPledge);

router.post("/:id/upvote", upvotePin);
router.delete("/:id/upvote", removeUpvotePin);

// Create cleanup proof for a specific pin
router.post("/:pinId/proof", protect, createCleanupProof);

export default router;
