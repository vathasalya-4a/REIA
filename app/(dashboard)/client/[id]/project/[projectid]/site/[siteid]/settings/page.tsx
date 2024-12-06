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
      id: parseInt(decodeURIComponent(params.siteid), 10),
    },
  });

  if (!data) {
    return (
      <div className="flex flex-col space-y-6 p-8">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Candidate not found
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
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
  handleSubmit={updateCandidate}
        id={data.id} 
        idType="project"
/>
      <DeleteSiteForm siteName={data.name} />
    </div>
  );
}
