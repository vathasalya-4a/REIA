"use client";

import React from "react";
import InterviewLinkButton from "@/modules/candidate-interview/components/InterviewLinkButton";

interface CandidateInterviewProps {
    params: { projectid: string, siteid: string };
}

export default function CandidateInterview({ params }: CandidateInterviewProps) {
    const { projectid } = params;
    const { siteid } = params;

    return (
        <div className="overflow-y-auto resize-none custom-scrollbar p-6">
            <div className="mt-16 mx-auto w-5/6 p-10 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
                <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                    Candidate has not appeared <br /> for the interview yet.
                </h1>
                <p className="mt-3 text-center text-gray-700 dark:text-gray-300">
                    Click the button below to send the Interview Link to the <br />
                    Candidate so that they can appear for the interview.
                </p>
                <div className="flex justify-center mt-6">
                    <InterviewLinkButton projectId={projectid} candidateId={siteid} />
                </div>
            </div>
        </div>
    );
}
