import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export type AccessTokenPayload = {
  userId: string;
  role: Role;
};

const ROLES: ReadonlySet<string> = new Set(["CUSTOMER", "SELLER", "ADMIN"]);

function readSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, readSecret(), { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, readSecret());
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }
  const rec = decoded as Record<string, unknown>;
  const userId = rec.userId;
  const role = rec.role;
  if (typeof userId !== "string" || typeof role !== "string" || !ROLES.has(role)) {
    throw new Error("Invalid token payload");
  }
  return { userId, role: role as Role };
}
