// lib/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma";
import { sendEmail } from "@/modules/emails/actions/send-email";
import LoginLink from "@/modules/emails/templates/login-link";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV === "development") {
          // Log the login link to the console for development testing
          console.log(`Login link: ${url}`);
        } else {
          // In production, send an email with the login link
          await sendEmail({
            email: identifier,
            subject: "Your Login Link",
            react: LoginLink({ url, email: identifier }),
          });
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login",
    error: "/login",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.user?.id as string,
        username: token.user?.username as string,
      };
      return session;
    },
  },
  debug: true, // Enable detailed debug logs
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}
