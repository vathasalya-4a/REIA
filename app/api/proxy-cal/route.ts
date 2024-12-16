import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url, method, headers, body } = await request.json();

  try {
    // If the Authorization header is not provided, fallback to CAL_API_KEY
    const authorizationHeader =
      headers?.Authorization || `Bearer ${process.env.CAL_API_KEY}`;

    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        Authorization: authorizationHeader, // Use the provided Authorization or CAL_API_KEY
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 500 });
  }
}
