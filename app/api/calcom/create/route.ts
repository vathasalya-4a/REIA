import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request) {
  const { email, username } = await req.json();

  if (!email || !username) {
    console.error("Missing email or username:", { email, username });
    return NextResponse.json(
      { error: "Email and username are required" },
      { status: 400 }
    );
  }

  try {
    console.log("Creating Cal.com profile with:", { email, username });
    console.log("CALCOM_API_KEY:", process.env.CALCOM_API_KEY);

    const calcomResponse = await fetch(
      `https://api.cal.com/v1/users?apiKey=${process.env.CALCOM_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          name: username,
        }),
      }
    );

    const responseBody = await calcomResponse.json();
    console.log("Cal.com response:", responseBody);

    if (!calcomResponse.ok) {
      return NextResponse.json(
        { error: responseBody.message || "Failed to create Cal.com profile" },
        { status: 500 }
      );
    }

    // Update the user's Cal.com username in the database
    await prisma.user.update({
      where: { email },
      data: { calcomUsername: username },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating Cal.com profile or updating database:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
