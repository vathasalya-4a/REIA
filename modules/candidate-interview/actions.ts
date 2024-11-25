"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchInterviewDetails(projectId: string, candidateId: string): Promise<{ interviewId: string | null; email: string | null }> {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { interviewid: true },
        });

        if (!project || !project.interviewid) {
            console.error(`No interviewId found for projectId: ${projectId}`);
        }

        const candidate = await prisma.candidate.findUnique({
            where: { id: parseInt(candidateId) },
            select: { email: true },
        });

        if (!candidate || !candidate.email) {
            console.error(`No email found for candidateId: ${candidateId}`);
        }

        return {
            interviewId: project?.interviewid || null,
            email: candidate?.email || null,
        };
    } catch (error) {
        console.error(`Error fetching interview details for projectId: ${projectId} and candidateId: ${candidateId}`, error);
        return { interviewId: null, email: null };
    }
}
