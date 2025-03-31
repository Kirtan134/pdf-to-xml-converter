import { query } from "@/lib/supabase-db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUserResult = await query(
      `SELECT id FROM "User" WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    const userId = uuidv4();
    const now = new Date();

    // Create the user
    const result = await query(
      `INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, name, "createdAt"`,
      [userId, email, name, hashedPassword, now, now]
    );

    const user = result.rows[0];

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
        error: "Registration failed", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 