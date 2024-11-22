import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";
import SiteSettingsNav from "@/modules/sites/components/nav";

export default async function ClientAnalyticsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch the client's data based on the authenticated user's association
  const data = await prisma.client.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id, // Match the user's ID in the related ClientUser model
        },
      },
    },
    select: {
      id: true,
      name: true,
      state: true,
      projects: true, // Include projects if needed
      users: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Find the specific client associated with the user
  const clientUser = data.find((client) =>
    client.users.some((u) => u.userId === session.user.id)
  );

  if (!data || !clientUser) {
    notFound();
  }

  const url = `Hello`;

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Settings for {clientUser.name}
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://url.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
      {children}
    </>
  );
}
