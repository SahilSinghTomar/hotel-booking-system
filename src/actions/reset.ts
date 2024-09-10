"use server";

import prisma from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return { error: "User not found!" };
  }

  const token = await generateResetPasswordToken({
    email,
  });

  if (token) {
    await sendResetPasswordEmail(email, token.token);
  }

  return { success: "Reset password link sent!" };
};
