import { Client } from "@prisma/client";  // Ensure you import Client from Prisma
import { BarChart } from "lucide-react";
import Link from "next/link";

interface ClientCardProps {
  data: Client & {
    projects: { id: string; name: string }[]; // Include projects in the type
    createdAt: Date; // Add createdAt if needed
    updatedAt: Date; // Add updatedAt if needed
  };
}

export default function ClientCard({ data }: ClientCardProps) {
  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href={`/client/${data.id}`}  // Link to the client-specific page
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <h4 className="text-sm text-stone-500 dark:text-stone-400">
            State: {data.state}
          </h4>
          <div className="mt-2 flex items-center space-x-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {data.projects.length} Project{data.projects.length !== 1 ? 's' : ''}
            </p>
            <BarChart size={16} />
          </div>
        </div>
      </Link>
    </div>
  );
}
