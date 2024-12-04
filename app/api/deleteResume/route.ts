import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const { resumeId } = await request.json();
    await prisma.resume.delete({
      where: { id: resumeId },
    });
 
    return NextResponse.json({ message: 'Resume and associated records deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}