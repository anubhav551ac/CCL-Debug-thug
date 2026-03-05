import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { registerUser, loginUser } from "../services/authService.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse({
      ...req.body,
      wardNumber: req.body.wardNumber != null ? Number(req.body.wardNumber) : undefined,
    });
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.errors[0]?.message ?? "Validation failed" });
      return;
    }

    const { user, token } = await registerUser(parsed.data);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.errors[0]?.message ?? "Validation failed" });
      return;
    }

    const { user, token } = await loginUser(parsed.data.email, parsed.data.password);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, data: { user } });
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
    res.status(200).json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
};
