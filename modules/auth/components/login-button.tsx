"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) {
      setToastMessage("An error occurred during sign-in.");
    }
  }, [error]);

  const createCalcomUsername = async (email: string) => {
    const username = email.split("@")[0]; // Generate username from email prefix
    try {
      const response = await fetch("/api/calcom/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create Cal.com profile:", error);
      }
    } catch (error) {
      console.error("Error creating Cal.com profile:", error);
    }
  };

  const handleSignIn = async () => {
    if (!email) {
      setToastMessage("Please enter an email address.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("email", { email, redirect: false });

      if (result?.ok) {
        // Create Cal.com username after successful sign-in
        await createCalcomUsername(email);

        setToastMessage("The login link has been sent, please check your email.");
        router.push("/login"); // Redirect to dashboard after successful sign-in
      } else {
        setToastMessage("Sign-in failed. Please try again.");
      }
    } catch (error) {
      setToastMessage("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToastMessage("");

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-10 p-2 border rounded-md border-stone-300 dark:bg-stone-800 dark:border-stone-600 focus:outline-none focus:border-stone-500"
        disabled={loading}
      />
      <button
        disabled={loading}
        onClick={handleSignIn}
        className={`${
          loading
            ? "cursor-not-allowed bg-gray-600"
            : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
        } group h-10 w-full flex items-center justify-center space-x-2 rounded-md transition-colors duration-75 focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <p className="text-sm font-medium">Sign In with Email</p>
        )}
      </button>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <span>{toastMessage}</span>
          <button onClick={closeToast} className="ml-4 text-black">
            <XMarkIcon className="h-2 w-2" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
