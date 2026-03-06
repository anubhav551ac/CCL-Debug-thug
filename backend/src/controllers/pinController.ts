import type { Request, Response, NextFunction } from "express";
import { createPinSchema, pledgeSchema } from "../validators/pinValidators.js";
import * as pinService from "../services/pinService.js";

export const getPins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pins = await pinService.getPins();
        res.status(200).json({ success: true, data: pins });
    } catch (error) {
        next(error);
    }
};

export const agePinDev = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pin = await pinService.agePinDev(req.params.id as string);
        res.status(200).json({ success: true, data: pin });
    } catch (error) {
        next(error);
    }
};

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

export const upvotePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pinId = req.params.id as string;
        const pin = await pinService.upvotePin(pinId);
        res.status(200).json({ success: true, data: pin });
    } catch (error) {
        next(error);
    }
};

export const removeUpvotePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pinId = req.params.id as string;
        const pin = await pinService.removeUpvotePin(pinId);
        res.status(200).json({ success: true, data: pin });
    } catch (error) {
        next(error);
    }
};
