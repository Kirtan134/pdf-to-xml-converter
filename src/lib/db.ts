import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-db";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with proper configuration for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error"],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 