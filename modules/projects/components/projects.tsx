import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import ProjectCard from "./project-card";
import Image from "next/image";

export default async function Projects({
  clientId,
  limit,
}: {
  clientId: string;
  limit?: number;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      clientId,
      client: {
        users: {
          some: {
            userId: session.user.id,
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
      interviewid: true,
    },
    orderBy: {
      name: "asc",
    },
    ...(limit ? { take: limit } : {}),
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
