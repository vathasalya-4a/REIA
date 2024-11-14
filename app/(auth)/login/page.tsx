
"use client";
import Image from "next/image";
import LoginButton from "@/modules/auth/components/login-button";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/marketing")} 
        className="absolute top-4 left-4 text-stone-600 dark:text-stone-400 hover:underline"
      >
        ← Back
      </button>
      <Image
        alt="Platforms Starter Kit"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/logo.png"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        REIA
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Resume Evaluation and Interviewing Assistant <br />
      </p>
      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginButton />
        </Suspense>
      </div>
      <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">
        <Link href="/register" className="underline text-stone-600 dark:text-stone-400">
          Don’t have an account? Sign Up
        </Link>
      </p>
    </div>
  );
}
