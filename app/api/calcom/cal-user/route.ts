import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        calId: true,
        calComAccessToken: true,
        calComRefreshToken: true,
        calComAccessTokenExpiresAt: true,
        scheduleId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching Cal.com details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { email, calId, name, accessToken, refreshToken, accessTokenExpiresAt, scheduleId } = await request.json();

  if (!email || !calId || !accessToken) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        calId: calId.toString(),
        calComAccessToken: accessToken,
        calComRefreshToken: refreshToken,
        calComAccessTokenExpiresAt: accessTokenExpiresAt ? new Date(accessTokenExpiresAt) : null,
        scheduleId: scheduleId ? scheduleId.toString() : null,
      },
    });

    return NextResponse.json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { calId, email, accessToken, refreshToken, accessTokenExpiresAt, scheduleId  } = await request.json();

  if (!email || !accessToken) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        calId: calId.toString(),
        calComAccessToken: accessToken,
        calComRefreshToken: refreshToken || undefined,
        calComAccessTokenExpiresAt: accessTokenExpiresAt ? new Date(accessTokenExpiresAt) : null,
        scheduleId: scheduleId ? scheduleId.toString() : undefined, 
      },
    });

    return NextResponse.json({
      message: "Access token updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating access token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
