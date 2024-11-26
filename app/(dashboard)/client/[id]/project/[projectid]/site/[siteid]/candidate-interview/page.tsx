"use client";

import React, { useState, useEffect } from "react";
import InterviewLinkButton from "@/modules/candidate-interview/components/InterviewLinkButton";
import { fetchCandidateEmail } from "@/modules/candidate-interview/actions";
import JobDescription from "@/modules/checkats/components/JobDescription";
import InterviewDetails from "@/modules/candidate-interview/components/InterviewDetails";

interface CandidateInterviewProps {
    params: { projectid: string; siteid: string };
}

export default function CandidateInterview({ params }: CandidateInterviewProps) {
    const { projectid } = params;
    const { siteid } = params;
    const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
    const [candidateEmail, setCandidateEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [interviewId, setInterviewId] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState<string>("");
    const [candidateinterview, setcandidateinterview] = useState<boolean>(false);
    const [interviewdetails, setinterviewdetails] = useState<any | null>(null);
    console.log(candidateinterview);

    useEffect(() => {
        const getCandidateEmail = async () => {
            setLoading(true);
            try {
                const email = await fetchCandidateEmail(siteid);
                setCandidateEmail(email);
                fetchInterviewDetails(email);
            } catch (error) {
                console.error("Error fetching candidate email:", error);
            } finally {
                setLoading(false);
            }
        };

        getCandidateEmail();
    }, [siteid]);

    const fetchInterviewDetails = async (email: string) => {
        if (!email) {
            console.error("Email is not fetched correctly.");
            return;
        }
        if (!API_TOKEN) {
            console.error("API token is missing.");
            return;
        }

        try {
            const response = await fetch(
                `https://recrooai.com/api/ext/get/candidate/${email}`,
                {
                    headers: { authorization: API_TOKEN },
                }
            );
            if (response.ok) {
                const interviewDetails = await response.json();
                setcandidateinterview(true);
                setinterviewdetails(interviewDetails.data);
                console.log(interviewDetails);
            } else {
                console.error("Failed to fetch interview details.");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div className="overflow-y-auto resize-none custom-scrollbar p-6">

            {candidateinterview ? (
                    <InterviewDetails details={interviewdetails} />
            ) : (
                <div className="mt-16 mx-auto w-5/6 p-10 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
                    <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                        Candidate has not appeared <br /> for the interview yet.
                    </h1>
                    <p className="mt-3 text-center text-gray-700 dark:text-gray-300">
                        Click the button below to send the Interview Link to the <br />
                        Candidate so that they can appear for the interview.
                    </p>

                    {loading ? (
                        <p className="text-center text-gray-700 dark:text-gray-300">
                            Loading candidate email...
                        </p>
                    ) : candidateEmail ? (
                        <p className="text-center text-gray-700 dark:text-gray-300">
                            Candidate's Email: {candidateEmail}
                        </p>
                    ) : (
                        <p className="text-center text-gray-700 dark:text-gray-300">
                            Failed to load candidate email.
                        </p>
                    )}

                    <div className="flex justify-center mt-6">
                        <InterviewLinkButton projectId={projectid} candidateId={siteid} />
                    </div>
                </div>
            )}
        </div>
    );
}
