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

  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  
  console.log(`app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const session = await getToken({ req });
  
  console.log("Session:", session);
  console.log("Path:", path);

  // Middleware logic for different environments
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
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
  
  return NextResponse.rewrite(url);
}
