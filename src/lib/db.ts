import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with proper configuration for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error", "query"],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING
    }
  }
});

// Create a safe client that doesn't use the global instance
export const safeClient = new PrismaClient({
  log: ["error", "query"],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING
    }
  }
});

// Print database connection info on startup
console.log('Database connection info:');
console.log('- Environment:', process.env.NODE_ENV);
console.log('- Connection URL type:', process.env.POSTGRES_PRISMA_URL ? 'Pooled' : 'Non-pooled');

// Test database connection with retries
const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    // Log environment variables (without sensitive data)
    if (process.env.POSTGRES_PRISMA_URL) {
      console.log('Using pooled URL:', process.env.POSTGRES_PRISMA_URL.substring(0, 20) + '...');
    }
    if (process.env.POSTGRES_URL_NON_POOLING) {
      console.log('Using non-pooled URL:', process.env.POSTGRES_URL_NON_POOLING.substring(0, 20) + '...');
    }
  }
};

// Test connection on startup
testConnection();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 