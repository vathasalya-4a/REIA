import React, { useState } from "react";

interface InterviewDetailsProps {
    details: {
        id: string;
        firstName?: string;
        lastName?: string;
        createdAt?: string;
        rating?: number;
        aiFeedback?: string;
        interviewTranscript?: Array<{ role: "user" | "assistant"; content: string }>;
        audioFileName?: string;
    };
}

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ details }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

    const calculateTimeAgo = (timestamp?: string) => {
        if (!timestamp) return "Unknown time";
        const now = new Date();
        const interviewTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - interviewTime.getTime()) / (1000 * 60 * 60));
        return `${diffInHours} hours ago`;
    };

    const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

    const fetchAudioFile = async (audioFileName: string) => {
        if (!API_TOKEN) {
            console.error("API token is missing.");
            return;
        }
        setLoadingAudio(true);
        try {
            const response = await fetch(
                `https://recrooai.com/api/ext/get/audio/${audioFileName}`,
                {
                    headers: { authorization: API_TOKEN },
                }
            );
            if (response.ok) {
                const audioBlob = await response.blob();
                const audioObjectUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioObjectUrl);
            } else {
                console.error("Failed to fetch audio file.");
            }
        } catch (error) {
            console.error("Error fetching audio file:", error);
        } finally {
            setLoadingAudio(false);
        }
    };    

    React.useEffect(() => {
        if (details.audioFileName) {
            fetchAudioFile(details.audioFileName);
        }
    }, [details.audioFileName]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto mt-2">
            {/* Header Section */}
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {details.firstName || "First Name"} {details.lastName || "Last Name"}
                </h2>
                <p className="text-sm text-gray-500">
                    {details.createdAt
                        ? `Submitted ${calculateTimeAgo(details.createdAt)}`
                        : "Interview time not available"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Rating:</strong>{" "}
                    {details.rating !== undefined ? `${details.rating}/5` : "No rating available"}
                </p>
                </div>
    
            {/* Feedback Section */}
            <div className="border text-center rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Feedback</h3>
                <textarea
                    readOnly
                    className="w-full mt-2 border-none resize-none"
                    rows={7}
                    value={details.aiFeedback || "No AI feedback provided"}
                />
            </div>
            </div>
    
            {/* Interview Conversation Section */}
            <div className="border text-center rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Interview Conversation
                </h3>
                <div className="space-y-4 mt-4 overflow-y-auto custom-scrollbar max-h-[82vh] p-10">
                    {details.interviewTranscript && details.interviewTranscript.length > 0 ? (
                        details.interviewTranscript.map((message, index) => (
                            <div
                                key={index}
                                className={`pt-2 pl-4 pr-4 pb-2 rounded-lg ${
                                    message.role === "user"
                                        ? "ml-auto bg-gray-300 text-black"
                                        : "mr-auto bg-black text-white"
                                }`}
                                style={{ maxWidth: "70%" }}
                            >
                                {message.content || "No content available"}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                            No interview transcript available.
                        </p>
                    )}
                </div>
            </div>
    
            {/* Audio Player Section */}
            <div className="border text-center rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Audio</h3>
                <audio
                    controls
                    className={`w-full ${
                        audioUrl ? "opacity-100" : "opacity-50 pointer-events-none"
                    }`}
                >
                    {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
        </div>
    );
};

export default InterviewDetails;
