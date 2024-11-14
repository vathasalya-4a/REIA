// modules/auth/components/login-button.tsx

"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppToast } from "@/components/ui/ToastProvider"; // Use custom useAppToast hook

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const showToast = useAppToast(); // Use showToast from custom useAppToast hook
  const router = useRouter(); // Use router for redirection

  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) {
      showToast({
        title: "Error",
        description: "An error occurred during sign-in.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleSignIn = async () => {
    if (!email) {
      showToast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("email", { email, redirect: false });
      
      if (result?.ok) {
        showToast({
          title: "Success",
          description: "The login link has been sent, please check your email.",
        });
        
        // Redirect to dashboard after successful sign-in
        router.push("/dashboard");
      } else {
        showToast({
          title: "Error",
          description: "Sign-in failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Sign-in failed. Please try again.",
        variant: "destructive",
      });
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
        onClick={handleSignIn}
        className={`${
          loading ? "cursor-not-allowed bg-gray-600" : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
        } group h-10 w-full flex items-center justify-center space-x-2 rounded-md transition-colors duration-75 focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <p className="text-sm font-medium">Sign In with Email</p>
        )}
      </button>
    </div>
  );
}
