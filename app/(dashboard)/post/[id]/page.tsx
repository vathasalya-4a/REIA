import { getSession } from "@/lib/auth";
import Editor from "@/modules/posts/components/editor";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  return (
    <h1 className="text-4xl font-bold mb-6 text-center text-black-600">
        ATS Compatibility Checker 📑
      </h1>
  )
}
