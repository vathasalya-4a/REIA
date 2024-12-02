"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import prisma from "@/prisma";

// Define a return type that can either be a project or an error
type CreateProjectResponse = 
  | { error: string }
  | { id: string; name: string; cutumfield: string; positiontype: string; jobdescription: string; status: string; submitted: string; submissionduedate: Date | null; submitteddate: Date | null; startdate: Date | null; enddate: Date | null; clientId: string };

export const createProject = async (data: any, clientId: string): Promise<CreateProjectResponse> => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" }; // Return an error if the user is not authenticated
  }

  // Helper function to validate and convert date strings to Date objects
  const validateDate = (date: string) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        cutumfield: data.cutumfield,
        positiontype: data.positiontype,
        jobdescription: data.jobdescription,
        status: data.status,
        submitted: data.submitted,
        submissionduedate: data.submissionduedate ? validateDate(data.submissionduedate) : null, // Validate and convert date
        submitteddate: data.submitteddate ? validateDate(data.submitteddate) : null, // Validate and convert date
        startdate: data.startdate ? validateDate(data.startdate) : null, // Validate and convert date
        enddate: data.enddate ? validateDate(data.enddate) : null, // Validate and convert date
        client: {
          connect: { id: clientId },
        },
      },
    });

    return project; // Return the created project if successful
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message }; // Return the error message if something goes wrong
  }
};

// Define a return type for update and delete actions
type UpdateProjectResponse = 
  | { error: string }
  | { id: string; name: string; cutumfield: string; positiontype: string; jobdescription: string; status: string; submitted: string; submissionduedate: Date | null; submitteddate: Date | null; startdate: Date | null; enddate: Date | null; clientId: string };

type DeleteProjectResponse = 
  | { error: string }
  | { success: boolean };

// Function to update a project
export const updateProject = async (id: string, formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  // Helper function to validate and convert date strings to Date objects
  const validateDate = (date: string | undefined) => {
    if (!date) return undefined;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Extract fields from FormData
  const name = formData.get("name") as string | undefined;
  const cutumfield = formData.get("cutumfield") as string | undefined;
  const positiontype = formData.get("positiontype") as string | undefined;
  const jobdescription = formData.get("jobdescription") as string | undefined;
  const status = formData.get("status") as string | undefined;
  const submitted = formData.get("submitted") as string | undefined;
  const submissionduedate = validateDate(formData.get("submissionduedate") as string | undefined);
  const submitteddate = validateDate(formData.get("submitteddate") as string | undefined);
  const startdate = validateDate(formData.get("startdate") as string | undefined);
  const enddate = validateDate(formData.get("enddate") as string | undefined);

  try {
    const response = await prisma.project.update({
      where: {
        id,
      },
      data: {
        ...(name && { name }),
        ...(cutumfield && { cutumfield }),
        ...(positiontype && { positiontype }),
        ...(jobdescription && { jobdescription }),
        ...(status && { status }),
        ...(submitted && { submitted }),
        ...(submissionduedate && { submissionduedate }),
        ...(submitteddate && { submitteddate }),
        ...(startdate && { startdate }),
        ...(enddate && { enddate }),
      },
    });

    revalidateTag("project");
    return response;
  } catch (error: any) {
    console.error("Error updating project:", error.message);
    return {
      error: error.message,
    };
  }
};


// Function to delete a project
export const deleteProject = async (id: string, data: any, action: string): Promise<DeleteProjectResponse> => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" }; // Return an error if the user is not authenticated
  }

  try {
    if (action === "delete") {
      await prisma.project.delete({
        where: { id },
      });

      revalidateTag(`/projects`); // Revalidate cache for the projects list
      return { success: true }; // Return success response
    }

    return { error: "Invalid action" }; // Handle invalid action
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message }; // Return the error message if something goes wrong
  }
};

