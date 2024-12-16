"use server";

import prisma from "@/prisma";

export const removeTeammate = async (userId: string, siteId: string) => {
  if (!userId) {
    return {
      error: "Missing userId",
      status: 400,
    };
  }
  const clientUser = await prisma.clientUser.findUnique({
    where: {
      userId_clientId: {
        clientId: siteId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });
  if (clientUser?.role === "owner") {
    return {
      error:
        "Cannot remove owner from site. Please transfer ownership to another user first.",
      status: 400,
    };
  }
  const response = await prisma.clientUser.delete({
    where: {
      userId_clientId: {
        clientId: siteId,
        userId,
      },
    },
  });

  return response;
};
