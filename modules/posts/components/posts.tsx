import { getSession } from "@/lib/auth";
import prisma from "@/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import PostCard from "./post-card";

export default async function Posts({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const posts = await prisma.post.findMany({
    where: {
      siteId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: true,
      site: {
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    ...(limit ? { take: limit } : {}),
  });

  return posts.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Resumes Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any Resumes uploaded yet. Upload one to get started.
      </p>
    </div>
  );
}
