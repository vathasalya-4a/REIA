"use client";

import Form from "@/components/form";

export default function SettingsForm({ session }) {
  if (!session || !session.user) {
    return <p>Loading user settings...</p>; // Show a loading state if session is not yet available
  }

  const updateUserData = async (data) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const updateCalcomUsername = async (data) => {
    try {
      const res = await fetch("/api/calcom/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.error("Failed to update Cal.com username");
      }
    } catch (error) {
      console.error("Error updating Cal.com username:", error);
    }
  };

  return (
    <>
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
        handleSubmit={(formData) =>
          updateUserData({ id: session.user.id, name: formData.name })
        }
      />
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
        handleSubmit={(formData) =>
          updateUserData({ id: session.user.id, email: formData.email })
        }
      />
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
        handleSubmit={(formData) =>
          updateCalcomUsername({
            userId: session.user.id,
            email: session.user.email || "",
            username: formData.calcomUsername,
          })
        }
      />
    </>
  );
}
