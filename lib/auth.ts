// lib/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma";
import { sendEmail } from "@/modules/emails/actions/send-email";
import LoginLink from "@/modules/emails/templates/login-link";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
const environment = process.env.NODE_ENV;

console.log(environment);

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        console.log(environment);
        if (environment === "development") {
          console.log(`Login link: ${url}`);
        } else {
          const url =  `https://reia.up.railway.app/api/auth/callback/email?callbackUrl=https%3A%2F%2Freia.up.railway.app%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com`
          console.log("Sending email...");
          console.log("Recipient:", identifier);
          await sendEmail({
            email: identifier,
            subject: "Your Login Link",
            react: LoginLink({ 
             url ,
              email: identifier,
             }),
          });
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
    verifyRequest: "/login", // Verification request notification
    error: "/login", // Redirect to the login page on errors
  },
  adapter: PrismaAdapter(prisma), // Prisma adapter to connect to the database
  session: {
    strategy: "jwt", // Use JWT for sessions
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
      // If the user logs in, attach their details to the token
      if (user) {
        token.user = user;

        // Check if the user has a Cal.com username
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser?.calcomUsername) {
          // Generate a Cal.com username from the user's email
          const calcomUsername = user.email.split("@")[0];

          // Update the user record in the database
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
      // Attach the user's ID and email to the session object
      session.user = {
        ...session.user,
        id: token.sub, // Add the user ID from the token
        email: token?.user?.email || token.email || session.user?.email, // Ensure the email is always populated
      };
      return session;
    },
  },
  debug: true, // Enable debug mode for NextAuth
};

// Helper function to get the server session
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
