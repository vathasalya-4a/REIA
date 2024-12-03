import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Client as PlivoClient } from "plivo";

const prisma = new PrismaClient();
const plivoClient = new PlivoClient(
    process.env.PLIVO_AUTH_ID || "",
    process.env.PLIVO_AUTH_TOKEN || ""
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { candidateId, message, communicationType } = body;

        // Validate required fields
        if (!candidateId || !communicationType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const candidate = await prisma.candidate.findUnique({
            where: { id: parseInt(candidateId, 10) },
            select: { phone: true },
        });

        if (!candidate) {
            return NextResponse.json(
                { error: "Candidate not found" },
                { status: 404 }
            );
        }

        const candidatePhone = candidate.phone;

        if (communicationType === "Text Message") {
            if (!message) {
                return NextResponse.json(
                    { error: "Message content is required for text messages" },
                    { status: 400 }
                );
            }

            const response = await fetch("https://api.httpsms.com/v1/messages/send", {
                method: "POST",
                headers: {
                    "x-api-key": process.env.HTTPSMS_API_KEY || "",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: message,
                    from: "+15138355803",
                    to: candidatePhone,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Failed to send SMS");
            }

            return NextResponse.json(
                { message: "Message sent successfully" },
                { status: 200 }
            );
        } else if (communicationType === "Call") {
            const answerUrl = "https://callxml.s3.us-east-2.amazonaws.com/callurl.xml";
        
            console.log("Generated answer_url:", answerUrl);
        
            const callResponse = await plivoClient.calls.create(
                "+19179148741",
                "5138355803", 
                answerUrl,
                {
                    answer_method: "GET",
                }
            );
        
            if (callResponse.apiId) {
                return NextResponse.json(
                    { callStatus: "Call initiated successfully" },
                    { status: 200 }
                );
            } else {
                throw new Error("Failed to initiate call");
            }
        }
         else {
            return NextResponse.json(
                { error: "Invalid communication type" },
                { status: 400 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to process request", details: error.message },
            { status: 500 }
        );
    }
}
