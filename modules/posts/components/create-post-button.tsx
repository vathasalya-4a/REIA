"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";

export default function CreatePostButton({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/site/${candidateId}/checkats`);
  };

  return (
    <button 
              disabled = {isLoading}
              onClick={handleClick}
              className={`${ isLoading ? "cursor-not-allowed bg-gray-600" : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
              } flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800`}
              >
              {isLoading ? 
                (
                  <div className="flex items-center">
                    <LoadingDots color="#A8A29E" /> 
                  </div>
                ) : 
                (
                  <div className="flex items-center">
                    <p className="ml-2 text-sm font-medium">Upload Resume</p>
                  </div>
              )}
            </button>
  );
}


