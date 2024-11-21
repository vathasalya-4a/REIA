import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import SiteCard from "./site-card";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const candidates = await prisma.candidate.findMany({
    where: {
      userId: session.user.id, // Updated to match the `userId` foreign key
    },
    select: {
      id: true,
      name: true,
      image: true,
      imageBlurhash: true,
      createdAt: true,
      userId: true
    },
    orderBy: {
      createdAt: "asc",
    },
    ...(limit ? { take: limit } : {}),
  });

  return candidates.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {candidates.map((candidate) => (
        <SiteCard key={candidate.id} data={candidate} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Candidates Yet</h1>
      <p className="text-lg text-stone-500">
        You do not have any Candidates yet. Create one to get started.
      </p>
    </div>
  );
}