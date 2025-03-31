import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return NextResponse.json(
      { error: "Failed to check if user exists" },
      { status: 500 }
    );
  }
} 