"use server";

import { getSession } from "@/lib/auth";
import { withUserAuth } from "@/modules/users/auth";
import prisma from "@/prisma";

export const acceptInvite = withUserAuth(async (siteId: string) => {
  if (!siteId || typeof siteId !== "string") {
    return {
      status: 400,
      error: "Missing or misconfigured site id",
    };
  }

  const session = await getSession();

  const invite = await prisma.clientInvite.findFirst({
    where: {
      email: session?.user?.email,
      client: {
        id: siteId,
      },
    },
    select: {
      expires: true,
      clientId: true,
    },
  });
  if (!invite) {
    return {
      status: 404,
      error: "Invalid invitation",
    };
  } else if (invite.expires < new Date()) {
    return {
      status: 410,
      error: "Invalid invitation",
    };
  } else {
    const response = await Promise.all([
      prisma.clientUser.create({
        data: {
          userId: session?.user?.id || "",
          role: "member",
          clientId: invite.clientId,
        },
      }),
      prisma.clientInvite.delete({
        where: {
          email_clientId: {
            email: session?.user?.email || "",
            clientId: invite.clientId,
          },
        },
      }),
    ]);
    return response;
  }
});
