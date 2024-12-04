import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Form from "@/components/form";
import { editUser } from "@/modules/users/actions";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login"); // Redirect if the user is not logged in
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Settings</h1>

        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user.name ?? "",
            placeholder: "Brendon Urie",
            maxLength: 32,
          }}
          handleSubmit={(id: string, formData: FormData, key: string) =>
            editUser(id, formData, key) // Pass all three arguments
          }
          id={session.user.id.toString()} // Pass the user ID as a string
          idType="user" // Specify the correct idType
        />

        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: "email",
            type: "email",
            defaultValue: session.user.email ?? "",
            placeholder: "panic@thedis.co",
          }}
          handleSubmit={(id: string, formData: FormData, key: string) =>
            editUser(id, formData, key) // Pass all three arguments
          }
          id={session.user.id.toString()}
          idType="user"
        />
      </div>
    </div>
  );
}