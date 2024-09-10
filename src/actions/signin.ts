"use server";

import * as z from "zod";
import { SigninSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { compare } from "bcryptjs";

export const signin = async (values: z.infer<typeof SigninSchema>) => {
  const validatedFields = SigninSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.password) {
    return { error: "Password is not created for this user!" };
  }

  const passwordMatch = await compare(password, existingUser.password);

  if (!passwordMatch) {
    return { error: "Invalid credentials!" };
  }

  // Check if the user has verified their email
  if (!existingUser.emailVerified) {
    const token = await generateVerificationToken({
      email: existingUser.email,
    });

    if (token) {
      await sendVerificationEmail(existingUser.email, token.token);
    }

    return { success: "Confirmation email sent!" };
  }

  // Check if the user has two-factor enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const token = await prisma.twoFactorToken.findUnique({
        where: {
          token: code,
        },
      });

      if (!token) {
        return { error: "Invalid two-factor code!" };
      }

      if (token.token !== code) {
        return { error: "Invalid two-factor code!" };
      }

      if (token.expires < new Date()) {
        return { error: "Two-factor code expired!" };
      }

      await prisma.twoFactorToken.delete({
        where: {
          token: code,
        },
      });

      const existingConfirmation =
        await prisma.twoFactorConfirmation.findUnique({
          where: {
            userId: existingUser.id,
          },
        });

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken({
        email: existingUser.email,
      });

      if (twoFactorToken) {
        await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);
      }

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Signed in successfully!" };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "An error occurred!" };
      }
    }

    throw err;
  }
};
