import { NextRequest, NextResponse } from "next/server";
import { Resume_Extract_Prompt } from "@/utils/Resume_Extract_Prompt";
import { Resume_Extract_Schema } from "@/utils/Resume_Extract_Schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEYY,
});
  
export async function POST(request: NextRequest) {
    try {

    const { RecruiterPrompt, ResumeText, JobDescription } = await request.json(); 

    const schemaPrompt = `
      Parse the following resume into structured JSON format adhering to the schema below. 
      Ensure the output matches the schema and captures all relevant details.

      Schema:
      ${JSON.stringify(Resume_Extract_Schema, null, 2)}

      Resume Text:
      ${ResumeText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Parse the resume and return structured JSON.",
        },
        { role: "user", content: schemaPrompt },
      ],
      temperature: 0,
    });

    return NextResponse.json(response.choices[0].message?.content);

    } catch (error) {
    console.error("Error in transforming resume:", error);
    return NextResponse.json(
      { error: "Failed to process the ATS scores." },
      { status: 500 }
    );
  }
}