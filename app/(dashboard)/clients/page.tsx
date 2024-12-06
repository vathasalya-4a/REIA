import { Suspense } from "react";
import Clients from "@/modules/clients/components/clients";
import PlaceholderCard from "@/components/ui/placeholder-card";
import CreateClientButton from "@/modules/clients/components/create-client-button";
import CreateClientModal from "@/modules/clients/components/create-client-modal";

export default function AllClients() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Clients
          </h1>
          <CreateClientButton>
            <CreateClientModal />
          </CreateClientButton>
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
          <Clients />
        </Suspense>
      </div>
    </div>
  );
}
