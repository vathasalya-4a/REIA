import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Extract projectId from the query parameters
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Fetch the project with the specified projectId
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { interviewid: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ interviewid: project.interviewid }, { status: 200 });
  } catch (error) {
    console.error("Error fetching interviewid:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, interviewid } = body;

    if (!projectId || !interviewid) {
      return NextResponse.json(
        { error: "Project ID and Interview ID are required" },
        { status: 400 }
      );
    }
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { interviewid },
    });

    return NextResponse.json(
      { success: true, project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating interviewid:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
