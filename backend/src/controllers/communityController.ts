import type { Request, Response, NextFunction } from "express";
import * as communityService from "../services/communityService.js";

export const getCommunityUpdates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updates = await communityService.getCommunityUpdates();
        res.status(200).json({ success: true, data: updates });
    } catch (error) {
        next(error);
    }
};
