import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { registerUser, loginUser } from "../services/authService.js";
import prisma from "../utils/prisma.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  console.log("Register is running");

  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed" });
      return;
    }

    const { user, token } = await registerUser(parsed.data);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed" });
      return;
    }

    const { user, token } = await loginUser(parsed.data.email, parsed.data.password);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ success: true, data: { message: "Logged out" } });
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    // Fetch complete user data with counts
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        profilePic: true,
        role: true,
        reputation: true,
        mockBalance: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reportsCreated: true,
            cleanupsDone: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }

    // Transform the response to include totalReports and totalCleanups
    const userResponse = {
      ...user,
      totalReports: user._count.reportsCreated,
      totalCleanups: user._count.cleanupsDone,
      municipality: "", // This can be set later if we store it in User model
    };

    res.status(200).json({ success: true, data: { user: userResponse } });
  } catch (err) {
    next(err);
  }
};
