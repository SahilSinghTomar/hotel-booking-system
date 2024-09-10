"use server";

import * as z from "zod";
import { SignupSchema } from "@/schemas";
import prisma from "@/lib/db";

import { hash } from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const signup = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = await generateVerificationToken({ email });

  if (token) {
    await sendVerificationEmail(token.email, token.token);
  }

  return { success: "Confirmation email sent!" };
};
