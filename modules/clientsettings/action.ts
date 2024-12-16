// modules/clientsettings/actions.ts
import prisma from "@/prisma";

// Function to update the client data in the database
export async function updateClient(id: string, data: any) {
  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data,
    });
    return updatedClient;
  } catch (error) {
    console.error("Error updating client:", error);
    throw new Error("Error updating client");
  }
}
