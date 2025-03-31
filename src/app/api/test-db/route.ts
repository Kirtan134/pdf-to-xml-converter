import { testDatabaseConnection } from "@/lib/direct";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await testDatabaseConnection();
  
  return NextResponse.json(result, { 
    status: result.success ? 200 : 500 
  });
} 