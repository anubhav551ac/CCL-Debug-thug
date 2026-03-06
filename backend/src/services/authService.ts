import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { signToken } from "../utils/jwt.js";
import type { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role?: Role;
  profilePic?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw Object.assign(new Error("Email already registered"), { statusCode: 400 });
  }

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      phoneNumber: data.phoneNumber,
      role: data.role ?? "CITIZEN",
      profilePic: data.profilePic,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  return { user, token: signToken(user) };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const { id, name, role } = user;
  return { user: { id, email: user.email, name, role }, token: signToken({ id, email: user.email, name, role }) };
};
