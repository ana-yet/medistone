import { Role, UserStatus } from "@prisma/client";
import prisma from "../../prisma/client";
import { hashPassword } from "../../utils/hash";
import { AppError } from "../../utils/errors";
import type { PublicUser } from "../auth/auth.service";
import type { UpdateUserStatusInput } from "./user.validation";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} as const;

export const userService = {
  async getProfile(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });
    if (!user) {
      throw AppError.notFound("User not found");
    }
    return user;
  },

  async listAll(): Promise<PublicUser[]> {
    return prisma.user.findMany({
      select: profileSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async setStatus(userId: string, input: UpdateUserStatusInput): Promise<PublicUser> {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw AppError.notFound("User not found");
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: input.status },
      select: profileSelect,
    });
    return user;
  },

  async createStaffUser(data: {
    name: string;
    email: string;
    password: string;
    role: "SELLER" | "ADMIN";
  }): Promise<PublicUser> {
    const dup = await prisma.user.findUnique({ where: { email: data.email } });
    if (dup) {
      throw AppError.conflict("Email already in use");
    }
    const hashed = await hashPassword(data.password);
    const role = data.role === "ADMIN" ? Role.ADMIN : Role.SELLER;
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role,
        status: UserStatus.ACTIVE,
      },
      select: profileSelect,
    });
  },
};
