import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      organization_id: string;
      internal_user_id: number;
    };
  }
}
