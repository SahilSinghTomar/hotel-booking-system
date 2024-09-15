import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { UpdateHotelSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: any) => {
  const user = await currentUser();
  const body = await req.json();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validatedFields = UpdateHotelSchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid Fields" }, { status: 400 });
  }

  const hotelId = params.hotelId;

  if (!hotelId) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    if (hotel.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      address,
      country,
      city,
      state,
      zip,
      phone,
      website,
      description,
    } = validatedFields.data;

    await prisma.hotel.update({
      where: {
        id: hotelId,
      },
      data: {
        name,
        address,
        country,
        city,
        state,
        zip,
        phone,
        website,
        description,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest, { params }: any) => {
  const hotelId = params.hotelId;

  if (!hotelId) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ hotel });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
