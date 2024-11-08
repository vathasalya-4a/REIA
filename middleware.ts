import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hostname } from "os";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  console.log(url)

  let hostname = req.headers
    .get("host")!
    .replace("localhost:3000", `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  
    console.log(hostname)

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  const session = await getToken({ req });

  console.log(session)
  console.log(path)

  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // Redirect to /auth/login if not authenticated
  if (!session && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Redirect authenticated users away from /auth/login to /dashboard
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Rewrite root path to /dashboard for authenticated users
  if (session && path === "/") {
    return NextResponse.rewrite(new URL("/", req.url));
  }
  return NextResponse.rewrite(
    new URL(`/app${path === "/" ? "" : path}`, req.url),
  );
}

  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // Rewrite remaining paths as-is (directly mapped to your new structure)
  return NextResponse.rewrite(url);
}
