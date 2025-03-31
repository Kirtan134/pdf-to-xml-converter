import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-db";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if the environment variable is available
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
}

// Initialize Prisma Client with fallback to mock client for development
export const prisma = globalForPrisma.prisma ?? 
  (() => {
    try {
      const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
      
      // Test the connection
      client.$connect()
        .then(() => {
          console.log("Database connection successful");
        })
        .catch((error) => {
          console.error("Database connection failed, using mock database:", error);
          return mockPrisma;
        });
      
      return client;
    } catch (error) {
      console.error("Failed to initialize Prisma Client, using mock database:", error);
      return mockPrisma;
    }
  })();

// Fall back to mock client for development if needed
const withRecovery = async (operation: Function, fallback: any = null) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed, using mock database:", error);
    if (process.env.NODE_ENV === "production") {
      throw error; // Re-throw in production
    }
    return fallback;
  }
};

// Enhanced client that handles errors gracefully
export const safeClient = {
  user: {
    findUnique: async (args: any) => withRecovery(
      () => prisma.user.findUnique(args),
      mockPrisma.user.findUnique(args)
    ),
    create: async (args: any) => withRecovery(
      () => prisma.user.create(args),
      mockPrisma.user.create(args)
    ),
    update: async (args: any) => withRecovery(
      () => prisma.user.update(args),
      mockPrisma.user.update(args)
    ),
    // Add other methods as needed
  },
  conversion: {
    findUnique: async (args: any) => withRecovery(
      () => prisma.conversion.findUnique(args),
      mockPrisma.conversion.findUnique(args)
    ),
    findMany: async (args: any) => withRecovery(
      () => prisma.conversion.findMany(args),
      mockPrisma.conversion.findMany(args)
    ),
    create: async (args: any) => withRecovery(
      () => prisma.conversion.create(args),
      mockPrisma.conversion.create(args)
    ),
    update: async (args: any) => withRecovery(
      () => prisma.conversion.update(args),
      mockPrisma.conversion.update(args)
    ),
    count: async (args: any) => withRecovery(
      () => prisma.conversion.count(args),
      mockPrisma.conversion.count(args)
    ),
    // Add other methods as needed
  },
  $connect: async () => withRecovery(
    () => prisma.$connect(),
    mockPrisma.$connect()
  ),
  $disconnect: async () => withRecovery(
    () => prisma.$disconnect(),
    mockPrisma.$disconnect()
  ),
};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 