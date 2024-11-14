// app/(dashboard)/layout.tsx

import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { getSession } from "@/lib/auth"; // Import getSession function
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Retrieve the session
  const session = await getSession();

  // If there's no session, redirect to the login page
  if (!session) {
    redirect("/login");
  }

  // Render the dashboard layout for authenticated users
  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}
