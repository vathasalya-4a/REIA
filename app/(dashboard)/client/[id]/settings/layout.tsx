import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";
import ClientSettingsNav from "@/modules/clients/components/nav";

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
  const data = await prisma.client.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      users: {
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });

  const clientUser = data.users.find((u) => u.userId === session.user.id);

  if (!data || !clientUser) {
    notFound();
  }

  //const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0 p-4">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Settings for {data.name}
        </h1>
        {/* <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a> */}
      </div>
      <ClientSettingsNav clientUser={clientUser} />
      {children}
    </>
  );
}