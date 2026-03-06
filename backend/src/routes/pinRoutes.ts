import { Router } from "express";
import { getPins, createPin, createPledge, upvotePin, removeUpvotePin } from "../controllers/pinController.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.get("/", getPins);
router.post("/", protect, createPin);
router.post("/:id/pledge", protect, createPledge);
router.post("/:id/upvote", upvotePin);
router.delete("/:id/upvote", removeUpvotePin);

export default router;
