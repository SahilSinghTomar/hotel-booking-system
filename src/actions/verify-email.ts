"use server";

import prisma from "@/lib/db";

export const VerifyEmail = async (token: string | null) => {
  if (!token) {
    return { error: "No token Found!" };
  }

  const verifyToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!verifyToken) {
    return { error: "Invalid Token!" };
  }

  if (verifyToken.expires < new Date()) {
    return { error: "Token expired!" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: verifyToken.email,
    },
  });

  if (!user) {
    return { error: "Email not found!" };
  }

  await prisma.user.update({
    where: {
      email: verifyToken.email,
    },
    data: {
      emailVerified: new Date(),
      email: verifyToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      token,
    },
  });

  return { success: "Email verified!" };
};
