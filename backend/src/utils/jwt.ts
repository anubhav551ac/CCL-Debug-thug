import jwt from "jsonwebtoken";
import type { AuthUser } from "../types/express.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const signToken = (payload: AuthUser): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token: string): AuthUser =>
  jwt.verify(token, JWT_SECRET) as AuthUser;
