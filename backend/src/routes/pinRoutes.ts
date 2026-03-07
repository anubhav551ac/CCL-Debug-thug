import { Router } from "express";
import { getPins, createPin, createPledge, upvotePin, removeUpvotePin, getPledges, getPinRankings } from "../controllers/pinController.js";
import { createCleanupProof, claimBounty, uploadProofImage } from "../controllers/proofController.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.get("/", getPins);
router.post("/", protect, createPin);

// Existing pledge route (kept for compatibility)
router.post("/:id/pledge", protect, createPledge);
// Alias using :pinId for clearer semantics
router.post("/:pinId/pledge", protect, createPledge);
router.get("/:id/pledges", getPledges);

router.post("/:id/upvote", upvotePin);
router.delete("/:id/upvote", removeUpvotePin);

// Create cleanup proof for a specific pin
router.post("/:pinId/proof", protect, createCleanupProof);

// Claim a bounty (creates stub CleanupProof + sets pin to CLAIMED)
router.post("/:id/claim", protect, claimBounty);

// Upload proof image (fills afterImage + sets pin to VERIFYING)
router.put("/:id/proof", protect, uploadProofImage);

router.get("/rankings", getPinRankings);

export default router;
