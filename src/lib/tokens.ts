import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export const generateTwoFactorToken = async ({ email }: { email: string }) => {
  const token = crypto.randomInt(100_000, 999_999).toString();
  const expires = new Date(new Date().getTime() + 600 * 1000); // 10 minutes

  try {
    const existingToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return twoFactorToken;
  } catch (err) {
    return null;
  }
};

export const generateResetPasswordToken = async ({
  email,
}: {
  email: string;
}) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const existingToken = await prisma.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });

    if (existingToken) {
      await prisma.resetPasswordToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const resetPasswordToken = await prisma.resetPasswordToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return resetPasswordToken;
  } catch (err) {
    return null;
  }
};

export const generateVerificationToken = async ({
  email,
}: {
  email: string;
}) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
    });

    if (existingToken) {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  } catch (err) {
    return null;
  }
};
