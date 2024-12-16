"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchInterviewId(projectId: string): Promise<string | null> {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { interviewid: true },
        });

        if (!project || !project.interviewid) {
            console.error(`No interviewId found for projectId: ${projectId}`);
            return null;
        }

        return project.interviewid;
    } catch (error) {
        console.error(`Error fetching interviewId for projectId: ${projectId}`, error);
        return null;
    }
}

export async function fetchCandidateEmail(candidateId: string): Promise<string | null> {
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { id: parseInt(candidateId) },
            select: { email: true },
        });

        if (!candidate || !candidate.email) {
            console.error(`No email found for candidateId: ${candidateId}`);
            return null;
        }

        return candidate.email;
    } catch (error) {
        console.error(`Error fetching email for candidateId: ${candidateId}`, error);
        return null;
    }
}
