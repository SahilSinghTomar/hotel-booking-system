import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    username: string | null;
    image?: string | null;
    name?: string | null;
  }

  interface Session {
    user: User & {
      username: string;
      email: string;
      name: string | null;
      image: string | null;
    };
  }

  interface JWT {
    username: string;
    email: string;
    name: string | null;
    image: string | null;
  }
}
