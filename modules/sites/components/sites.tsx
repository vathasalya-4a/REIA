import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import SiteCard from "./site-card";

export default async function Sites({
  projectId,
  clientId,
  limit,
}: {
  projectId: string;
  clientId: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch candidates associated with the given projectId
  const candidates = await prisma.candidate.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      linkedinURL: true,
      location: true,
      workauthorization: true,
      salaryexpectations: true,
      availablehours: true,
      documentsS3URL: true,
      createdAt: true,
      image: true,
      imageBlurhash: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}), // Apply limit if provided
  });

  return candidates.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {candidates.map((candidate) => (
        <SiteCard key={candidate.id} data={candidate} clientId={clientId} projectId={projectId} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Candidates Yet</h1>
      <p className="text-lg text-stone-500">
        This project does not have any candidates yet. Create one to get started.
      </p>
    </div>
  );
}
