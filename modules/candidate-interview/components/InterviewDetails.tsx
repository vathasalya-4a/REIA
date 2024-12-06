import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingCircle from "@/components/icons/loading-circle";

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
        screenshots?: string[];
    };
}

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ details }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
    const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
    const [loadingScreenshot, setLoadingScreenshot] = useState<boolean>(false);
    const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);

    const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

    const calculateTimeAgo = (timestamp?: string) => {
        if (!timestamp) return "Unknown time";
        const now = new Date();
        const interviewTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - interviewTime.getTime()) / (1000 * 60 * 60));
        return `${diffInHours} hours ago`;
    };

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

    const fetchScreenshots = async () => {
        if (!API_TOKEN || !details.screenshots) {
            console.error("API token or screenshot data is missing.");
            return;
        }

        setLoadingScreenshot(true);
        try {
            const urls = await Promise.all(
                details.screenshots.map(async (fileName) => {
                    const response = await fetch(
                        `https://recrooai.com/api/ext/get/screenshot/${fileName}`,
                        {
                            headers: { authorization: API_TOKEN },
                        }
                    );
                    if (response.ok) {
                        const blob = await response.blob();
                        return URL.createObjectURL(blob);
                    } else {
                        console.error(`Failed to fetch screenshot: ${fileName}`);
                        return "";
                    }
                })
            );
            setScreenshotUrls(urls.filter((url) => url));
        } catch (error) {
            console.error("Error fetching screenshots:", error);
        } finally {
            setLoadingScreenshot(false);
        }
    };

    useEffect(() => {
        if (details.audioFileName) {
            fetchAudioFile(details.audioFileName);
        }
        if (details.screenshots && details.screenshots.length > 0) {
            fetchScreenshots();
        }
    }, [details.audioFileName, details.screenshots]);

    const handleNextScreenshot = () => {
        if (screenshotUrls.length > 0) {
            setCurrentScreenshotIndex((prevIndex) => (prevIndex + 1) % screenshotUrls.length);
        }
    };

    const handlePrevScreenshot = () => {
        if (screenshotUrls.length > 0) {
            setCurrentScreenshotIndex((prevIndex) =>
                (prevIndex - 1 + screenshotUrls.length) % screenshotUrls.length
            );
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto mt-2">
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
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Feedback</h3>
                <textarea
                    readOnly
                    className="w-full mt-2 border-none resize-none"
                    rows={7}
                    value={details.aiFeedback || "No AI feedback provided"}
                />
            </div>

            {/* Screenshots Section */}
            {screenshotUrls.length > 0 && (
                <div className="border text-center rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handlePrevScreenshot}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-md hover:bg-gray-400 dark:hover:bg-gray-600"
                            aria-label="Previous Screenshot"
                            disabled={loadingScreenshot}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex items-center justify-center h-[300px] w-full">
                            {loadingScreenshot ? (
                                <LoadingCircle dimensions="h-10 w-10" />
                            ) : (
                                <img
                                    src={screenshotUrls[currentScreenshotIndex]}
                                    alt={`Screenshot ${currentScreenshotIndex + 1}`}
                                    className="w-full max-h-[300px] object-contain"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleNextScreenshot}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-md hover:bg-gray-400 dark:hover:bg-gray-600"
                            aria-label="Next Screenshot"
                            disabled={loadingScreenshot}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}

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
