import { prisma } from "@/lib/db-fixed";
import { NextRequest, NextResponse } from "next/server";

// Get user's conversions
export async function GET(request: NextRequest) {
  try {
    // Parse pagination parameters
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Get all conversions with pagination
    const query = `
      SELECT 
        id, 
        filename, 
        status, 
        "createdAt", 
        "fileSize", 
        "pageCount", 
        "structureType", 
        metadata, 
        tags
      FROM "conversion"
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
    `;
    
    const conversions = await prisma.$queryRaw(query, limit, offset);
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM "conversion"`;
    const countResult = await prisma.$queryRaw(countQuery);
    const totalItems = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
    // Build pagination info
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    };

    return NextResponse.json({
      conversions,
      pagination
    });
  } catch (error) {
    console.error("Error fetching conversions:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversions" },
      { status: 500 }
    );
  }
} 