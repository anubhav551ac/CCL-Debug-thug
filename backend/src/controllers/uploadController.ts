import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.js";

export const updateProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }

    const filename = req.file.filename;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePic: filename },
      select: { id: true, email: true, name: true, role: true, profilePic: true },
    });

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};
