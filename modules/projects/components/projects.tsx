import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import ProjectCard from "./project-card"; // Import your ProjectCard component
import Image from "next/image";

export default async function Projects({
  clientId, // Receive the clientId as a prop or from URL params
  limit,
}: {
  clientId: string; // Pass the clientId as a prop
  limit?: number;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch projects for the logged-in user and a specific client
  const projects = await prisma.project.findMany({
    where: {
      clientId, // Filter by the clientId
      client: {
        users: {
          some: {
            userId: session.user.id, // Ensure the client is associated with the logged-in user
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      cutumfield: true,
      positiontype: true,
      jobdescription: true,
      status: true,
      submitted: true,
      submissionduedate: true,
      submitteddate: true,
      startdate: true,
      enddate: true,
      clientId: true,
    },
    orderBy: {
      name: "asc", // Order alphabetically
    },
    ...(limit ? { take: limit } : {}), // Apply limit if provided
  });

  return projects.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} data={project} clientId={clientId} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-y-4">
      <h1 className="font-cal text-4xl">No Projects Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any Projects for this client yet. Create one to get started.
      </p>
    </div>
  );
}
