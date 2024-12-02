import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Form from "@/components/form";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Settings</h1>

        {/* Form to update the user's name */}
        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user.name || "",
            placeholder: "John Doe",
            maxLength: 32,
          }}
          handleSubmit={async (formData) => {
            try {
              const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: session.user.id,
                  name: formData.name,
                }),
              });

              if (!res.ok) {
                console.error("Failed to update name");
              }
            } catch (error) {
              console.error("Error updating name:", error);
            }
          }}
        />

        {/* Form to update the user's email */}
        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email address."
          inputAttrs={{
            name: "email",
            type: "email",
            defaultValue: session.user.email || "",
            placeholder: "johndoe@example.com",
          }}
          handleSubmit={async (formData) => {
            try {
              const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: session.user.id,
                  email: formData.email,
                }),
              });

              if (!res.ok) {
                console.error("Failed to update email");
              }
            } catch (error) {
              console.error("Error updating email:", error);
            }
          }}
        />

        {/* Form to create or update Cal.com username */}
        <Form
          title="Cal.com Username"
          description="Your Cal.com profile username."
          helpText="This username will be used for your booking page."
          inputAttrs={{
            name: "calcomUsername",
            type: "text",
            defaultValue: session.user.calcomUsername || "",
            placeholder: "your-username",
          }}
          handleSubmit={async (formData) => {
            try {
              const res = await fetch("/api/calcom/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: session.user.id,
                  email: session.user.email || "",
                  username: formData.calcomUsername,
                }),
              });

              if (!res.ok) {
                console.error("Failed to create or update Cal.com username");
              }
            } catch (error) {
              console.error("Error creating or updating Cal.com username:", error);
            }
          }}
        />
      </div>
    </div>
  );
}
