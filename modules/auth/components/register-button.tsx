"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function RegisterButton() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Get error message from URL parameters (if any)
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  // Function to check if user exists
  const checkUserExists = async (email: string) => {
    const res = await fetch("/api/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.exists;
  };

  const handleRegister = async () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    setLoading(true);
    try {
      const userExists = await checkUserExists(email);
      if (userExists) {
        // If user exists, redirect to /sites
        toast.success("User exists. Redirecting to your dashboard...");
        router.push("/sites");
      } else {
        // If user doesn't exist, initiate sign-in/registration
        await signIn("email", { email, callbackUrl: "/sites" });
        toast.success("Check your email for a registration link.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        onClick={handleRegister}
        className={`${
          loading
            ? "cursor-not-allowed bg-gray-600"
            : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
        } group h-10 w-full flex items-center justify-center space-x-2 rounded-md transition-colors duration-75 focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <>
            <svg
              className="h-4 w-4 text-white"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M1.5 4.5A2 2 0 013.5 3h17a2 2 0 012 2v14a2 2 0 01-2 2h-17a2 2 0 01-2-2v-14zm18 1H4.5a.5.5 0 00-.33.88L12 12.76l7.83-6.38a.5.5 0 00-.33-.88H3.5zM21 6.56L12 14.44 3 6.56V18.5a.5.5 0 00.5.5h17a.5.5 0 00.5-.5V6.56z" />
            </svg>
            <p className="text-sm font-medium">Register with Email</p>
          </>
        )}
      </button>
    </div>
  );
}
