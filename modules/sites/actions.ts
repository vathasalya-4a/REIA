"use server";

import prisma from "@/prisma";
import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export const createSite = async (formData: FormData, projectId: string) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const linkedinURL = formData.get("linkedinURL") as string;
  const location = formData.get("location") as string;
  const workauthorization = formData.get("workauthorization") as string;
  const salaryexpectations = parseInt(formData.get("salaryexpectations") as string, 10) || null;
  const availablehours = parseInt(formData.get("availablehours") as string, 10) || null;
  const documentsS3URL = formData.get("documentsS3URL") as string;
  const image = formData.get("image") as string || undefined;
  const imageBlurhash = formData.get("imageBlurhash") as string || undefined;

  try {
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
            id: projectId,
          },
        },
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error creating candidate:", error.message);
    return {
      error: error.message,
    };
  }
};

export const updateCandidate = async (id: number, formData: FormData) => {
  try {
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data,
    });

    return { data: updatedCandidate };
  } catch (error: any) {
    console.error("Error updating candidate:", error.message);
    return { error: error.message };
  }
};

export const deleteCandidate = async (
  id: number,
  data: any,
  action: string
): Promise<{ success?: boolean; error?: string }> => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" }; // Return an error if the user is not authenticated
  }

  try {
    if (action === "delete") {
      await prisma.candidate.delete({
        where: { id },
      });

      revalidateTag(`/candidates`); // Revalidate cache for the candidates list
      return { success: true }; // Return success response
    }

    return { error: "Invalid action" }; // Handle invalid action
  } catch (error: any) {
    console.error("Error deleting candidate:", error.message);
    return { error: error.message }; // Return the error message if something goes wrong
  }
};

