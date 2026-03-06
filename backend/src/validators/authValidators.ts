import { z } from "zod";

const NEPAL_PHONE_REGEX = /^(\+977)?9[6-9]\d{8}$/;

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().regex(NEPAL_PHONE_REGEX, "Invalid Nepal phone number"),
  municipality: z.string().min(1, "Municipality is required"),
  role: z.enum(["CITIZEN", "COLLECTOR", "WARD_OFFICER"]).optional(),
  profilePic: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
