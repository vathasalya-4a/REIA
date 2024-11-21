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
