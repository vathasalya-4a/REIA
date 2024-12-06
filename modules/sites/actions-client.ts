"use server";

import { updateCandidate } from "@/modules/sites/actions";

export const handleUpdateCandidate = async (
  id: number,
  key: string,
  value: string
) => {
  try {
    const data = { [key]: value };
    const response = await updateCandidate(id, data);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (error: any) {
    console.error("Error updating candidate:", error.message);
    return { error: error.message };
  }
};
