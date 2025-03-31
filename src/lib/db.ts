import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-db";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with fallback to mock client for development
export const safeClient = globalForPrisma.prisma ?? 
  (() => {
    try {
      console.log("Initializing Prisma client...");
      
      // Create a new client without specifying datasource - it will use the env vars
      const client = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
      
      return client;
    } catch (error) {
      console.error("Failed to initialize Prisma Client:", error);
      if (process.env.NODE_ENV !== "production") {
        console.log("Using mock database for development");
        return mockPrisma;
      }
      throw error;
    }
  })();

// Create an alias for compatibility with existing code
export const prisma = safeClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 