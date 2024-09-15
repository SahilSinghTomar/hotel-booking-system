import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { UpdateRoomTypeSchema } from "@/schemas/index";
import { currentUser } from "@/lib/auth";

export const PATCH = async (req: NextRequest, { params }: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validatedFields = UpdateRoomTypeSchema.safeParse(body);

  const roomTypeId = params.roomTypeId;
  const hotelId = params.hotelId;

  if (user.id !== hotelId.ownerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!validatedFields.success) {
    return NextResponse.json({ message: "Invalid Fields" }, { status: 400 });
  }

  const { amenities, rates, inventory } = validatedFields.data;

  // Fetch existing room type and amenities
  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
    include: { amenities: { include: { amenity: true } } },
  });

  if (!roomType) {
    return NextResponse.json(
      { message: "RoomType not found" },
      { status: 404 }
    );
  }

  const existingAmenities = roomType.amenities;

  if (!amenities) {
    return NextResponse.json(
      { message: "Amenities are required" },
      { status: 400 }
    );
  }

  // Process new amenities
  const newAmenityEntries = Object.entries(amenities).map(([key, value]) => ({
    amenityType: key,
    value,
  }));

  // Identify new and updated amenities
  const existingAmenityTypes = existingAmenities.map((amenity) => ({
    amenityType: amenity.amenity.amenityType,
    value: amenity.amenity.value,
  }));

  const newAmenitiesToAdd = newAmenityEntries.filter(
    (newAmenity) =>
      !existingAmenityTypes.some(
        (existing) =>
          existing.amenityType === newAmenity.amenityType &&
          existing.value === newAmenity.value
      )
  );

  const amenitiesToUpdate = existingAmenities.filter((existing) =>
    newAmenityEntries.some(
      (newAmenity) =>
        existing.amenity.amenityType === newAmenity.amenityType &&
        existing.amenity.value !== newAmenity.value
    )
  );

  const amenitiesToRemove = existingAmenities.filter(
    (existing) =>
      !newAmenityEntries.some(
        (newAmenity) =>
          existing.amenity.amenityType === newAmenity.amenityType &&
          existing.amenity.value === newAmenity.value
      )
  );

  // Update existing amenities
  await Promise.all(
    amenitiesToUpdate.map(async (existing) => {
      return prisma.amenities.update({
        where: { id: existing.amenityId },
        data: {
          value: newAmenityEntries.find(
            (na) => na.amenityType === existing.amenity.amenityType
          )?.value,
        },
      });
    })
  );

  // Add new amenities
  const newAmenityRecords = await Promise.all(
    newAmenitiesToAdd.map(async (amenity) => {
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

  // Create associations for new amenities
  const roomTypeAmenitiesData = newAmenityRecords.map((amenity) => ({
    roomTypeId,
    amenityId: amenity.id,
  }));

  await prisma.roomTypeAmenities.createMany({
    data: roomTypeAmenitiesData,
  });

  // Remove old amenities
  await prisma.roomTypeAmenities.deleteMany({
    where: {
      id: { in: amenitiesToRemove.map((a) => a.id) },
    },
  });

  // Update Rates
  if (rates && rates.length > 0) {
    await prisma.rate.deleteMany({ where: { roomTypeId } });

    const rateRecords = rates.map((rate: { rate: number; date: string }) => ({
      roomTypeId,
      hotelId: roomType.hotelId,
      rate: rate.rate,
      date: new Date(rate.date),
    }));

    await prisma.rate.createMany({ data: rateRecords });
  }

  // Update Inventory
  if (inventory && inventory.length > 0) {
    await prisma.inventory.deleteMany({ where: { roomTypeId } });

    const inventoryRecords = inventory.map(
      (inv: { totalRooms: number; availableRooms: number; date: string }) => ({
        roomTypeId,
        hotelId: roomType.hotelId,
        totalRooms: inv.totalRooms,
        availableRooms: inv.availableRooms,
        date: new Date(inv.date),
      })
    );

    await prisma.inventory.createMany({ data: inventoryRecords });
  }

  return NextResponse.json(
    { message: "RoomType updated successfully" },
    { status: 200 }
  );
};

export const GET = async (req: NextRequest, { params }: any) => {
  const roomTypeId = params.roomTypeId;

  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
    include: { amenities: { include: { amenity: true } } },
  });

  if (!roomType) {
    return NextResponse.json(
      { message: "RoomType not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ roomType });
};
