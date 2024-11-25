// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePageRedirect() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Handle loading state, e.g., show a loading spinner
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    // User is authenticated, redirect to the dashboard page
    redirect("/dashboard");
  }

  // User is not authenticated, redirect to the marketing page
  redirect("/marketing");
}