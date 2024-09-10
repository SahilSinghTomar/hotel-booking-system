"use server";

import { currentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { AccountSettingsSchema } from "@/schemas";
import * as z from "zod";

export const settings = async (
  values: z.infer<typeof AccountSettingsSchema>
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

  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const token = await generateVerificationToken({ email: values.email });

    if (token) {
      await sendVerificationEmail(values.email, token.token);
    }

    return { success: "Verification email sent!" };
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
