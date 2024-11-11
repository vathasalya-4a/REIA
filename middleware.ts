import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Debugging to verify session state
  // console.log("Session:", session);
  // console.log("Pathname:", pathname);

  // Redirect unauthenticated users trying to access protected routes to /login
  if (!session && pathname.startsWith("/sites")) {
    console.log("Redirecting to /login due to missing session.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users trying to access /login to /sites
  if (session && pathname === "/login") {
    console.log("Redirecting to /sites because session exists.");
    return NextResponse.redirect(new URL("/sites", req.url));
  }

  // Allow request if no redirection is needed
  return NextResponse.next();
}
