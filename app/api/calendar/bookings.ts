import { NextResponse } from "next/server";
import axios from "axios";

const CAL_API_TOKEN = process.env.CAL_API_TOKEN;
const CAL_API_BASE_URL = "https://api.cal.com/v1";

export async function POST(req: Request) {
  const body = await req.json();
  const { slotId, email } = body;

  if (!slotId || !email) {
    return NextResponse.json({ error: "Slot ID and email are required" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${CAL_API_BASE_URL}/bookings`,
      { slotId, email },
      {
        headers: { Authorization: `Bearer ${CAL_API_TOKEN}` },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error creating booking:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
