import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import ProjectCard from "./project-card";  // Import your ProjectCard component

export default async function Projects({
  clientId,   // Receive the clientId as a prop or from URL params
  limit,
}: {
  clientId: string;  // Pass the clientId as a prop
  limit?: number;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // Fetch projects for the logged-in user and a specific client
  const projects = await prisma.project.findMany({
    where: {
      clientId: clientId,  // Filter by the clientId
      client: {
        userId: session.user.id,  // Ensure the client belongs to the logged-in user
      },
    },
    select: {
      id: true,
      name: true,
      cutumfield: true,         // Include necessary fields
      positiontype: true,       // Include necessary fields
      jobdescription: true,     // Include necessary fields
      status: true,
      submitted: true,          // Include necessary fields
      submissionduedate: true, // Include necessary fields
      submitteddate: true,     // Include necessary fields
      startdate: true,
      enddate: true,
      clientId: true,  // Assuming you want to display related client info
    },
    orderBy: {
      name: "asc",  // You can change the order as needed
    },
    ...(limit ? { take: limit } : {}),
  });

  return projects.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} data={project} clientId={clientId}/>
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Projects Yet</h1>
      <p className="text-lg text-stone-500">
        You do not have any Projects for this client yet. Create one to get started.
      </p>
    </div>
  );
}
