import prisma from "@/prisma";
import Form from "@/components/form";
import DeleteClientForm from "@/modules/clients/components/delete-client-form";
import { updateClient } from "@/modules/clients//actions";

export default async function ClientSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.client.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  return (
    <div className="flex flex-col space-y-6 p-10">
      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={(formData) => {
          const formDataObj = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
          });
          updateClient(data?.id!, formDataObj);
        }}
      />

      <Form
        title="State"
        description="The description of your state. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "state",
          type: "text",
          defaultValue: data?.state!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={(formData) => {
          const formDataObj = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
          });
          updateClient(data?.id!, formDataObj);
        }}
      />
      <DeleteClientForm clientName={data?.name!} />
    </div>
  );
}
