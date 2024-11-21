import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import ClientCard from "./client-card";

export default async function Clients({ limit }: { limit?: number }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch clients through the ClientUser relationship
  const clients = await prisma.client.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id, // Ensure this matches the `userId` in ClientUser
        },
      },
    },
    select: {
      id: true,
      name: true,
      state: true,
      users: true,
      invites: true,
      projects: true, // Include related projects
    },
    orderBy: {
      name: "asc", // Order alphabetically
    },
    ...(limit ? { take: limit } : {}),
  });

  return (
    <>
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <ClientCard key={client.id} data={client} />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center space-x-4">
          <h1 className="font-cal text-4xl">No Clients Yet</h1>
          <p className="text-lg text-stone-500">
            You do not have any Clients yet. Create one to get started.
          </p>
        </div>
      )}
    </>
  );
}
