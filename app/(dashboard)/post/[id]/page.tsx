import { getSession } from "@/lib/auth";
import Editor from "@/modules/posts/components/editor";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

interface Params {
  id: string;
}

// Ensure params is not a Promise type
export default async function PostPage({ params }: { params: Params }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const data = await prisma.post.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      updatedByUser: true,
      user: true,
      site: {
        include: {
          users: { include: { user: true } },
        },
      },
    },
  });

  if (
    !data ||
    !data?.site?.users
      ?.map((siteUser) => siteUser?.user.id)
      ?.includes(session.user.id)
  ) {
    notFound();
  }

  return <Editor post={data} />;
}
