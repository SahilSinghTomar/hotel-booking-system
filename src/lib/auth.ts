import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          throw new Error("No user found with this email");
        }

        if (existingUser.password) {
          const passwordMatch = await compare(
            credentials.password,
            existingUser.password
          );

          if (!passwordMatch) {
            throw new Error("Incorrect credentials");
          }
        } else {
          throw new Error("No password set for this user");
        }

        return {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          email: token.email,
          name: token.name,
          image: token.image as string | null, // Ensure the image is passed to the session
          id: token.jti as string,
        },
      };
    },
  },
};
