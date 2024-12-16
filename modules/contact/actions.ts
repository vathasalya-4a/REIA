"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import prisma from "@/prisma";

export async function retrieveCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            select: { id: true, name: true },
        });
        return candidates;
    } catch (error) {
        console.error("Failed to fetch candidates:", error);
        throw new Error("Failed to fetch candidates");
    }
}

