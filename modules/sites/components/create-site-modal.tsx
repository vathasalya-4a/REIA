"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "../../../components/modal/provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { createSite } from "../actions";

export default function CreateSiteModal({
  clientId,
  projectId
}: {
  clientId: string,
  projectId: string;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedinURL: "",
    location: "",
    workauthorization: "",
    salaryexpectations: "",
    availablehours: "",
    documentsS3URL: "",
    createdAt: "",
    image: "",
    imageBlurhash: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Create the project using form data and projectId
    const res = await createSite(formData, projectId);
    if ("error" in res) {
      toast.error(res.error); // Handle error case
    } else {
      va.track("Created Candidate");
      const { id } = res;
      router.refresh();
      router.push(`/client/${clientId}/project/${projectId}/site/${id}`);
      modal?.hide();
      toast.success(`Successfully created Candidate!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // Updated from onClick to onSubmit
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a new Candidate</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
           <label
            htmlFor="email"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Email
          </label>
          <input
            name="email"
            type="text"
            placeholder="johndoe@example.com"
            autoFocus
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}

function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Candidate</p>}
    </button>
  );
}
