import { Project } from "@prisma/client";  // Ensure you import Project from Prisma
import { BarChart } from "lucide-react";
import Link from "next/link";

// Define the type for the data prop explicitly
interface ProjectCardProps {
  data: Project; // Only the Project data is required here
  clientId: string;
}

export default function ProjectCard({ data, clientId }: ProjectCardProps) {
  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href={`/client/${clientId}/project/${data.id}`}   // Link to the project-specific page
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <h4 className="text-sm text-stone-500 dark:text-stone-400">
            Status: {data.status}
          </h4>
          <div className="mt-2 flex items-center space-x-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Start Date: {data.startdate?.toLocaleDateString() || 'N/A'}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              End Date: {data.enddate?.toLocaleDateString() || 'N/A'}
            </p>
            <BarChart size={16} />
          </div>
        </div>
      </Link>
    </div>
  );
}
