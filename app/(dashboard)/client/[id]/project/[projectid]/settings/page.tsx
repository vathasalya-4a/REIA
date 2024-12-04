import prisma from "@/prisma";
import Form from "@/components/form";
import { updateProject } from "@/modules/projects/actions";
import DeleteProjectForm from "@/modules/projects/components/delete-project-form";

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

  if (!data) {
    return (
      <div className="flex flex-col space-y-6 p-8">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Project not found
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
        description="The name of your project. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data.name,
          placeholder: "My Awesome Project",
          maxLength: 32,
        }}
        handleSubmit={updateProject}
        id={data.id} 
        idType="project"
      />
      <DeleteProjectForm projectName={data.name} />
    </div>
  );
}
