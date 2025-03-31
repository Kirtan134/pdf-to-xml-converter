import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with proper configuration for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 