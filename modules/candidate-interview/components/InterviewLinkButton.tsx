"use client";

import React from "react";
import { fetchInterviewDetails } from "../actions";

interface ButtonProps {
    projectId: string;
    candidateId: string;
}

export default function InterviewLinkButton({ projectId, candidateId }: ButtonProps) {
    const handleClick = async () => {
        try {
            const { interviewId, email } = await fetchInterviewDetails(projectId, candidateId);

            if (interviewId && email) {
                // Simulate sending the interview link to the email
                alert(`Interview Link Sent! Interview ID: ${interviewId}, Email: ${email}`);
            } else {
                alert("Failed to fetch the interview details.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while sending the interview link.");
        }
    };

    return (
        <button
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            onClick={handleClick}
        >
            Send Interview Link
        </button>
    );
}
