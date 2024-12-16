"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";

export default function AIInterview() {
    const [jobTitle, setJobTitle] = useState("");
    const [questions, setQuestions] = useState("");
    const [currentInterviewId, setCurrentInterviewId] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
    const params = useParams();
    const projectId = params.projectid;

    useEffect(() => {
        const fetchProjectInterviewId = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/project-interview?projectId=${projectId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.interviewid) {
                        setCurrentInterviewId(data.interviewid);
                        await fetchInterviewId(data.interviewid);
                    }
                } else {
                    console.error("Failed to fetch interview ID.");
                }
            } catch (error) {
                console.error("Error fetching project interview ID:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectInterviewId();
    }, [projectId]);

    const fetchInterviewId = async (interviewId) => {
        if (!API_TOKEN) {
            console.error("API token is missing.");
            return;
        }
        try {
            const response = await fetch(
                `https://recrooai.com/api/ext/get/interview/${interviewId}`,
                {
                    headers: { authorization: API_TOKEN },
                }
            );
            if (response.ok) {
                const interview = await response.json();
                console.log(interview)
                setJobTitle(interview.data.jobTitle || "");
                setQuestions(interview.data.aiPrompt || "");
            } else {
                console.error("Failed to fetch interview details.");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    const saveInterview = async () => {
        const formData = new FormData();
        formData.append("jobTitle", jobTitle);
        formData.append("aiPrompt", questions);

        try {
            const url = currentInterviewId
                ? `https://recrooai.com/api/ext/put/interview/${currentInterviewId}`
                : "https://recrooai.com/api/ext/post/interview";

            const method = currentInterviewId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { authorization: API_TOKEN },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                const interviewId = result.data.id;
                setCurrentInterviewId(interviewId);
                await saveProjectInterviewId(interviewId);

                setJobTitle(result.jobTitle || jobTitle);
                setQuestions(result.aiPrompt || questions);
            } else {
                console.error("Error:", result.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error saving interview:", error);
        }
    };

    const saveProjectInterviewId = async (interviewId) => {
        try {
            const response = await fetch(`/api/project-interview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, interviewid: interviewId }),
            });

            if (!response.ok) {
                throw new Error("Error saving project interview ID.");
            }
        } catch (error) {
            console.error("Error saving project interview ID:", error);
        }
    };

    return (
        <div className="overflow-y-auto resize-none custom-scrollbar p-6 relative">
            {loading ? (
                <div className="flex justify-center items-center mt-8">
                    <LoadingDots />
                </div>
            ) : (
             <div>
                 <h1 className="mt-3 text-center font-cal text-3xl text-black-200">
                Schedule an Interview
            </h1>
                <div className="mt-8 mx-auto w-5/6 p-8">
                    <textarea
                        className={`w-full mb-4 p-4 text-2xl font-bold rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white ${
                            jobTitle ? "text-black" : "text-gray-400"
                        }`}
                        style={{ minHeight: "80px" }}
                        placeholder="Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="w-full p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white"
                        style={{ minHeight: "200px", lineHeight: "1.5" }}
                        placeholder="You may leave this field blank, and the AI will generate interview questions based on the Job Title provided. Alternatively, you can briefly describe how the AI should conduct the interview for this role. For example: 1) Focus on Core Java technical questions tailored to a Senior Developer role. Keep the questions concise and the interview duration short. 2) Conduct the interview using the following job description: [Paste your Job Description here]."
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={saveInterview}
                            className="px-4 py-2 bg-black text-white rounded-lg"
                        >
                            {currentInterviewId ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );    
}
