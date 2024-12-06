"use client";

import React, { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { SendIcon, PhoneCallIcon } from "lucide-react";

export default function Contact() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [communicationType, setCommunicationType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [callStatus, setCallStatus] = useState("");

    const handleSendMessage = async () => {
        setLoading(true);
        setCallStatus("");

        try {
            const requestBody: {
                phoneNumber: string;
                communicationType: string;
                message?: string; // Optional property
            } = {
                phoneNumber,
                communicationType,
            };

            if (communicationType === "Text Message") {
                requestBody.message = message;
            }

            const response = await fetch("/api/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();

            if (communicationType === "Call") {
                setCallStatus(data.callStatus || "Call in progress...");
            } else {
                alert("Message sent successfully!");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-y-auto resize-none custom-scrollbar p-6 relative">
            <h1 className="mt-3 text-center font-cal text-3xl text-black-200">
                Contact
            </h1>
            <div className="mt-6 mx-auto w-5/6 p-9 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                >
                    <label className="block mb-2 text-sm font-medium">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        className="block w-full p-2 mb-4 border rounded"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />

                    <label className="block mb-2 text-sm font-medium">
                        Communication Type
                    </label>
                    <select
                        className="block w-full p-2 mb-4 border rounded"
                        value={communicationType}
                        onChange={(e) => setCommunicationType(e.target.value)}
                        required
                    >
                        <option value="">Select communication type</option>
                        <option value="Call">Call</option>
                        <option value="Text Message">Text Message</option>
                    </select>

                    {communicationType === "Text Message" && (
                        <>
                            <label className="block mb-2 text-sm font-medium">
                                Message
                            </label>
                            <textarea
                                className="block w-full p-2 mb-4 border rounded"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </>
                    )}

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="flex items-center justify-center w-auto px-6 py-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingDots />
                            ) : communicationType === "Call" ? (
                                <>
                                    <PhoneCallIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                                    <span>Call</span>
                                </>
                            ) : (
                                <>
                                    <SendIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                                    <span>Send</span>
                                </>
                            )}
                        </button>
                    </div>

                    {communicationType === "Call" && callStatus && (
                        <p className="mt-4 text-center text-sm font-medium text-gray-700">
                            {callStatus}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
