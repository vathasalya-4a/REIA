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
export const updateProject = async (id: string, data: any): Promise<UpdateProjectResponse> => {
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
    const updatedProject = await prisma.project.update({
      where: { id },
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
      },
    });

    revalidateTag(`/projects/${id}`); // Revalidate cache for updated project
    return updatedProject; // Return the updated project if successful
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message }; // Return the error message if something goes wrong
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

