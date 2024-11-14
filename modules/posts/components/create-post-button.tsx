"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";

export default function CreatePostButton({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true); // Set loading to true when button is clicked
    router.push(`/site/${siteId}/checkats`);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      disabled={isLoading} // Disable button while loading
    >
      {isLoading ? <LoadingDots /> : "Upload Resume"}
    </button>
  );
}
