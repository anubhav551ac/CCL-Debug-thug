import type { RequestHandler } from "express";
import prisma from "../utils/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export const protect: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};
