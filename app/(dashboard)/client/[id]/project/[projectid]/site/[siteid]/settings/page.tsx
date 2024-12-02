import prisma from "@/prisma";
import Form from "@/components/form";
import { updateCandidate, deleteCandidate } from "@/modules/sites/actions";

export default async function CandidateSettingsPage({
  params,
}: {
  params: { candidateId: string };
}) {
  // Fetch the candidate data
  const data = await prisma.candidate.findUnique({
    where: {
      id: parseInt(params.candidateId), // Parse the candidate ID from the params
    },
  });

  if (!data) {
    throw new Error("Candidate not found"); // Ensure candidate exists
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
        Candidate Settings
      </h1>

      {/* Update Candidate Form */}
      <Form
        title="Name"
        description="The name of your candidate. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data.name,
          placeholder: "Candidate Name",
          maxLength: 32,
        }}
        handleSubmit={(formData) =>
          updateCandidate(data.id, {
            name: formData.get("name") as string,
          })
        }
      />

      <Form
        title="Email"
        description="The email of your candidate. This will be used for notifications."
        helpText="Make sure the email is valid."
        inputAttrs={{
          name: "email",
          type: "email",
          defaultValue: data.email,
          placeholder: "Candidate Email",
        }}
        handleSubmit={(formData) =>
          updateCandidate(data.id, {
            email: formData.get("email") as string,
          })
        }
      />

      {/* Delete Candidate Form */}
      <button
        onClick={async () => {
          const result = await deleteCandidate(data.id);
          if (result.error) {
            alert(`Error deleting candidate: ${result.error}`);
          } else {
            alert("Candidate deleted successfully!");
          }
        }}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Delete Candidate
      </button>
    </div>
  );
}
