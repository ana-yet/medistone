import { Role, UserStatus } from "@prisma/client";
import prisma from "../../prisma/client";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/errors";
import type { LoginInput, RegisterInput } from "./auth.validation";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} as const;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
};

async function assertEmailAvailable(email: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw AppError.conflict("Email already registered");
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<{ user: PublicUser; token: string }> {
    await assertEmailAvailable(input.email);
    const hashed = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
        role: Role.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
      select: publicUserSelect,
    });
    const token = signAccessToken({ userId: user.id, role: user.role });
    return { user, token };
  },

  async login(input: LoginInput): Promise<{ user: PublicUser; token: string }> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }
    if (user.status === UserStatus.BANNED) {
      throw AppError.forbidden("Account is banned");
    }
    const match = await comparePassword(input.password, user.password);
    if (!match) {
      throw AppError.unauthorized("Invalid email or password");
    }
    const safe: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
    const token = signAccessToken({ userId: user.id, role: user.role });
    return { user: safe, token };
  },
};
