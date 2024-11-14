// app/(auth)/layout.tsx

import { getSession } from "@/lib/auth"; // Import getSession function
import { Metadata } from "next";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | REIA",
};

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Retrieve the session
  const session = await getSession();

  // If the user is authenticated, redirect them to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Render the authentication layout for unauthenticated users
  return (
    <div className="flex min-h-screen flex-col justify-center sm:px-1 lg:px-1">
      {children}
    </div>
  );
}
