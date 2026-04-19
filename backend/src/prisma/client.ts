import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7: connection URL is defined for Migrate in `prisma.config.ts`.
 * At runtime the same URL is used here via the PostgreSQL driver adapter
 * (Prisma 7 requires `adapter` or `accelerateUrl` on `PrismaClient`).
 */
const datasourceUrl = process.env.DATABASE_URL;
if (!datasourceUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(datasourceUrl),
});

export default prisma;
