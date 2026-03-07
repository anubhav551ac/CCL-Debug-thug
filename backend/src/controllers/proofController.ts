import type { Request, Response, NextFunction } from "express";
import { createCleanupProofSchema, uploadProofImageSchema } from "../validators/proofValidators.js";
import * as proofService from "../services/proofService.js";

export const createCleanupProof = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createCleanupProofSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const pinId = (req.params.pinId ?? req.params.id) as string;
    const proof = await proofService.createCleanupProof(req.user.id, pinId, parsed.data);

    res.status(201).json({ success: true, data: proof });
  } catch (error) {
    next(error);
  }
};

export const claimBounty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const pinId = (req.params.id ?? req.params.pinId) as string;
    const proof = await proofService.claimBounty(req.user.id, pinId);

    res.status(201).json({ success: true, data: proof });
  } catch (error) {
    next(error);
  }
};

export const uploadProofImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = uploadProofImageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const pinId = (req.params.id ?? req.params.pinId) as string;
    const proof = await proofService.uploadProofImage(req.user.id, pinId, parsed.data);

    res.status(200).json({ success: true, data: proof });
  } catch (error) {
    next(error);
  }
};

export const upvoteCleanupProof = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proofId = req.params.proofId as string;
    const proof = await proofService.upvoteCleanupProof(proofId);
    res.status(200).json({ success: true, data: proof });
  } catch (error) {
    next(error);
  }
};
