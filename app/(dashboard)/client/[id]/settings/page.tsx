// app/client/[id]/settings/page.tsx
import prisma from "@/prisma";
import SettingsLayout from "./layout";

export default async function SettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.client.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!data) {
    return <div>Client not found</div>;
  }

  return (
    <SettingsLayout>
      <h1 className="text-2xl font-bold mb-6">Settings for {data.name}</h1>
    </SettingsLayout>
  );
}