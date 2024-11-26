import React from "react";

interface InterviewDetailsProps {
    details: {
        id: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        rating: number;
        aiFeedback: string;
        interviewTranscript: Array<{ role: "user" | "assistant"; content: string }>;
    };
}

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ details }) => {
    const calculateTimeAgo = (timestamp: string) => {
        const now = new Date();
        const interviewTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - interviewTime.getTime()) / (1000 * 60 * 60));
        return `${diffInHours} hours ago`;
    };

    return (
        <div className="mt-4 grid grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar pr-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {details.firstName} {details.lastName}
                    </h2>
                    <p className="pt-2 text-sm text-gray-500">About {calculateTimeAgo(details.createdAt)}</p>
                    <p className="pt-2 text-gray-700 dark:text-gray-300">
                        <strong>AI Feedback:</strong> {details.rating}/5
                    </p>
                </div>
                <div>
                <textarea
    readOnly
    className="w-full mt-2 max-h-[60vh] border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-stone-700 resize-none"
    rows={7} 
    value={details.aiFeedback}
/>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Interview Conversation
                </h2>
                <div className="space-y-4">
                    {details.interviewTranscript.map((message, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg ${
                                message.role === "user"
                                    ? "bg-gray-300 text-black self-end"
                                    : "ml-20 bg-black text-white self-start"
                            }`}
                            style={{
                                maxWidth: "70%",
                                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            {message.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterviewDetails;
