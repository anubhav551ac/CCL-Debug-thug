import { Router } from "express";
import { createPin, createPledge } from "../controllers/pinController.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.post("/", protect, createPin);
router.post("/:id/pledge", protect, createPledge);

export default router;
