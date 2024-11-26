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
                const audioBlob = await response.blob(); // Get the audio file as a binary blob
                const audioObjectUrl = URL.createObjectURL(audioBlob); // Create an object URL
                setAudioUrl(audioObjectUrl); // Set the object URL as the audio source
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
        <div className="mt-4 grid grid-cols-[2fr_1fr] gap-2">
    <div className="space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar pr-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {details.firstName || "First Name"} {details.lastName || "Last Name"}
            </h2>
            <p className="pt-2 text-sm text-gray-500">
                {details.createdAt
                    ? `About ${calculateTimeAgo(details.createdAt)}`
                    : "Interview time not available"}
            </p>
            <p className="pt-2 text-gray-700 dark:text-gray-300">
                <strong>AI Feedback:</strong>{" "}
                {details.rating !== undefined ? `${details.rating}/5` : "No rating available"}
            </p>
        </div>
        <div>
            <textarea
                readOnly
                className="w-full mt-2 max-h-[60vh] border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-stone-700 resize-none"
                rows={7}
                value={details.aiFeedback || "No AI feedback provided"}
            />
        </div>
    </div>

    <div className="flex flex-col justify-between h-[80vh]">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Interview Conversation
    </h2>
        <div
            className="space-y-4 overflow-y-auto custom-scrollbar pr-4 flex-grow"
            style={{ maxHeight: "70%" }}
        >
            {details.interviewTranscript && details.interviewTranscript.length > 0 ? (
                details.interviewTranscript.map((message, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${
                            message.role === "user"
                                ? "ml-20 bg-gray-300 text-black self-end"
                                : "bg-black text-white self-start"
                        }`}
                        style={{
                            maxWidth: "70%",
                            alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                        }}
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

        <div className="mt-4">
            <audio
                controls
                className={`w-full mt-2 ${
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
