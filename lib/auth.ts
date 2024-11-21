// lib/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma";
import { sendEmail } from "@/modules/emails/actions/send-email";
import LoginLink from "@/modules/emails/templates/login-link";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const environment = process.env.NODE_ENV;
console.log(environment)

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        if (environment === "development") {
          console.log(`Login link: ${url}`);
        } else {
          console.log("sending Email");
          console.log(identifier);

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
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        ...session.user,
        id: token.sub,
        email: token?.user?.email,
      };
      return session;
    },
  },
  debug: true,
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
