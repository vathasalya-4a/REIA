"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModifyResume() {
  const searchParams = useSearchParams(); // Get query parameters
  const candidateId = searchParams.get("candidateId");
  const resumeId = searchParams.get("resumeId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // You can now use candidateId and resumeId for fetching data if needed
  useEffect(() => {
    if (candidateId && resumeId) {
      // Optionally, fetch resume data based on the candidateId and resumeId if needed
      setLoading(true);
      setTimeout(() => {
        setLoading(false); // Just simulating a loading process
      }, 1000);
    }
  }, [candidateId, resumeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar p-6">
      <h1 className="mt-3 text-center font-cal text-3xl text-black-200">
        Upload Resume and Job Description
      </h1>
      {candidateId && resumeId && (
        <p className="text-center mt-4 text-gray-700">
          Editing resume with Candidate ID: {candidateId} and Resume ID: {resumeId}
        </p>
      )}
    </div>
  );
}
