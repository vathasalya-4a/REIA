// import { NextResponse } from "next/server";
// import axios from "axios";

// const CAL_API_TOKEN = process.env.CAL_API_TOKEN;
// const CAL_API_BASE_URL = "https://api.cal.com/v1";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { slots } = body;

//   if (!slots || slots.length === 0) {
//     return NextResponse.json({ error: "No slots provided" }, { status: 400 });
//   }

//   try {
//     const response = await axios.post(
//       `${CAL_API_BASE_URL}/availability`,
//       { userId: "recruiter-id", slots },
//       {
//         headers: { Authorization: `Bearer ${CAL_API_TOKEN}` },
//       }
//     );

//     return NextResponse.json({ success: true, data: response.data });
//   } catch (error: any) {
//     console.error("Error creating availability:", error.response?.data || error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import axios from "axios";

const CAL_API_TOKEN = process.env.CAL_API_TOKEN;
const CAL_API_BASE_URL = "https://api.cal.com/v1";

export async function POST(req: Request) {
  const body = await req.json();
  const { blockedDates } = body;

  if (!blockedDates || blockedDates.length === 0) {
    return NextResponse.json({ error: "No dates provided" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${CAL_API_BASE_URL}/availability`,
      {
        userId: "recruiter-id", // Replace with the recruiter ID
        slots: blockedDates.map((date: string) => ({
          startTime: date, // Start of blocked slot
          endTime: date,   // End of blocked slot (same day for full-day block)
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${CAL_API_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error blocking dates:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
