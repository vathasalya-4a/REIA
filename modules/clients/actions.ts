"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { Client } from "@prisma/client";
import prisma from "@/prisma";

export const createClient = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const state = formData.get("state") as string;

  try {
    const response = await prisma.client.create({
      data: {
        name,
        state,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    return response;
  } catch (error: any) {
    console.log(error.message);
    return {
      error: error.message,
    };
  }
};
