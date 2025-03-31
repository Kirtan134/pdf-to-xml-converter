import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  let connection = false;
  let error = null;
  
  try {
    // Use a dedicated client for testing
    const prisma = new PrismaClient();
    
    console.log("Testing database connection to Supabase...");
    
    // Try to connect
    await prisma.$connect();
    console.log("Connected to Supabase database");
    
    // Try a simple query
    const count = await prisma.user.count();
    console.log(`Database connection successful. User count: ${count}`);
    
    // Disconnect properly
    await prisma.$disconnect();
    connection = true;
  } catch (e) {
    console.error("Database connection test failed:", e);
    error = e instanceof Error ? e.message : String(e);
  }
  
  return NextResponse.json({
    success: connection,
    message: connection ? "Connected successfully to Supabase" : "Failed to connect to Supabase",
    error,
    env: {
      database_url_masked: process.env.DATABASE_URL?.replace(/:[^:]*@/, ":*****@"),
      node_env: process.env.NODE_ENV,
    }
  });
} 