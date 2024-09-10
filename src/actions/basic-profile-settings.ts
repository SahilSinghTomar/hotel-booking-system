"use server";

import { BasicProfileSettingsSchema } from "@/schemas";
import * as z from "zod";

import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export const settings = async (
  values: z.infer<typeof BasicProfileSettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "Settings updated!" };
};
