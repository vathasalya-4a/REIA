import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CreatePostButton from "@/modules/posts/components/create-post-button";
import Posts from "@/modules/posts/components/posts";
import prisma from "@/prisma";

export default async function SitePosts({
  params,
}: {
  params: { id?: string; projectid?: string; siteid?: string }
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id, projectid, siteid } = params;
  if (!id || !projectid || !siteid) {
    notFound();
  }

  const candidateId = parseInt(siteid, 10);
  if (isNaN(candidateId)) {
    notFound();
  }

  const data = await prisma.candidate.findUnique({
    where: { id: candidateId },
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
      project: {
        select: {
          id: true,
        },
      },
    },
  });

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
        {/* Pass all required props */}
        <CreatePostButton
          clientId={id}
          projectId={projectid}
          candidateId={siteid}
        />
      </div>
      {/* Pass all required props */}
      <Posts clientId={id} projectId={projectid} candidateId={siteid} />
    </>
  );
}
