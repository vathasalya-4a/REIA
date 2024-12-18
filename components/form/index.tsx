"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "../../modules/sites/components/domain-status";
import DomainConfiguration from "../../modules/sites/components/domain-configuration";
import Uploader from "./uploader";
import va from "@vercel/analytics";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
  id,
  idType,
}: {
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: (
    id: string | number,
    formData: FormData,
    key: string,
    idType: string
  ) => Promise<any>;
  id: string | number;
  idType: "user" | "client" | "project" | "site";
}) {
  const router = useRouter();
  const { update } = useSession();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await handleSubmit(id, data, inputAttrs.name, idType);
      if (res.error) {
        toast.error(res.error);
      } else {
        va.track(`Updated ${idType} ${inputAttrs.name}`, { id });
        router.refresh();
        toast.success(`Successfully updated ${idType}!`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      action={onSubmit}
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">{title}</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
        {renderInput(inputAttrs)}
      </div>
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-stone-500 dark:text-stone-400">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function renderInput(inputAttrs: any) {
  switch (inputAttrs.name) {
    case "image":
    case "logo":
      return <Uploader defaultValue={inputAttrs.defaultValue} name={inputAttrs.name} />;
    case "font":
      return (
        <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-stone-600">
          <select
            name="font"
            defaultValue={inputAttrs.defaultValue}
            className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-black dark:bg-black dark:text-stone-200 dark:focus:ring-white"
          >
            <option value="font-cal">Cal Sans</option>
            <option value="font-lora">Lora</option>
            <option value="font-work">Work Sans</option>
          </select>
        </div>
      );
    case "subdomain":
      return (
        <div className="flex w-full max-w-md">
          <input
            {...inputAttrs}
            required
            className="z-10 flex-1 rounded-l-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
          <div className="flex items-center rounded-r-md border border-l-0 border-stone-300 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
            {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
          </div>
        </div>
      );
    case "customDomain":
      return (
        <div className="relative flex w-full max-w-md">
          <input
            {...inputAttrs}
            className="z-10 flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
          {inputAttrs.defaultValue && (
            <div className="absolute right-3 z-10 flex h-full items-center">
              <DomainStatus domain={inputAttrs.defaultValue} />
            </div>
          )}
        </div>
      );
    case "description":
      return (
        <textarea
          {...inputAttrs}
          rows={3}
          required
          className="w-full max-w-xl rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
        />
      );
    default:
      return (
        <input
          {...inputAttrs}
          required
          className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
        />
      );
  }
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
