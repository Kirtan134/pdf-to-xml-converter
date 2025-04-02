import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db-fixed";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify that the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get conversion count
    const conversionsCount = await prisma.conversion.count({
      where: { userId }
    });

    // Get the latest conversion (most recent)
    const latestConversion = await prisma.conversion.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        createdAt: true,
        status: true
      }
    });

    // Get stats by structure type
    const structureTypeCounts = await prisma.$queryRaw(
      `SELECT "structureType", COUNT(*) as count
       FROM "conversion"
       WHERE "userId" = $1
       GROUP BY "structureType"`,
      userId
    );

    // Return the stats
    return NextResponse.json({
      conversionsCount,
      latestConversion,
      structureTypeCounts
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
} 