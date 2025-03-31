import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with proper configuration for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error", "query"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Create a safe client that doesn't use the global instance
export const safeClient = new PrismaClient({
  log: ["error", "query"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Test database connection with retries
const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    // Log environment variables (without sensitive data)
    console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    console.log('Environment:', process.env.NODE_ENV);
  }
};

// Test connection on startup
testConnection();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 