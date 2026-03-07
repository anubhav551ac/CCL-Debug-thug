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

  return { user, token: signToken({ id: user.id, email: user.email, name: user.name, role: user.role }) };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
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
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: signToken({ id: user.id, email: user.email, name: user.name, role: user.role }) };
};
