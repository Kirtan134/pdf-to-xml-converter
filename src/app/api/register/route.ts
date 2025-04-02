import { prisma } from "@/lib/db-fixed";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // Parse request body
    let name, email, password;
    try {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request body - failed to parse JSON" },
        { status: 400 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const checkQuery = `
      SELECT COUNT(*) FROM "user"
      WHERE email = $1
    `;
    
    const existingUserResult = await prisma.$queryRaw(checkQuery, email);
    const userExists = parseInt(existingUserResult[0].count) > 0;

    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    const userId = uuidv4();

    // Create the user
    const insertQuery = `
      INSERT INTO "user" (id, name, email, password, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, "createdAt"
    `;
    
    const now = new Date();
    const userResult = await prisma.$queryRaw(
      insertQuery, 
      userId, 
      name, 
      email, 
      hashedPassword, 
      now, 
      now
    );
    
    const user = userResult[0];

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to register user",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 