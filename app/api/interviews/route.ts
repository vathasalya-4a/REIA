import { NextResponse } from "next/server";
import prisma from "@/prisma"; // Using your existing Prisma instance

// GET: Fetch all interviews
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    const interviews = await prisma.interview.findMany({
      where: projectId ? { projectId } : {},
      include: { project: true },
    });

    return NextResponse.json(interviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json({ error: "Failed to fetch interviews." }, { status: 500 });
  }
}

// POST: Create a new interview
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, questions, projectId } = body;

    if (!title || !questions || !projectId) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const newInterview = await prisma.interview.create({
      data: {
        title,
        questions,
        projectId,
      },
    });

    return NextResponse.json(newInterview, { status: 201 });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json({ error: "Failed to create interview." }, { status: 500 });
  }
}

// PUT: Update an interview
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, questions } = body;

    if (!id || !title || !questions) {
      return NextResponse.json({ error: "ID, title, and questions are required." }, { status: 400 });
    }

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        title,
        questions,
      },
    });

    return NextResponse.json(updatedInterview, { status: 200 });
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json({ error: "Failed to update interview." }, { status: 500 });
  }
}

// DELETE: Delete an interview
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    await prisma.interview.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Interview deleted successfully." }, { status: 204 });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json({ error: "Failed to delete interview." }, { status: 500 });
  }
}
