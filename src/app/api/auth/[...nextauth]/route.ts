import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL_SUBDOMAIN_REGEX = "@([^.]+)..+$";
const AMBOSS_ORG_ID = 4;
const AMBOSS_SECOND_EMAIL = "medicuja";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile: GoogleProfile) {
        const email = profile?.email;
        const emailSubdomain = email?.match(EMAIL_SUBDOMAIN_REGEX)?.[1];

        const org = await prisma.organization.findFirst({
          where: { name: emailSubdomain }
        });
        let orgId = org?.id;
        if (!orgId && emailSubdomain?.trim() === AMBOSS_SECOND_EMAIL) {
          orgId = AMBOSS_ORG_ID;
        }

        const user = await prisma.user.findFirst({ where: { email } });

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          organization_id: orgId,
          internal_user_id: user?.id ?? 3 // default to anonymous user
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session && token.sub) {
        session.user.internal_user_id = parseInt(token.sub); // hack to get the user id ..
      }

      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
