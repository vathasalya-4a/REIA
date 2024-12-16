"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { Site } from "@prisma/client";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { getBlurDataURL, nanoid } from "@/lib/utils";
import { put } from "@vercel/blob";
import prisma from "@/prisma";
import { withSiteAuth } from "./auth";

export const createSite = async (formData: FormData, projectId: string) => {
  // Extract fields from formData
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const linkedinURL = formData.get("linkedinURL") as string;
  const location = formData.get("location") as string;
  const workauthorization = formData.get("workauthorization") as string;
  const salaryexpectations = parseInt(formData.get("salaryexpectations") as string, 10) || null;
  const availablehours = parseInt(formData.get("availablehours") as string, 10) || null;
  const documentsS3URL = formData.get("documentsS3URL") as string;
  const image = formData.get("image") as string || undefined; // Optional
  const imageBlurhash = formData.get("imageBlurhash") as string || undefined; // Optional

  try {
    // Create a new candidate using Prisma
    const response = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        linkedinURL,
        location,
        workauthorization,
        salaryexpectations,
        availablehours,
        documentsS3URL,
        image,
        imageBlurhash,
        project: {
          connect: {
            id: projectId, // Connect candidate to the project
          },
        },
      },
    });

    return response; // Return the created candidate object
  } catch (error: any) {
    console.error("Error creating candidate:", error.message);
    return {
      error: error.message,
    };
  }
};

export const updateCandidate = async (id: number, data: any) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" };
  }

  try {
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...data, // Spread the data to dynamically update fields
      },
    });

    revalidateTag(`/site/${id}`); // Revalidate cache for updated candidate
    return updatedCandidate;
  } catch (error: any) {
    console.error("Error updating candidate:", error.message);
    return { error: error.message };
  }
};




export const deleteCandidate = async (id: number) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" };
  }

  try {
    const deletedCandidate = await prisma.candidate.delete({
      where: { id },
    });

    revalidateTag(`/site/${id}`); // Revalidate cache for deleted candidate
    return deletedCandidate;
  } catch (error: any) {
    console.error("Error deleting candidate:", error.message);
    return { error: error.message };
  }
};

