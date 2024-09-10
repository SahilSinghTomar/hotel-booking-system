"use server";
import * as z from "zod";
import { ResetPasswordFormSchema } from "@/schemas";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordFormSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Token not found!" };
  }

  const validatedFields = ResetPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { password } = validatedFields.data;

  const existingEmail = await prisma.resetPasswordToken.findUnique({
    where: {
      token,
    },
  });

  if (!existingEmail) {
    return { error: "Invalid Token!" };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: existingEmail.email,
    },
  });

  if (!existingUser) {
    return { error: "User not found!" };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: {
      email: existingEmail.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.resetPasswordToken.delete({
    where: {
      token,
    },
  });

  return { success: "Password reset successfully!" };
};
