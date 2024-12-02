// components/ui/ToastProvider.tsx
"use client"
import { createContext, useContext, ReactNode } from "react";
import { Toast, ToastTitle, ToastDescription, ToastProvider as RadixToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/hooks/use-toast";

const ToastContext = createContext<any>(null);

export const AppToastProvider = ({ children }: { children: ReactNode }) => {
  const { toast, showToast } = useToast();

  return (
    <ToastContext.Provider value={showToast}>
      <RadixToastProvider>
        {children}
        <ToastViewport />
        {toast && (
          <Toast variant={toast.variant}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </Toast>
        )}
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};

export const useAppToast = () => useContext(ToastContext);
