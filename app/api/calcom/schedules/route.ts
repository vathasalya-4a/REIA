import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orgId, userId, name, availability, timeZone } = await request.json();

  try {
    const createScheduleResponse = await fetch(
      `https://api.cal.com/v2/organizations/${orgId}/users/${userId}/schedules`,
      {
        method: "POST",
        headers: {
          "x-cal-secret-key": process.env.NEXT_PUBLIC_CAL_SECRET_KEY!,
          "x-cal-client-id": process.env.NEXT_PUBLIC_CAL_CLIENT_ID!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          availability,
          timeZone,
        }),
      }
    );

    if (!createScheduleResponse.ok) {
      const errorData = await createScheduleResponse.json();
      console.error("Failed to create schedule in Cal.com:", errorData);
      return NextResponse.json(
        { error: "Failed to create schedule", details: errorData },
        { status: createScheduleResponse.status }
      );
    }

    const scheduleData = await createScheduleResponse.json();
    return NextResponse.json({ message: "Schedule created successfully", schedule: scheduleData });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Error creating schedule", details: error.message },
      { status: 500 }
    );
  }
}
