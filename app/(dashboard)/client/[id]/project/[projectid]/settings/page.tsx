import prisma from "@/prisma";
import Form from "@/components/form";
import DeleteProjectForm from "@modules/projects/components/delete-project-form";
import { updateProject } from "@/modules/projects/actions";

export default async function ProjectSettingsIndex({
  params,
}: {
  params: { projectid: string };
}) {
  const data = await prisma.project.findUnique({
    where: {
      id: decodeURIComponent(params.projectid),
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Name"
        description="The name of your client. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateProject}
      />
      <DeleteProjectForm clientName={data?.name!} />
    </div>
  );
}
