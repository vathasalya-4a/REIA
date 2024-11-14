// components/hooks/use-toast.ts

import { useState } from "react";

type ShowToastProps = {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toast, setToast] = useState<ShowToastProps | null>(null);

  const showToast = ({ title = "Notification", description, variant = "default" }: ShowToastProps) => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000); // Automatically clear the toast after 3 seconds
  };

  return {
    showToast,
    toast,
  };
}
