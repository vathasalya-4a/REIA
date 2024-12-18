import { Suspense } from "react";
import Sites from "@/modules/sites/components/sites";
import PlaceholderCard from "@/components/ui/placeholder-card";
import CreateSiteButton from "@/modules/sites/components/create-site-button";
import CreateSiteModal from "@/modules/sites/components/create-site-modal";

export default function AllSites({
  params,
}: {
  params: { id: string, projectid: string };
}) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Candidates
          </h1>
          <CreateSiteButton>
            <CreateSiteModal clientId = { params.id } projectId = { params.projectid} />
          </CreateSiteButton>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          <Sites clientId = {params.id} projectId = {params.projectid} />
        </Suspense>
      </div>
    </div>
  );
}
