import prisma from "@/prisma";
import Form from "@/components/form";
import { updateCandidate } from "@/modules/sites/actions";
import DeleteSiteForm from "@/modules/sites/components/delete-site-form";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { siteid: string };
}) {
  const data = await prisma.candidate.findUnique({
    where: {
      id: parseInt(decodeURIComponent(params.siteid), 10), // Ensure id is parsed as an integer
    },
  });

  if (!data) {
    // Handle case where the candidate is not found
    return (
      <div className="flex flex-col space-y-6 p-8">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Candidate not found
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
        Settings for {data.name}
      </h1>
      <Form
        title="Name"
        description="The name of the candidate. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data.name,
          placeholder: "My Awesome Candidate",
          maxLength: 32,
        }}
        handleSubmit={(id: string, formData: FormData, key: string, idType: string) => {
          // Convert string `id` to number before passing to `updateCandidate`
          return updateCandidate(parseInt(id, 10), formData);
        }}
        id={data.id.toString()} // Convert `id` to string for the `Form` component
        idType="site" // Specify the correct idType
      />
      <DeleteSiteForm siteName={data.name} />
    </div>
  );
}
