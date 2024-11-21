// app/(dashboard)/site/[id]/page.tsx

import { getSession } from "@/lib/auth";
import { AcceptInviteModal } from "@/modules/people/components/accept-invite-modal";
import CreatePostButton from "@/modules/posts/components/create-post-button";
import Posts from "@/modules/posts/components/posts";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch candidate data
  const data = await prisma.candidate.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      id: true,
      name: true,
      image: true,
      imageBlurhash: true,
      createdAt: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  // Handle case if candidate not found
  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            All Resumes for {data.name}
          </h1>
        </div>
        <CreatePostButton candidateId={params.id}/>
      </div>
      <Posts candidateId={params.id} />
    </>
  );
}
