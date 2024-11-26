import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import ResumeTable from "./ResumeTable";

export default async function Posts({
  clientId,
  projectId,
  candidateId,
  limit,
}: {
  clientId?: string;
  projectId?: string;
  candidateId?: string | number;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const candidateIdInt = typeof candidateId === "string" ? parseInt(candidateId, 10) : candidateId;

  if (!candidateIdInt || isNaN(candidateIdInt)) {
    throw new Error("Invalid candidate ID provided. Expected an integer.");
  }

  // Query the candidate with the correct integer ID
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateIdInt }, // Pass the integer value here
    include: {
      resumes: true,
      atsScores: true,
    },
  });

  // Handle the case where the candidate is not found
  if (!candidate) {
    return (
      <div className="flex flex-col items-center space-x-4">
        <h1 className="font-cal text-4xl">Candidate Not Found</h1>
        <Image
          alt="missing candidate"
          src="https://illustrations.popsy.co/gray/graphic-design.svg"
          width={400}
          height={400}
        />
        <p className="text-lg text-stone-500">
          No data found for the specified candidate ID.
        </p>
      </div>
    );
  }

  // Serialize the candidate data
  const candidateSerialized = {
    ...candidate,
    name: candidate.name, // Optionally modify the candidate's name
    resumes: candidate.resumes.map((resume) => ({
      ...resume,
      uploadedAt: resume.uploadedAt.toISOString(),
    })),
    scores: candidate.atsScores.map((score) => ({
      ...score,
      createdAt: score.createdAt.toISOString(),
    })),
  };

  return candidateSerialized.resumes.length > 0 ? (
    <ResumeTable
    candidate={candidateSerialized}
    clientId={clientId}
    projectId={projectId}
    candidateId={candidateIdInt}
  />
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Resumes Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any Resumes uploaded yet. Upload one to get started.
      </p>
    </div>
  );
}
