import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "@/auth.config";

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN";
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    hasPassword?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN";
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      hasPassword: boolean;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: existingUser.id,
        },
      });

      token.isOAuth = !!existingAccount;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.hasPassword = !!existingUser.password;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (token.name && session.user) {
        session.user.name = token.name;
      }

      if (token.email && session.user) {
        session.user.email = token.email;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      if (token.isOAuth && session.user) {
        session.user.isOAuth = token.isOAuth;
      }

      if (token.hasPassword && session.user) {
        session.user.hasPassword = token.hasPassword;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credientials") return true;

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      // Blocking user whose email is not verified to signin
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirm = await prisma.twoFactorConfirmation.findUnique({
          where: {
            userId: existingUser.id,
          },
        });

        if (!twoFactorConfirm) {
          return false;
        }

        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirm.id,
          },
        });
      }

      return true;
    },
  },

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/auth/signin",
  },
});
