"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";

export default function HomePageRedirect() {
  const { data: session, status } = useSession();
  console.log(status);

  if (status === "loading") {
    return <LoadingSpinner />;
  }
  if (status === "authenticated") {
    redirect("/clients");
  }
  redirect("/marketing");
}
