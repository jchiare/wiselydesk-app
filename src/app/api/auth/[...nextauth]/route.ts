import NextAuth from "next-auth";
import { authOptions } from "@/lib/web/next-auth-hack";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
