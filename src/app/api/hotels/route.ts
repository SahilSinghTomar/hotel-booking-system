import { NextRequest, NextResponse } from "next/server";

import { CreateHotelSchema } from "@/schemas/index";
import prisma from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  const body = await req.json();

  const validatedField = CreateHotelSchema.safeParse(body);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id!;

  if (!validatedField.success) {
    return NextResponse.json({ error: "Invalid Fields" }, { status: 400 });
  }

  const {
    name,
    address,
    country,
    city,
    state,
    zip,
    phone,
    email,
    website,
    description,
  } = validatedField.data;

  try {
    await prisma.hotel.create({
      data: {
        name,
        address,
        country,
        city,
        state,
        zip,
        phone,
        email,
        website,
        description,
        ownerId: userId,
      },
    });

    return NextResponse.json(
      { success: "Hotel created Successfully!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
