import PlaceholderCard from "@/components/ui/placeholder-card";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import Projects from "@/modules/projects/components/projects";
import CreateProjectButton from "@/modules/projects/components/create-project-button";
import CreateProjectModal from "@/modules/projects/components/create-project-modal";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

export default async function ClientProjects({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch client data
  const data = await prisma.client.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      state: true,
      users: {
        select: {
          id: true, // Fetch user IDs associated with the client
        },
      },
    },
  });

  // Handle case if client not found
  if (!data) {
    notFound();
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All projects for {data.name}
          </h1>
          <CreateProjectButton>
            <CreateProjectModal clientId={params.id} />
          </CreateProjectButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Projects clientId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
