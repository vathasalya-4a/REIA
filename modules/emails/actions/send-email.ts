"use server";

import { ReactElement, JSXElementConstructor } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test,
}: {
  email: string | string[];
  subject: string;
  react:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | null
    | undefined;
  marketing?: boolean;
  test?: boolean;
}) => {
  // Prepare the email object
  const mail = {
    from: marketing
      ? "X from REIA <onboarding@resend.dev>"
      : "REIA <onboarding@resend.dev>",
    to: test ? "delivered@resend.dev" : email,
    subject,
    react,
  };

  try {
    // Send the email using Resend
    const response = await resend.emails.send(mail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
