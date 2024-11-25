import BlurImage from "@/components/ui/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Candidate } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SiteCard({
  data,
  clientId,
  projectId,
}: {
  data: Candidate;
  clientId: string;
  projectId: string;
}) {
  const siteId = data.id; // Correctly assign the id to siteId
  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href={`/client/${clientId}/project/${projectId}/site/${siteId}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <h4>{new Date(data.createdAt).toLocaleDateString()}</h4> {/* Ensure `createdAt` is formatted properly */}
        </div>
      </Link>
    </div>
  );
}
