import { prisma } from "@/prisma";

export default async function UserCalendarPage({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { calcomUsername: true },
  });

  if (!user || !user.calcomUsername) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">
          This user does not have a linked Cal.com profile.
        </p>
      </div>
    );
  }

  const calcomUrl = `https://cal.com/${user.calcomUsername}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User's Calendar</h1>
      <iframe
        src={calcomUrl}
        style={{ width: "100%", height: "800px", border: "none" }}
        title="User's Cal.com Calendar"
      />
    </div>
  );
}
