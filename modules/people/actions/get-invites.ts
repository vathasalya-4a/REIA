"use server";

import prisma from "@/prisma";

export const getInvites = async (siteId: string) => {
  const invites = await prisma.clientInvite.findMany({
    where: {
      client: {
        id: siteId,
      },
    },
    select: {
      email: true,
      createdAt: true,
    },
  });

  return invites.map((invite) => ({
    email: invite.email || null,
    createdAt: invite.createdAt,
  }));
};
