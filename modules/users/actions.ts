"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/prisma";

export const editUser = async (
  id: string,
  formData: FormData,
  key: string,
  idType: string
): Promise<{ data?: any; error?: string }> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const value = formData.get(key) as string | null;

  if (!value) {
    return { error: `Invalid value for key: ${key}` };
  }

  try {
    const response = await prisma.user.update({
      where: { id: session.user.id },
      data: { [key]: value },
    });
    return { data: response };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: `This ${key} is already in use` };
    }
    return { error: error.message || "An unknown error occurred" };
  }
};

