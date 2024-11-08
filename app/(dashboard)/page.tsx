"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Overview() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the sites page
    router.push("/sites");
  }, [router]);

  return null; // Render nothing since we're redirecting
}
