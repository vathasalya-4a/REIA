import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma";
import { sendEmail } from "@/modules/emails/actions/send-email";
import LoginLink from "@/modules/emails/templates/login-link";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const environment = process.env.NODE_ENV;

// Define base URL based on environment
const BASE_URL =
  environment === "development"
    ? "http://localhost:3000"
    : `https://reia.up.railway.app`;

console.log(`Environment: ${environment}`);
console.log(`Base URL: ${BASE_URL}`);

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const updatedUrl = url.replace(
          /^https?:\/\/[^\/]+/i,
          BASE_URL
        ).replace(
          /callbackUrl=http%3A%2F%2Flocalhost%3A3000/i,
          `callbackUrl=${encodeURIComponent(BASE_URL)}`
        );

        console.log(environment);

        if (environment === "development") {
          console.log(`Login link (console): ${updatedUrl}`);
        } else {
          console.log(`Login link (production): ${updatedUrl}`);
          console.log("Sending email...");
          console.log("Recipient:", identifier);
          await sendEmail({
            email: identifier,
            subject: "Your Login Link",
            react: LoginLink({
              url: updatedUrl,
              email: identifier,
            }),
          });
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/clients",
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

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser?.calcomUsername) {
          const calcomUsername = user.email.split("@")[0];
          await prisma.user.update({
            where: { email: user.email },
            data: { calcomUsername },
          });
          console.log(`Generated Cal.com username: ${calcomUsername}`);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        ...session.user,
        id: token.sub,
        email: token?.user?.email || token.email || session.user?.email,
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
