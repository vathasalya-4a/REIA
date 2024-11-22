"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

export default function AIInterview() {
    const [jobTitle, setJobTitle] = useState("");
    const [questions, setQuestions] = useState("");
    const [interviews, setInterviews] = useState([]);
    const [currentInterviewId, setCurrentInterviewId] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [showMenu, setShowMenu] = useState(null); // Dropdown menu state
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const API_TOKEN = "4be2a387710457cc4e1625cb17c80e76354b0cd06f1aea7fd18112aca0c4bf04";
    const params = useParams();
    const projectId = params.projectid;

    const handleMenuClick = (event, interviewId) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({ x: rect.left, y: rect.bottom });
        setShowMenu(interviewId);
    };

    const createInterview = async () => {
        const formData = new FormData();
        formData.append("jobTitle", String(jobTitle));
        formData.append("aiPrompt", String(questions));
    
        console.log("Sending Request:", {
            jobTitle,
            aiPrompt: questions,
        });
    
        try {
            const response = await fetch("https://recrooai.com/api/ext/post/interview", {
                method: "POST",
                headers: {
                    "authorization": API_TOKEN,
                },
                body: formData,
            });
    
            console.log("Status Code:", response.status);
            console.log("Response Headers:", response.headers);
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error Response:", errorResponse);
            } else {
                const createdInterview = await response.json();
                console.log("Success Response:", createdInterview);
            }
        } catch (error) {
            console.error("Network Error:", error);
        }
    };    
   

    const updateInterview = async (interviewId) => {
        const formData = new FormData();
        formData.append("jobTitle", String(jobTitle)); 
        formData.append("aiPrompt", String(questions));

        try {
            const response = await fetch(
                `https://recrooai.com/api/ext/put/interview/${interviewId}`,
                {
                    method: "PUT",
                    headers: {
                        "authorization": API_TOKEN,
                    },
                    body: formData,
                }
            );

            const updatedInterview = await response.json();

            if (response.ok) {
                console.log("Interview Updated:", updatedInterview);
                setInterviews((prev) =>
                    prev.map((interview) =>
                        interview.id === interviewId
                            ? { ...interview, ...updatedInterview }
                            : interview
                    )
                );
            } else {
                console.error("Error:", updatedInterview.error);
            }
        } catch (error) {
            console.error("Error updating interview:", error);
        }
    };

    const handleSave = async () => {
        if (currentInterviewId) {
            await updateInterview(currentInterviewId);
        } else {
            await createInterview();
        }

        setJobTitle("");
        setQuestions("");
        setIsEditing(false);
        setCurrentInterviewId(null);
    };

    const handleEdit = (interview) => {
        setJobTitle(interview.jobTitle);
        setQuestions(interview.aiPrompt);
        setCurrentInterviewId(interview.id);
        setIsEditing(true);
    };

    return (
        <div className="overflow-y-auto resize-none custom-scrollbar p-6 relative">
            <h1 className="mt-3 text-center font-cal text-3xl text-black-200">
                {isEditing ? "" : "Interviews"}
            </h1>

            {/* If no interviews */}
            {!interviews.length && !isEditing && (
                <div className="mt-12 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white flex flex-col items-center justify-center">
                    <p className="mt-20 text-lg text-gray-500 text-center">
                        No Interviews Created Yet. Create One to get Started
                    </p>
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setJobTitle("");
                            setQuestions("");
                            setCurrentInterviewId(null);
                        }}
                        className="mt-4 px-6 py-3 bg-black text-white rounded-lg mb-20"
                    >
                        New Interview
                    </button>
                </div>
            )}

            {/* New Interview Button in top-right corner */}
            {!isEditing && interviews.length > 0 && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setJobTitle("");
                            setQuestions("");
                            setCurrentInterviewId(null);
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        New Interview
                    </button>
                </div>
            )}

            {/* Editing Form */}
            {isEditing && (
                <div className="mt-8 mx-auto w-5/6 p-8">
                    <textarea
                        className={`w-full mb-4 p-4 text-2xl font-bold rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none ${
                            jobTitle ? "text-black" : "text-gray-400"
                        }`}
                        style={{ minHeight: "80px" }}
                        placeholder="Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="w-full p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white overflow-y-auto resize-none placeholder-opacity-80 placeholder-gray-500"
                        style={{
                            minHeight: "200px",
                            lineHeight: "1.5",
                        }}
                        placeholder="AI prompt for the interview or leave blank for auto-generated questions."
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-black text-white rounded-lg"
                        >
                            {currentInterviewId ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            )}

            {/* List of Interviews */}
            {!isEditing && interviews.length > 0 && (
                <div>
                    {interviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="mt-8 mx-auto w-5/6 p-4 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white cursor-pointer relative"
                        >
                            <h2 className="text-xl font-bold">{interview.jobTitle}</h2>
                            <p className="text-sm text-gray-500 mt-2">{interview.aiPrompt}</p>
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={(event) => handleMenuClick(event, interview.id)}
                                    className="p-2 text-gray-500 hover:text-black"
                                >
                                    &#x22EE;
                                </button>
                                {showMenu === interview.id && (
                                    <div
                                        className="fixed bg-white border rounded-lg shadow-lg"
                                        style={{
                                            top: `${menuPosition.y}px`,
                                            left: `${menuPosition.x}px`,
                                            zIndex: 50,
                                        }}
                                    >
                                        <button
                                            onClick={() => handleEdit(interview)}
                                            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
