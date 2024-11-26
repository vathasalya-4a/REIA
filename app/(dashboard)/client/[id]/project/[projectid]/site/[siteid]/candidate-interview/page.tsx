"use client";

import React, { useState, useEffect } from "react";
import InterviewLinkButton from "@/modules/candidate-interview/components/InterviewLinkButton";
import { fetchCandidateEmail } from "@/modules/candidate-interview/actions";
import InterviewDetails from "@/modules/candidate-interview/components/InterviewDetails";
import LoadingDots from "@/components/icons/loading-dots";

interface CandidateInterviewProps {
    params: { projectid: string; siteid: string };
}

export default function CandidateInterview({ params }: CandidateInterviewProps) {
    const { projectid } = params;
    const { siteid } = params;
    const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
    const [candidateEmail, setCandidateEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Primary loading for initial data
    const [interviewLoading, setInterviewLoading] = useState<boolean>(false); // Secondary loading for interview check
    const [interviewdetails, setinterviewdetails] = useState<any | null>(null);
    const [candidateinterview, setcandidateinterview] = useState<boolean | null>(null);

    useEffect(() => {
        const getCandidateEmail = async () => {
            setLoading(true);
            try {
                const email = await fetchCandidateEmail(siteid);
                setCandidateEmail(email);
                await fetchInterviewDetails(email); // Ensure fetchInterviewDetails completes before setting loading to false
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
            setcandidateinterview(false);
            return;
        }
        if (!API_TOKEN) {
            console.error("API token is missing.");
            setcandidateinterview(false);
            return;
        }
        setInterviewLoading(true); // Start interview-specific loading
        try {
            const response = await fetch(
                `https://recrooai.com/api/ext/get/candidate/${email}`,
                {
                    headers: { authorization: API_TOKEN },
                }
            );
            if (response.ok) {
                const interviewDetails = await response.json();
                if (interviewDetails.data) {
                    setcandidateinterview(true);
                    setinterviewdetails(interviewDetails.data);
                } else {
                    setcandidateinterview(false);
                }
            } else {
                console.error("Failed to fetch interview details.");
                setcandidateinterview(false);
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
            setcandidateinterview(false);
        } finally {
            setInterviewLoading(false);
        }
    };

    return (
        <div
            className={`p-6 ${
                loading || interviewLoading || candidateinterview === null
                    ? "overflow-y-auto"
                    : "overflow-hidden"
            }`}
        >
            {loading || interviewLoading ? (
                <div className="flex justify-center items-center mt-16">
                    <LoadingDots />
                </div>
            ) : !candidateinterview ? (
                <div className="mt-16 justify-center mx-auto w-5/6 p-16 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
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
            ) : (
                <InterviewDetails details={interviewdetails} />
            )}
        </div>
    );
}
