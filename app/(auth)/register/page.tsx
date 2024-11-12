import Link from "next/link";
import RegisterButton from "@/modules/auth/components/register-button";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Welcome Message */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to REIA</h1>
        <Link href="/" className="mt-4 text-lg underline text-black">
          Back to Home
        </Link>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex flex-col justify-center items-center w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-2xl font-bold">Create an account</h2>
          <p className="text-center text-gray-500 mt-2">
            Enter your email below to create your account
          </p>

          <div className="mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterButton />
            </Suspense>
          </div>

          <p className="mt-4 text-xs text-center text-gray-500">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline text-gray-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline text-gray-500">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
