// app/api/check-user/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma"; // Adjust this path if needed

export async function POST(request: Request) {
  const { email } = await request.json();

  // Check if a user with this email already exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return NextResponse.json({ exists: true });
  } else {
    return NextResponse.json({ exists: false });
  }
}
