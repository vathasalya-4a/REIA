import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  console.log("Request URL:", url);

  // Determine the hostname, accommodating both localhost and production domains
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  
  console.log(`app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Construct the path with search parameters
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Retrieve the session from next-auth
  const session = await getToken({ req });
  
  console.log("Session:", session);
  console.log("Path:", path);

  // Middleware logic for different environments
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // Redirect to /auth/login if not authenticated
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Redirect authenticated users away from /login to /
    if (session && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Rewrite root path to /dashboard for authenticated users
    if (session && path === "/") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
  }

  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // Default rewrite for remaining paths
  return NextResponse.rewrite(url);
}
