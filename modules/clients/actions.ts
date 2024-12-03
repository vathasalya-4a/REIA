"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
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
    // Step 1: Create the Client
    const client = await prisma.client.create({
      data: {
        name,
        state,
      },
    });

    // Step 2: Add the user to the ClientUser table and associate with the Client
    const clientUser = await prisma.clientUser.create({
      data: {
        user: {
          connect: { id: session.user.id }, // Connect the current user
        },
        client: {
          connect: { id: client.id }, // Connect the created Client
        },
        role: "owner", // Default role
      },
    });

    return client;
  } catch (error: any) {
    console.log(error.message);
    return {
      error: error.message,
    };
  }
};

export const updateClient = async (id: string, formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const name = formData.get("name") as string | undefined;
  const state = formData.get("state") as string | undefined;

  try {
    const response = await prisma.client.update({
      where: {
        id,
      },
      data: {
        ...(name && { name }),
        ...(state && { state }),
      },
    });
    revalidateTag("client");
    return response;
  } catch (error: any) {
    console.log(error.message);
    return {
      error: error.message,
    };
  }
};

export const deleteClient = async (id: string, formData: FormData, action: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  // Optional action validation
  if (action !== "delete") {
    return {
      error: "Invalid action",
    };
  }

  const confirmName = formData.get("confirm") as string;

  // Retrieve client name for validation
  const client = await prisma.client.findUnique({
    where: {
      id,
    },
  });

  if (!client || client.name !== confirmName) {
    return {
      error: "Client name does not match or client does not exist.",
    };
  }

  try {
    const response = await prisma.client.delete({
      where: {
        id,
      },
    });
    revalidateTag("client"); // Ensures updated data is reflected on the frontend
    return response;
  } catch (error: any) {
    console.log(error.message);
    return {
      error: error.message,
    };
  }
};
