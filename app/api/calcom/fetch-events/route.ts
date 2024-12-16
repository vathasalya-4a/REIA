import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken, action, eventData } = await request.json();

  if (action === "create") {
    const response = await fetch("https://api.cal.com/v2/event-types", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to create event" }, { status: response.status });
    }

    const event = await response.json();
    return NextResponse.json(event);
  } else if (action === "fetch") {
    const response = await fetch("https://api.cal.com/v2/event-types", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "cal-api-version": "2024-06-14",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: response.status });
    }

    const events = await response.json();
    return NextResponse.json(events.data);
  }
}
