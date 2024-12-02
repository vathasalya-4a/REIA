// app/(marketing)/marketing/layout.tsx

import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Marketing | REIA",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:px-1 lg:px-1 bg-white">
      {children}
    </div>
  );
}
