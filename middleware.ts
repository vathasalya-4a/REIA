import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  let hostname = req.headers.get("host")!;
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const session = await getToken({ req });

  console.log(url);
  console.log(hostname);
  
  if (process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    hostname = hostname.replace("localhost:3000", `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  }

  console.log(hostname);
  console.log(session);
  console.log(path);

  if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // Allow unauthenticated access to /login and /register
    if (!session && path !== "/login" && path !== "/register") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  
    // Redirect authenticated users from /login and /register to home
    if (session && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  
    // Ensure authenticated users go to home if accessing /
    if (session && path === "/") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  }
  
  return NextResponse.rewrite(url);
}
