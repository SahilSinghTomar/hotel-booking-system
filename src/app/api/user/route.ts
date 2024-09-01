import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "User with this email already exists",
        },
        { status: 401 }
      );
    }

    // check if username already exists
    const userByUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userByUsername) {
      return NextResponse.json(
        {
          message: "User with this username already exists",
        },
        { status: 401 }
      );
    }

    // hash password
    const hashedPassword = await hash(password, 10);

    // create user
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (err) {
    NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
