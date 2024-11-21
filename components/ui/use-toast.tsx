import { useState } from 'react';

type ToastOptions = {
  description: string;
};

export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toast = ({ description }: ToastOptions) => {
    setToastMessage(description);
    setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
  };

  return { toast, toastMessage };
}
