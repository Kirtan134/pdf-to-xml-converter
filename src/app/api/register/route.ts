import { prisma } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

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

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }

    // Check if user exists
    console.log("Checking if user exists");
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    console.log("Hashing password");
    const hashedPassword = await hash(password, 10);

    // Create the user with Prisma
    console.log("Creating new user with Prisma");
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });

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
      if (insertError instanceof Error) {
        console.error("Error name:", insertError.name);
        console.error("Error message:", insertError.message);
        console.error("Error stack:", insertError.stack);
      }
      throw insertError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    // Log detailed error information
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.POSTGRES_PRISMA_URL,
        hasDirectUrl: !!process.env.POSTGRES_URL_NON_POOLING
      }
    };
    
    console.error("Error details:", errorDetails);
    
    return NextResponse.json(
      { 
        error: "Failed to register user",
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 