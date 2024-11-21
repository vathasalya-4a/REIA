import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import ClientCard from "./client-card";  // Change from SiteCard to ClientCard

export default async function Clients({ limit }: { limit?: number }) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // Update query to fetch clients instead of candidates
  const clients = await prisma.client.findMany({
    where: {
      userId: session.user.id, // Matches the `userId` foreign key
    },
    select: {
      id: true,
      name: true,
      state: true,  // Include state field from the `Client` model
      userId: true,
      projects: true,  // Assuming you want to display related projects
    },
    orderBy: {
      name: "asc",  // You can order by another field if needed
    },
    ...(limit ? { take: limit } : {}),
  });

  return clients.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {clients.map((client) => (
        <ClientCard key={client.id} data={client} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Clients Yet</h1>  {/* Updated message */}
      <p className="text-lg text-stone-500">
        You do not have any Clients yet. Create one to get started.
      </p>
    </div>
  );
}
