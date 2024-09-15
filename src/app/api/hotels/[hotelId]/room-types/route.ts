import { NextRequest, NextResponse } from "next/server";
import { CreateRoomTypeSchema } from "@/schemas/index";
import prisma from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const POST = async (req: NextRequest, { params }: any) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const hotelId = params.hotelId;
  const body = await req.json();

  // Validate the request body
  const validatedField = CreateRoomTypeSchema.safeParse(body);
  if (!validatedField.success) {
    return NextResponse.json({ message: "Invalid Fields" }, { status: 400 });
  }

  const { name, amenities, rates, inventory } = validatedField.data;

  try {
    // Ensure the user is the owner of the hotel
    const hotel = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
        ownerId: user.id,
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { message: "Hotel not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create the room type
    const roomType = await prisma.roomType.create({
      data: {
        name,
        hotelId: hotel.id,
      },
    });

    if (amenities && Object.keys(amenities).length > 0) {
      // Create amenities records if they don't exist already
      const amenityEntries = Object.entries(amenities).map(([key, value]) => ({
        amenityType: key, // e.g., "noOfBeds"
        value, // e.g., "2"
      }));

      // Insert or update amenities in the database
      const amenityRecords = await Promise.all(
        amenityEntries.map(async (amenity) => {
          const existingAmenity = await prisma.amenities.findFirst({
            where: {
              amenityType: amenity.amenityType,
              value: amenity.value,
            },
          });

          if (existingAmenity) {
            return existingAmenity;
          }

          return prisma.amenities.create({
            data: amenity,
          });
        })
      );

      // Create associations in RoomTypeAmenities
      const roomTypeAmenitiesData = amenityRecords.map((amenity) => ({
        roomTypeId: roomType.id,
        amenityId: amenity.id,
      }));

      await prisma.roomTypeAmenities.createMany({
        data: roomTypeAmenitiesData,
      });
    }

    if (rates && rates.length > 0) {
      const rateRecords = rates.map((rate: { rate: number; date: string }) => ({
        roomTypeId: roomType.id,
        hotelId,
        rate: rate.rate,
        date: new Date(rate.date),
      }));

      await prisma.rate.createMany({
        data: rateRecords,
      });
    }

    // Handle Inventory
    if (inventory && inventory.length > 0) {
      const inventoryRecords = inventory.map(
        (inv: {
          totalRooms: number;
          availableRooms: number;
          date: string;
        }) => ({
          roomTypeId: roomType.id,
          hotelId,
          totalRooms: inv.totalRooms,
          availableRooms: inv.availableRooms,
          date: new Date(inv.date),
        })
      );

      await prisma.inventory.createMany({
        data: inventoryRecords,
      });
    }

    return NextResponse.json(
      { message: "RoomType created successfully", roomTypeId: roomType.id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
