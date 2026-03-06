import type { Request, Response, NextFunction } from "express";
import { createPinSchema, pledgeSchema } from "../validators/pinValidators.js";
import * as pinService from "../services/pinService.js";

export const createPin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = createPinSchema.parse(req.body);
        if (!req.user) {
            res.status(401).json({ success: false, error: "Not authenticated" });
            return;
        }
        const pin = await pinService.createPin(req.user.id, body);
        res.status(201).json({ success: true, data: pin });
    } catch (error) {
        next(error);
    }
};

export const createPledge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = pledgeSchema.parse(req.body);
        const pinId = req.params.id as string;
        if (!req.user) {
            res.status(401).json({ success: false, error: "Not authenticated" });
            return;
        }
        const pledge = await pinService.createPledge(req.user.id, pinId, body);
        res.status(201).json({ success: true, data: pledge });
    } catch (error) {
        next(error);
    }
};
