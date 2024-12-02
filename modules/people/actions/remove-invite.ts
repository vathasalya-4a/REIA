"use server";

import prisma from "@/prisma";

export const removeInvite = async (email: string, siteId: string) => {
  if (!email) {
    return {
      error: "Missing email",
      status: 400,
    };
  }

  const clientInvite = await prisma.clientInvite.findUnique({
    where: {
      email_clientId: {
        email,
        clientId: siteId,
      },
    },
    select: {
      email: true,
    },
  });

  if (!clientInvite?.email) {
    return {
      error:
        "Didn't find an invite with that email. Please refresh the page and try again.",
      status: 400,
    };
  }

  const response = await prisma.clientInvite.delete({
    where: {
      email_clientId: {
        email,
        clientId: siteId,
      },
    },
  });

  return response;
};
