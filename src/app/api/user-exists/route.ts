import { prisma } from "@/lib/db-fixed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }
    
    // Check if a user with the given email exists
    const query = `
      SELECT COUNT(*) FROM "user"
      WHERE email = $1
    `;
    
    const result = await prisma.$queryRaw(query, email);
    const count = parseInt(result[0].count);
    
    return NextResponse.json({ exists: count > 0 });
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return NextResponse.json(
      { error: "Failed to check if user exists" },
      { status: 500 }
    );
  }
} 