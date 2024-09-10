"use server";

import * as z from "zod";
import { PasswordChangeSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { compare, hash } from "bcryptjs";
import prisma from "@/lib/db";

export const settings = async (
  values: z.infer<typeof PasswordChangeSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  console.log(user);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  console.log("DB USER: ", dbUser);

  if (!dbUser) {
    return { error: "User not found" };
  }

  if (dbUser.password && values.currentPassword) {
    const isValid = await compare(values.currentPassword, dbUser.password);

    if (!isValid) {
      return { error: "Incorrect password" };
    }
  }

  const hashedPassword = await hash(values.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "Password updated" };
};
