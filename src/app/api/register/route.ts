import { query } from "@/lib/supabase-db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    console.log("Processing registration request");
    const { name, email, password } = await req.json();
    console.log(`Registration attempt for email: ${email}`);

    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log("Checking if user exists");
    const existingUserResult = await query(
      `SELECT id FROM "user" WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      console.log(`User with email ${email} already exists`);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    console.log("Hashing password");
    const hashedPassword = await hash(password, 10);
    const userId = uuidv4();
    const now = new Date();
    console.log(`Generated user ID: ${userId}`);

    // Create the user
    console.log("Creating new user");
    try {
      const result = await query(
        `INSERT INTO "user" (id, email, name, password, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email, name, "createdAt"`,
        [userId, email, name, hashedPassword, now, now]
      );

      const user = result.rows[0];
      console.log(`User successfully created with ID: ${user.id}`);

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
    } catch (insertError) {
      console.error("Error inserting user:", insertError);
      throw insertError;
    }
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